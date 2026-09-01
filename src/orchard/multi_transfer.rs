//! Multi-output shielded transfer.
//!
//! `dpp`'s [`build_shielded_transfer_transition`] hardcodes exactly two outputs
//! — one recipient plus change — so a single transfer can only ever pay one
//! address. Nothing about that is a protocol rule: outputs are ciphertext
//! inside the actions, so consensus never sees how many there are. It validates
//! `actions.len()` (1..=`max_shielded_transition_actions`), the encrypted-note
//! sizes, `value_balance`, the anchor and the proof — none of which care whether
//! the bundle paid one recipient or five. An N-output bundle is already a valid
//! `ShieldedTransfer`; only the builder was single-recipient.
//!
//! This module rebuilds that pipeline with an arbitrary output list.
//! `dpp::shielded::builder::prove_and_sign_bundle` is `pub(crate)`, so the
//! build → sighash → prove → sign sequence is duplicated here, against the same
//! public [`compute_platform_sighash`] the consensus verifier uses — the signed
//! and verified bytes cannot diverge.
//!
//! [`build_shielded_transfer_transition`]: dpp::shielded::builder::build_shielded_transfer_transition

use dpp::{
    address_funds::OrchardAddress,
    fee::Credits,
    shielded::{
        MEMO_SIZE,
        builder::{OrchardProver, SpendableNote, serialize_authorized_bundle},
        compute_minimum_shielded_fee, compute_platform_sighash,
    },
    state_transition::{
        StateTransition,
        shielded_transfer_transition::{
            ShieldedTransferTransition, methods::ShieldedTransferTransitionMethodsV0,
        },
    },
    version::PlatformVersion,
};
use grovedb_commitment_tree::{
    Anchor, Builder, BundleType, DashMemo, FullViewingKey, NoteValue, PaymentAddress, Scope,
    SpendAuthorizingKey,
};
use napi::Status;
use rand::rngs::OsRng;

/// Orchard's `BundleType::DEFAULT` pads every bundle up to this many actions,
/// so even a 1-in/1-out transfer is serialized and proven with two. The
/// constant is private in `orchard::builder`, hence the local copy.
const MIN_ACTIONS: usize = 2;

fn build_error<E: std::fmt::Debug>(context: &str) -> impl FnOnce(E) -> napi::Error + '_ {
    move |error| napi::Error::new(Status::GenericFailure, format!("{context}: {error:?}"))
}

/// Builds a `ShieldedTransfer` paying an arbitrary number of Orchard addresses
/// from one set of spent notes, plus a change note back to `change_address`.
///
/// All spends must belong to the account `fvk`/`ask` were derived from and be
/// witnessed against the same `anchor` — the same constraints the single-output
/// builder carries. Every output (change included) is encrypted under the
/// sender's External-scope OVK, so the sender can recover the whole fan-out —
/// recipients, values, memos — from chain data alone.
///
/// Returns the proven transition and the fee (credits) baked into its
/// `value_balance`.
#[allow(clippy::too_many_arguments)]
pub(crate) fn build_multi_output_shielded_transfer<P: OrchardProver>(
    spends: Vec<SpendableNote>,
    outputs: Vec<(OrchardAddress, u64, [u8; MEMO_SIZE])>,
    change_address: &OrchardAddress,
    fvk: &FullViewingKey,
    ask: &SpendAuthorizingKey,
    anchor: Anchor,
    prover: &P,
    platform_version: &PlatformVersion,
) -> Result<(StateTransition, Credits), napi::Error> {
    if outputs.is_empty() {
        return Err(napi::Error::new(
            Status::InvalidArg,
            "outputs must not be empty",
        ));
    }

    // The change note is emitted unconditionally, even at zero value. That is
    // what makes the fee computable at all: the fee fixes the change amount,
    // which would decide whether a change output exists, which would change the
    // action count, which would change the fee. Emitting it always cuts the
    // cycle — and keeps the bundle shape uniform, which is the same reasoning
    // that makes consensus reject fee overpayment on transfers.
    let num_outputs = outputs.len() + 1;

    // Consensus prices the fee from the ON-WIRE action count, and Orchard sets
    // that to `max(spends, outputs, MIN_ACTIONS)`. The single-output builder can
    // shortcut to `spends.len().max(2)` because it never has more than two
    // outputs; once the output side can dominate, pricing against the spend
    // count alone underpays and the transition is rejected with
    // `InsufficientShieldedFeeError`.
    let num_actions = spends.len().max(num_outputs).max(MIN_ACTIONS);

    let max_actions = platform_version
        .system_limits
        .max_shielded_transition_actions as usize;
    if num_actions > max_actions {
        return Err(napi::Error::new(
            Status::InvalidArg,
            format!(
                "transfer needs {num_actions} actions ({} spends, {num_outputs} outputs including \
                 change), which exceeds the consensus maximum of {max_actions}",
                spends.len()
            ),
        ));
    }

    let fee = compute_minimum_shielded_fee(num_actions, platform_version)
        .map_err(build_error("failed to compute shielded fee"))?;

    let total_spent = spends
        .iter()
        .try_fold(0u64, |acc, spend| {
            acc.checked_add(spend.note.value().inner())
        })
        .ok_or_else(|| napi::Error::new(Status::InvalidArg, "total spent value overflows u64"))?;

    let total_output = outputs
        .iter()
        .try_fold(0u64, |acc, (_, amount, _)| acc.checked_add(*amount))
        .ok_or_else(|| napi::Error::new(Status::InvalidArg, "total output value overflows u64"))?;

    let required = total_output.checked_add(fee).ok_or_else(|| {
        napi::Error::new(
            Status::InvalidArg,
            "fee + total output amount overflows u64",
        )
    })?;
    if required > total_spent {
        return Err(napi::Error::new(
            Status::InvalidArg,
            format!(
                "output amounts {total_output} + fee {fee} = {required} exceeds total spendable \
                 value {total_spent}"
            ),
        ));
    }

    let change_amount = total_spent - required;

    let mut builder = Builder::<DashMemo>::new(BundleType::DEFAULT, anchor);

    for spend in spends {
        builder
            .add_spend(fvk.clone(), spend.note, spend.merkle_path)
            .map_err(build_error("failed to add spend"))?;
    }

    let sender_ovk = fvk.to_ovk(Scope::External);

    for (address, amount, memo) in outputs {
        builder
            .add_output(
                Some(sender_ovk.clone()),
                PaymentAddress::from(&address),
                NoteValue::from_raw(amount),
                memo,
            )
            .map_err(build_error("failed to add output"))?;
    }

    builder
        .add_output(
            Some(sender_ovk),
            PaymentAddress::from(change_address),
            NoteValue::from_raw(change_amount),
            [0u8; MEMO_SIZE],
        )
        .map_err(build_error("failed to add change output"))?;

    // --- prove and sign (mirrors `dpp`'s `pub(crate)` prove_and_sign_bundle) ---
    let mut rng = OsRng;

    let (unauthorized, _) = builder
        .build::<i64>(&mut rng)
        .map_err(build_error("failed to build bundle"))?
        .ok_or_else(|| napi::Error::new(Status::GenericFailure, "bundle was empty after build"))?;

    // ShieldedTransfer binds no transparent fields, so there is no extra sighash
    // data — unlike Unshield/Withdrawal, which commit to their destination.
    let bundle_commitment: [u8; 32] = unauthorized.commitment().into();
    let sighash = compute_platform_sighash(&bundle_commitment, &[]);

    let proven = unauthorized
        .create_proof(prover.proving_key(), &mut rng)
        .map_err(build_error("failed to create proof"))?;

    let bundle = proven
        .apply_signatures(rng, sighash, std::slice::from_ref(ask))
        .map_err(build_error("failed to apply signatures"))?;

    let sb = serialize_authorized_bundle(&bundle);

    // A transfer's `value_balance` IS the fee, and consensus requires it to equal
    // `compute_minimum_shielded_fee(actions.len())` exactly — no under- or
    // overpayment. Catch any drift between the count we priced and the count
    // Orchard actually emitted here, rather than at the node after a proof.
    if sb.actions.len() != num_actions || sb.value_balance != fee as i64 {
        return Err(napi::Error::new(
            Status::GenericFailure,
            format!(
                "built bundle does not match the priced fee: {} actions with value_balance {}, \
                 priced {num_actions} actions at {fee}",
                sb.actions.len(),
                sb.value_balance
            ),
        ));
    }

    let state_transition = ShieldedTransferTransition::try_from_bundle(
        sb.actions,
        sb.value_balance as u64,
        sb.anchor,
        sb.proof,
        sb.binding_signature,
        platform_version,
    )
    .map_err(build_error("failed to build state transition"))?;

    Ok((state_transition, fee))
}
