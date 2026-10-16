use dpp::{
    address_funds::{AddressFundsFeeStrategyStep, OrchardAddress, PlatformAddress},
    identity::IdentityPublicKey,
    prelude::AssetLockProof,
    shielded::{
        ShieldedMemo,
        builder::{
            IdentityCreateFromShieldedPoolBuildResult, ShieldedFeePayer, SpendableNote,
            TokenPoolSpender, build_document_shielded_token_payment,
            build_identity_create_from_shielded_pool_transition,
            build_identity_top_up_from_shielded_pool_transition,
            build_shield_from_asset_lock_transition, build_shield_from_identity_transition,
            build_shield_transition, build_shielded_transfer_transition,
            build_shielded_withdrawal_transition, build_token_burn_from_pool_transition,
            build_token_claim_to_pool_transition, build_token_direct_purchase_to_pool_transition,
            build_token_mint_to_pool_transition,
            build_token_purchase_from_shielded_pool_transition, build_token_shield_transition,
            build_token_shielded_transfer_transition,
            build_token_shielded_transfer_with_shielded_fee_transition,
            build_token_unshield_transition, build_token_unshield_with_shielded_fee_transition,
            build_unshield_transition,
        },
    },
    state_transition::{StateTransition, public_key_in_creation::IdentityPublicKeyInCreation},
    version::PlatformVersion,
};
use grovedb_commitment_tree::{Anchor, FullViewingKey, OutgoingViewingKey, SpendAuthorizingKey};
use napi::{
    Either, Env,
    bindgen_prelude::{PromiseRaw, ToNapiValue, Uint8Array},
};
use napi_derive::napi;
use std::{future::Future, pin::Pin};

use dpp::group::{GroupStateTransitionInfo, GroupStateTransitionInfoStatus};
use dpp::identity::Identity;
use dpp::prelude::Identifier;

use crate::{
    address_transitions::entities::{
        address_funds_fee_step::AddressFundsFeeStrategyStepNAPI, input_address::InputAddressNAPI,
    },
    asset_lock_proof::AssetLockProofNAPI,
    batch::token_payment_info::shielded_payment::TokenShieldedPaymentNAPI,
    core_script::CoreScriptNAPI,
    dynamic_value::IdentifierLikeNAPI,
    dynamic_value::{BigIntString, DynamicValue, PlatformAddressLikeNAPI, TryToU64},
    enums::distribution_type::TokenDistributionTypeNAPI,
    enums::{platform_version::PlatformVersionNAPI, pooling::PoolingNAPI},
    group_state_transition_info::GroupStateTransitionInfoNAPI,
    identifier::IdentifierNAPI,
    identity::IdentityNAPI,
    identity_public_key::IdentityPublicKeyNAPI,
    identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI,
    orchard::{
        memo::ShieldedMemoNAPI, multi_transfer::build_multi_output_shielded_transfer,
        orchard_address::OrchardAddressNAPI, proover::OrchardProverNAPI,
        serialized_action::SerializedActionNAPI, shielded_output::ShieldedOutputNAPI,
        signer::AddressKeySigner, signer::IdentityKeySigner, spendable_note::SpendableNoteNAPI,
        viewing_key::spending_key_from_seed,
    },
    platform_address::PlatformAddressNAPI,
    private_key::PrivateKeyNAPI,
    state_transition::StateTransitionNAPI,
    utils::{WithJsError, js_inputs_to_inputs},
};

/// Derives the Orchard `FullViewingKey` + `SpendAuthorizingKey` from a BIP-39
/// seed via ZIP-32 (`m/32'/coin_type'/account'`) — the spend authority needed
/// to spend notes in a shielded withdrawal.
fn spend_authority_from_seed(
    seed: &[u8],
    coin_type: u32,
    account: u32,
) -> Result<(FullViewingKey, SpendAuthorizingKey), napi::Error> {
    let spending_key = spending_key_from_seed(seed, coin_type, account)?;

    Ok((
        FullViewingKey::from(&spending_key),
        SpendAuthorizingKey::from(&spending_key),
    ))
}

fn parse_anchor(js_anchor: &Uint8Array) -> Result<Anchor, napi::Error> {
    let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().map_err(|_| {
        napi::Error::new(napi::Status::InvalidArg, "anchor must be 32 bytes length")
    })?;

    Option::from(Anchor::from_bytes(anchor_bytes))
        .ok_or_else(|| napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value"))
}

fn parse_sender_ovk(
    js_sender_ovk: Option<Uint8Array>,
) -> Result<Option<OutgoingViewingKey>, napi::Error> {
    js_sender_ovk
        .map(|ovk| {
            let bytes: [u8; 32] = ovk.to_vec().as_slice().try_into().map_err(|_| {
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "sender_ovk must be 32 bytes length",
                )
            })?;
            Ok(OutgoingViewingKey::from(bytes))
        })
        .transpose()
}

fn memo_bytes(js_memo: &ShieldedMemoNAPI) -> [u8; 36] {
    ShieldedMemo::from(js_memo.clone()).to_bytes()
}

fn spendable_notes(js_spends: &[&SpendableNoteNAPI]) -> Vec<SpendableNote> {
    js_spends.iter().map(|spend| spend.to_spendable()).collect()
}

/// A signer holding the one identity key a token transition is signed with
fn single_key_signer(
    js_identity_public_key: &IdentityPublicKeyNAPI,
    js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
) -> Result<(IdentityPublicKey, IdentityKeySigner), napi::Error> {
    let identity_public_key: IdentityPublicKey = js_identity_public_key.clone().into();
    let secret: [u8; 32] = PrivateKeyNAPI::bytes_from_js_value(js_private_key)?
        .to_vec()
        .as_slice()
        .try_into()
        .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "private key must be 32 bytes"))?;

    let mut signer = IdentityKeySigner::default();
    signer.add(identity_public_key.clone(), secret);

    Ok((identity_public_key, signer))
}

fn group_info_status(
    js_using_group_info: Option<&GroupStateTransitionInfoNAPI>,
) -> Option<GroupStateTransitionInfoStatus> {
    js_using_group_info.map(|info| {
        let info: GroupStateTransitionInfo = info.clone().into();
        match info.action_is_proposer {
            true => GroupStateTransitionInfoStatus::GroupStateTransitionInfoProposer(
                info.group_contract_position,
            ),
            false => GroupStateTransitionInfoStatus::GroupStateTransitionInfoOtherSigner(info),
        }
    })
}

/// The token a token pool transition acts on
struct TokenTarget {
    token_id: Identifier,
    owner_id: Identifier,
    data_contract_id: Identifier,
    token_contract_position: u16,
}

impl TokenTarget {
    fn from_js(
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        token_contract_position: u16,
    ) -> Result<Self, napi::Error> {
        Ok(TokenTarget {
            token_id: IdentifierNAPI::try_from(js_token_id)?.into(),
            owner_id: IdentifierNAPI::try_from(js_owner_id)?.into(),
            data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
            token_contract_position,
        })
    }
}

type ProvingFuture<T> = Pin<Box<dyn Future<Output = Result<T, napi::Error>> + Send>>;

/// `Env::spawn_future` monomorphizes napi's whole async machinery per future
/// type, i.e. once per proving method. Boxing the futures collapses that to one
/// instantiation per result type, keeping the wasm under Chrome's 8MB
/// sync-compile limit; the extra indirection is one virtual call per proof.
fn spawn_proving<T: 'static + Send + ToNapiValue>(
    env: &Env,
    future: ProvingFuture<T>,
) -> Result<PromiseRaw<'_, T>, napi::Error> {
    env.spawn_future(future)
}

#[napi(js_name = "ShieldedBuilderNAPI")]
pub struct ShieldedBuilderNAPI {
    proover: OrchardProverNAPI,
}

#[napi]
impl ShieldedBuilderNAPI {
    #[napi(js_name = "init")]
    pub async fn new() -> Self {
        let proover = OrchardProverNAPI::new().await;
        ShieldedBuilderNAPI { proover }
    }

    // Every proving method below parses its JS arguments synchronously and
    // runs the actual Halo 2 proving inside `spawn_proving`, i.e. on a
    // worker thread. Proving takes seconds and joins the rayon pool — done
    // on the JS thread it would freeze the event loop, and on a browser
    // main thread it aborts outright (`Atomics.wait` is forbidden there).

    #[napi(js_name = "shieldFromAssetLock")]
    #[allow(clippy::too_many_arguments)]
    pub fn shield_from_asset_lock<'env>(
        &self,
        env: &'env Env,
        js_recipient: &OrchardAddressNAPI,
        js_shield_amount: BigIntString,
        js_asset_lock_proof: &AssetLockProofNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_memo: &ShieldedMemoNAPI,
        js_dummy_outputs: u32,
        js_sender_ovk: Option<Uint8Array>,
        js_surplus_output: Option<PlatformAddressLikeNAPI>,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let shield_amount = js_shield_amount.try_to_u64()?;

        let recipient: OrchardAddress = js_recipient.into();

        let asset_lock_proof: AssetLockProof = js_asset_lock_proof.clone().into();

        let memo: ShieldedMemo = js_memo.clone().into();

        let sender_ovk: Option<OutgoingViewingKey> = match js_sender_ovk {
            Some(ovk) => {
                if ovk.len() != 32 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "sender_ovk must be 32 bytes length",
                    ));
                }
                let bytes: [u8; 32] = ovk.to_vec().as_slice().try_into().unwrap();
                Some(OutgoingViewingKey::from(bytes))
            }
            None => None,
        };

        let surplus_output: Option<PlatformAddress> = js_surplus_output
            .map(PlatformAddressNAPI::try_from)
            .transpose()?
            .map(Into::into);

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let private_key = PrivateKeyNAPI::bytes_from_js_value(js_private_key)?.to_vec();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition: StateTransition = build_shield_from_asset_lock_transition(
                    &recipient,
                    shield_amount,
                    asset_lock_proof,
                    private_key.as_slice(),
                    &prover,
                    memo.to_bytes(),
                    sender_ovk,
                    surplus_output,
                    js_dummy_outputs as usize,
                    &platform_version,
                )
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a `ShieldedWithdrawal` state transition (shielded pool -> core L1).
    ///
    /// - `spends` - notes to spend with their Merkle paths
    /// - `withdrawal_amount` - amount of credits to withdraw to the core chain
    /// - `output_script` - core chain script that receives the funds
    /// - `core_fee_per_byte` - core chain fee rate
    /// - `pooling` - withdrawal pooling strategy ("Never" / "IfAvailable" / "Standard")
    /// - `change_address` - Orchard address that receives the shielded change note
    /// - `seed` / `coin_type` / `account` - BIP-39 seed + ZIP-32 path used to derive the
    ///   spend authority (full viewing key + spend authorizing key) for the notes being spent
    /// - `anchor` - 32-byte Sinsemilla root the Merkle paths are witnessed against
    /// - `memo` - structured memo for the change note
    /// - `platform_version` - protocol version (defaults to the latest)
    ///
    /// Returns the proven state transition together with the fixed shielded fee (credits)
    /// consensus charges for it.
    #[napi(js_name = "shieldedWithdrawal")]
    #[allow(clippy::too_many_arguments)]
    pub fn shielded_withdrawal<'env>(
        &self,
        env: &'env Env,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_withdrawal_amount: BigIntString,
        js_output_script: &CoreScriptNAPI,
        js_core_fee_per_byte: u32,
        js_pooling: &DynamicValue,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let withdrawal_amount = js_withdrawal_amount.try_to_u64()?;

        let spends: Vec<_> = js_spends.iter().map(|s| s.to_spendable()).collect();

        let output_script = js_output_script.clone().into();

        let pooling = PoolingNAPI::try_from(js_pooling)?.into();

        let change_address: OrchardAddress = js_change_address.into();

        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }
        let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().unwrap();
        let anchor = Option::from(Anchor::from_bytes(anchor_bytes)).ok_or_else(|| {
            napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value")
        })?;

        let memo: ShieldedMemo = js_memo.clone().into();

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_shielded_withdrawal_transition(
                    spends,
                    withdrawal_amount,
                    output_script,
                    js_core_fee_per_byte,
                    pooling,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    memo.to_bytes(),
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds an `Unshield` state transition (shielded pool -> platform address).
    ///
    /// Like withdrawal, this spends notes — so it needs the same on-chain
    /// commitment-tree witness + anchor. The net (`unshield_amount`) is credited
    /// to `output_address` (a platform identity balance), and any remaining value
    /// returns to the shielded `change_address`.
    ///
    /// - `spends` - notes to spend with their Merkle paths
    /// - `output_address` - platform address that receives the unshielded credits
    /// - `unshield_amount` - amount of credits to unshield
    /// - `change_address` - Orchard address that receives the shielded change note
    /// - `seed` / `coin_type` / `account` - BIP-39 seed + ZIP-32 path for the spend authority
    /// - `anchor` - 32-byte Sinsemilla root the Merkle paths are witnessed against
    /// - `memo` - structured memo for the change note
    /// - `platform_version` - protocol version (defaults to the latest)
    ///
    /// Returns the proven state transition plus the fixed shielded fee (credits).
    #[napi(js_name = "unshield")]
    #[allow(clippy::too_many_arguments)]
    pub fn unshield<'env>(
        &self,
        env: &'env Env,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_output_address: PlatformAddressLikeNAPI,
        js_unshield_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let unshield_amount = js_unshield_amount.try_to_u64()?;

        let spends: Vec<_> = js_spends.iter().map(|s| s.to_spendable()).collect();

        let output_address: PlatformAddress =
            PlatformAddressNAPI::try_from(js_output_address)?.into();

        let change_address: OrchardAddress = js_change_address.into();

        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }
        let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().unwrap();
        let anchor = Option::from(Anchor::from_bytes(anchor_bytes)).ok_or_else(|| {
            napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value")
        })?;

        let memo: ShieldedMemo = js_memo.clone().into();

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_unshield_transition(
                    spends,
                    output_address,
                    unshield_amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    memo.to_bytes(),
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds a `ShieldedTransfer` state transition (shielded pool -> shielded pool).
    ///
    /// Spends notes and sends value to another Orchard address, fully shielded.
    /// Needs the same on-chain commitment-tree witness + anchor as the other
    /// spends. Any remaining value returns to `change_address`.
    ///
    /// - `spends` - notes to spend with their Merkle paths
    /// - `recipient` - Orchard address that receives the transferred note
    /// - `transfer_amount` - amount of credits to transfer
    /// - `change_address` - Orchard address that receives the shielded change note
    /// - `seed` / `coin_type` / `account` - BIP-39 seed + ZIP-32 path for the spend authority
    /// - `anchor` - 32-byte Sinsemilla root the Merkle paths are witnessed against
    /// - `memo` - structured memo for the recipient/change note
    /// - `platform_version` - protocol version (defaults to the latest)
    ///
    /// Returns the proven state transition plus the fixed shielded fee (credits).
    #[napi(js_name = "shieldedTransfer")]
    #[allow(clippy::too_many_arguments)]
    pub fn shielded_transfer<'env>(
        &self,
        env: &'env Env,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_recipient: &OrchardAddressNAPI,
        js_transfer_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let transfer_amount = js_transfer_amount.try_to_u64()?;

        let spends: Vec<_> = js_spends.iter().map(|s| s.to_spendable()).collect();

        let recipient: OrchardAddress = js_recipient.into();
        let change_address: OrchardAddress = js_change_address.into();

        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }
        let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().unwrap();
        let anchor = Option::from(Anchor::from_bytes(anchor_bytes)).ok_or_else(|| {
            napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value")
        })?;

        let memo: ShieldedMemo = js_memo.clone().into();

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_shielded_transfer_transition(
                    spends,
                    &recipient,
                    transfer_amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    memo.to_bytes(),
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds a `ShieldedTransfer` that pays many Orchard addresses at once
    /// (shielded pool -> shielded pool).
    ///
    /// Same spend side as [`Self::shielded_transfer`] — one account's notes, one
    /// anchor — but the output side is a list instead of a single recipient, so
    /// one proof and one fee cover the whole fan-out. Consensus never sees the
    /// output count (outputs are ciphertext inside the actions), so this needs no
    /// protocol change; what it does see is `actions.len()`, which Orchard sets to
    /// `max(spends, outputs + change, 2)` and prices the fee from.
    ///
    /// - `spends` - notes to spend with their Merkle paths
    /// - `outputs` - recipients, each with its own amount and memo (at least one)
    /// - `change_address` - Orchard address that receives the shielded change note;
    ///   it is always written, even at zero value, so the action count — and with
    ///   it the fee — is fixed before the change amount is known
    /// - `seed` / `coin_type` / `account` - BIP-39 seed + ZIP-32 path for the spend authority
    /// - `anchor` - 32-byte Sinsemilla root the Merkle paths are witnessed against
    /// - `platform_version` - protocol version (defaults to the latest)
    ///
    /// Returns the proven state transition plus the fixed shielded fee (credits).
    /// Errors before proving if the bundle would exceed the consensus action cap,
    /// rather than after a multi-second proof the node would reject.
    #[napi(js_name = "shieldedTransferMulti")]
    #[allow(clippy::too_many_arguments)]
    pub fn shielded_transfer_multi<'env>(
        &self,
        env: &'env Env,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_outputs: Vec<&ShieldedOutputNAPI>,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let spends: Vec<_> = js_spends.iter().map(|s| s.to_spendable()).collect();

        let outputs: Vec<_> = js_outputs.iter().map(|o| o.to_parts()).collect();

        let change_address: OrchardAddress = js_change_address.into();

        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }
        let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().unwrap();
        let anchor = Option::from(Anchor::from_bytes(anchor_bytes)).ok_or_else(|| {
            napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value")
        })?;

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_multi_output_shielded_transfer(
                    spends,
                    outputs,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    &platform_version,
                )?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds a `Shield` state transition (transparent platform addresses -> pool).
    ///
    /// A deposit: it does NOT spend pool notes (no witness/anchor needed), but it
    /// does sign the transparent input witnesses, so you pass the `PrivateKeyNAPI`
    /// for every input address. Fees are deducted from the inputs per `fee_strategy`.
    ///
    /// - `recipient` - Orchard address that receives the shielded note
    /// - `shield_amount` - amount of credits to shield
    /// - `inputs` - platform address inputs (address + nonce + balance)
    /// - `private_keys` - one private key per input address (used to sign witnesses)
    /// - `fee_strategy` - how fees are deducted from the inputs
    /// - `user_fee_increase` - user fee bump
    /// - `memo` - structured memo for the recipient note
    /// - `sender_ovk` - optional 32-byte sender OVK (recoverable send when set)
    /// - `platform_version` - protocol version (defaults to the latest)
    #[napi(js_name = "shield")]
    #[allow(clippy::too_many_arguments)]
    pub fn shield<'env>(
        &self,
        env: &'env Env,
        js_recipient: &OrchardAddressNAPI,
        js_shield_amount: BigIntString,
        js_inputs: Vec<&InputAddressNAPI>,
        js_private_keys: Vec<&PrivateKeyNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        js_user_fee_increase: u16,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let shield_amount = js_shield_amount.try_to_u64()?;

        let recipient: OrchardAddress = js_recipient.into();

        let inputs = js_inputs_to_inputs(js_inputs)?;

        let fee_strategy: Vec<AddressFundsFeeStrategyStep> = js_fee_strategy
            .into_iter()
            .map(|step| step.clone().into())
            .collect();

        let signer = AddressKeySigner::from_private_keys(&js_private_keys)?;

        let sender_ovk: Option<OutgoingViewingKey> = match js_sender_ovk {
            Some(ovk) => {
                if ovk.len() != 32 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "sender_ovk must be 32 bytes length",
                    ));
                }
                let bytes: [u8; 32] = ovk.to_vec().as_slice().try_into().unwrap();
                Some(OutgoingViewingKey::from(bytes))
            }
            None => None,
        };

        let memo: ShieldedMemo = js_memo.clone().into();

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_shield_transition(
                    &recipient,
                    shield_amount,
                    inputs,
                    fee_strategy,
                    &signer,
                    js_user_fee_increase,
                    &prover,
                    memo.to_bytes(),
                    sender_ovk,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds an `IdentityCreateFromShieldedPool` transition (pool -> new identity).
    ///
    /// A spend (needs the on-chain witness + anchor) that funds a brand-new identity
    /// from the shielded pool. Each `public_keys[i]` is paired with `private_keys[i]`,
    /// which signs that key's proof-of-possession (ECDSA keys only).
    ///
    /// - `public_keys` - the new identity's keys (in-creation form)
    /// - `private_keys` - one private key per public key (same order)
    /// - `denomination` - fixed pool denomination funding the identity
    /// - `send_to_address_on_creation_failure` - platform address refunded if creation fails
    /// - `spends` - notes to spend with their Merkle paths
    /// - `change_address` - Orchard address for the shielded change note
    /// - `seed` / `coin_type` / `account` - BIP-39 seed + ZIP-32 path for the spend authority
    /// - `anchor` - 32-byte Sinsemilla root the Merkle paths are witnessed against
    /// - `memo` - structured memo for the change note
    /// - `platform_version` - protocol version (defaults to the latest)
    #[napi(js_name = "identityCreateFromShieldedPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn identity_create_from_shielded_pool<'env>(
        &self,
        env: &'env Env,
        js_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>,
        js_private_keys: Vec<&PrivateKeyNAPI>,
        js_denomination: BigIntString,
        js_send_to_address_on_creation_failure: PlatformAddressLikeNAPI,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, IdentityCreateFromShieldedPoolResultNAPI>, napi::Error> {
        if js_public_keys.len() != js_private_keys.len() {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "public_keys and private_keys must have the same length",
            ));
        }

        let denomination = js_denomination.try_to_u64()?;

        // Pair each in-creation key with its IdentityPublicKey, and register the
        // matching private key in the identity signer.
        let mut public_keys: Vec<(IdentityPublicKey, IdentityPublicKeyInCreation)> = Vec::new();
        let mut signer = IdentityKeySigner::default();
        for (pk, key) in js_public_keys.into_iter().zip(js_private_keys.into_iter()) {
            let in_creation: IdentityPublicKeyInCreation = pk.clone().into();
            let identity_public_key: IdentityPublicKey = pk.clone().into();

            let secret: [u8; 32] =
                key.get_bytes()
                    .to_vec()
                    .as_slice()
                    .try_into()
                    .map_err(|_| {
                        napi::Error::new(napi::Status::InvalidArg, "private key must be 32 bytes")
                    })?;
            signer.add(identity_public_key.clone(), secret);

            public_keys.push((identity_public_key, in_creation));
        }

        let send_to_address: PlatformAddress =
            PlatformAddressNAPI::try_from(js_send_to_address_on_creation_failure)?.into();

        let spends = js_spends.iter().map(|s| s.to_spendable()).collect();

        let change_address: OrchardAddress = js_change_address.into();

        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }
        let anchor_bytes: [u8; 32] = js_anchor.to_vec().as_slice().try_into().unwrap();
        let anchor = Option::from(Anchor::from_bytes(anchor_bytes)).ok_or_else(|| {
            napi::Error::new(napi::Status::InvalidArg, "anchor is not a valid value")
        })?;

        let memo: ShieldedMemo = js_memo.clone().into();

        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let result = build_identity_create_from_shielded_pool_transition(
                    public_keys,
                    denomination,
                    send_to_address,
                    spends,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    &signer,
                    memo.to_bytes(),
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(IdentityCreateFromShieldedPoolResultNAPI(result))
            }),
        )
    }

    /// Builds a `ShieldFromIdentity` transition (identity balance -> shielded pool), signed with
    /// the identity's `signingKey` (a transfer key) and its private key.
    #[napi(js_name = "shieldFromIdentity")]
    #[allow(clippy::too_many_arguments)]
    pub fn shield_from_identity<'env>(
        &self,
        env: &'env Env,
        js_identity: &IdentityNAPI,
        js_recipient: &OrchardAddressNAPI,
        js_shield_amount: BigIntString,
        js_nonce: BigIntString,
        js_signing_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_user_fee_increase: u16,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let identity: Identity = js_identity.clone().into();
        let recipient: OrchardAddress = js_recipient.into();
        let shield_amount = js_shield_amount.try_to_u64()?;
        let nonce = js_nonce.try_to_u64()?;
        let (signing_key, signer) = single_key_signer(js_signing_key, js_private_key)?;
        let memo = memo_bytes(js_memo);
        let sender_ovk = parse_sender_ovk(js_sender_ovk)?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_shield_from_identity_transition(
                    &identity,
                    &recipient,
                    shield_amount,
                    nonce,
                    &signer,
                    Some(&signing_key),
                    js_user_fee_increase,
                    &prover,
                    memo,
                    sender_ovk,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds an `IdentityTopUpFromShieldedPool` transition (shielded pool -> identity balance).
    /// Spends notes like `unshield`; returns the transition with its shielded fee.
    #[napi(js_name = "identityTopUpFromShieldedPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn identity_top_up_from_shielded_pool<'env>(
        &self,
        env: &'env Env,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_identity_id: IdentifierLikeNAPI,
        js_top_up_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let spends = spendable_notes(&js_spends);
        let identity_id: Identifier = IdentifierNAPI::try_from(js_identity_id)?.into();
        let top_up_amount = js_top_up_amount.try_to_u64()?;
        let change_address: OrchardAddress = js_change_address.into();
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let anchor = parse_anchor(&js_anchor)?;
        let memo = memo_bytes(js_memo);
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_identity_top_up_from_shielded_pool_transition(
                    spends,
                    identity_id,
                    top_up_amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    &prover,
                    memo,
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds the shielded payment of a document's token cost, spent from the token's shielded
    /// pool, to set as `TokenPaymentInfo.shieldedPayment` of the document transition.
    #[napi(js_name = "documentTokenPayment")]
    #[allow(clippy::too_many_arguments)]
    pub fn document_token_payment<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_document_id: IdentifierLikeNAPI,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, TokenShieldedPaymentNAPI>, napi::Error> {
        let token = TokenTarget::from_js(js_token_id, js_owner_id, js_data_contract_id, 0)?;
        let document_id: Identifier = IdentifierNAPI::try_from(js_document_id)?.into();
        let spends = spendable_notes(&js_spends);
        let amount = js_amount.try_to_u64()?;
        let change_address: OrchardAddress = js_change_address.into();
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let anchor = parse_anchor(&js_anchor)?;
        let memo = memo_bytes(js_memo);
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let payment = build_document_shielded_token_payment(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    document_id,
                    spends,
                    amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    memo,
                    &prover,
                    &platform_version,
                )
                .with_js_error()?;

                Ok(TokenShieldedPaymentNAPI::from(payment))
            }),
        )
    }

    /// Builds a token `Shield` batch transition (owner token balance -> token shielded pool),
    /// signed with `identityPublicKey` and its private key.
    #[napi(js_name = "tokenShield")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_shield<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_recipient: &OrchardAddressNAPI,
        js_amount: BigIntString,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let recipient: OrchardAddress = js_recipient.into();
        let amount = js_amount.try_to_u64()?;
        let memo = memo_bytes(js_memo);
        let sender_ovk = parse_sender_ovk(js_sender_ovk)?;
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_shield_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    &recipient,
                    amount,
                    memo,
                    sender_ovk,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `Unshield` batch transition (token shielded pool -> `recipientId`'s token
    /// balance), signed with `identityPublicKey` and its private key.
    #[napi(js_name = "tokenUnshield")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_unshield<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_recipient_id: IdentifierLikeNAPI,
        js_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let spends = spendable_notes(&js_spends);
        let recipient_id: Identifier = IdentifierNAPI::try_from(js_recipient_id)?.into();
        let amount = js_amount.try_to_u64()?;
        let change_address: OrchardAddress = js_change_address.into();
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let anchor = parse_anchor(&js_anchor)?;
        let memo = memo_bytes(js_memo);
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_unshield_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    spends,
                    recipient_id,
                    amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    memo,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `ShieldedTransfer` batch transition (token shielded pool -> token
    /// shielded pool), signed with `identityPublicKey` and its private key.
    #[napi(js_name = "tokenShieldedTransfer")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_shielded_transfer<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_recipient: &OrchardAddressNAPI,
        js_transfer_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let spends = spendable_notes(&js_spends);
        let recipient: OrchardAddress = js_recipient.into();
        let transfer_amount = js_transfer_amount.try_to_u64()?;
        let change_address: OrchardAddress = js_change_address.into();
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let anchor = parse_anchor(&js_anchor)?;
        let memo = memo_bytes(js_memo);
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_shielded_transfer_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    spends,
                    &recipient,
                    transfer_amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    memo,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `MintToPool` batch transition (new tokens minted into the token shielded
    /// pool), signed with `identityPublicKey` and its private key. Pass `usingGroupInfo` for a
    /// group action.
    #[napi(js_name = "tokenMintToPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_mint_to_pool<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_recipient: &OrchardAddressNAPI,
        js_amount: BigIntString,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_public_note: Option<String>,
        js_using_group_info: Option<&GroupStateTransitionInfoNAPI>,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let recipient: OrchardAddress = js_recipient.into();
        let amount = js_amount.try_to_u64()?;
        let memo = memo_bytes(js_memo);
        let sender_ovk = parse_sender_ovk(js_sender_ovk)?;
        let using_group_info = group_info_status(js_using_group_info);
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_mint_to_pool_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    &recipient,
                    amount,
                    memo,
                    sender_ovk,
                    js_public_note,
                    using_group_info,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `BurnFromPool` batch transition (tokens burned out of the token shielded
    /// pool), signed with `identityPublicKey` and its private key. Pass `usingGroupInfo` for a
    /// group action.
    #[napi(js_name = "tokenBurnFromPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_burn_from_pool<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_spends: Vec<&SpendableNoteNAPI>,
        js_amount: BigIntString,
        js_change_address: &OrchardAddressNAPI,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_anchor: Uint8Array,
        js_memo: &ShieldedMemoNAPI,
        js_public_note: Option<String>,
        js_using_group_info: Option<&GroupStateTransitionInfoNAPI>,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let spends = spendable_notes(&js_spends);
        let amount = js_amount.try_to_u64()?;
        let change_address: OrchardAddress = js_change_address.into();
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let anchor = parse_anchor(&js_anchor)?;
        let memo = memo_bytes(js_memo);
        let using_group_info = group_info_status(js_using_group_info);
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_burn_from_pool_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    spends,
                    amount,
                    &change_address,
                    &fvk,
                    &ask,
                    anchor,
                    memo,
                    js_public_note,
                    using_group_info,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `ClaimToPool` batch transition (a distribution claimed into the token
    /// shielded pool), signed with `identityPublicKey` and its private key.
    #[napi(js_name = "tokenClaimToPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_claim_to_pool<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_recipient: &OrchardAddressNAPI,
        js_amount: BigIntString,
        js_distribution_type: &DynamicValue,
        js_claim_up_to: Option<BigIntString>,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_public_note: Option<String>,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let recipient: OrchardAddress = js_recipient.into();
        let amount = js_amount.try_to_u64()?;
        let distribution_type = TokenDistributionTypeNAPI::try_from(js_distribution_type)?.into();
        let claim_up_to = js_claim_up_to.map(|v| v.try_to_u64()).transpose()?;
        let memo = memo_bytes(js_memo);
        let sender_ovk = parse_sender_ovk(js_sender_ovk)?;
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_claim_to_pool_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    &recipient,
                    amount,
                    distribution_type,
                    claim_up_to,
                    memo,
                    sender_ovk,
                    js_public_note,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a token `DirectPurchaseToPool` batch transition (tokens bought at their direct
    /// purchase price into the token shielded pool), signed with `identityPublicKey` and its
    /// private key.
    #[napi(js_name = "tokenDirectPurchaseToPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_direct_purchase_to_pool<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_recipient: &OrchardAddressNAPI,
        js_token_count: BigIntString,
        js_total_agreed_price: BigIntString,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_identity_public_key: &IdentityPublicKeyNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_identity_contract_nonce: BigIntString,
        js_user_fee_increase: u16,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, StateTransitionNAPI>, napi::Error> {
        let token = TokenTarget::from_js(
            js_token_id,
            js_owner_id,
            js_data_contract_id,
            js_token_contract_position,
        )?;
        let recipient: OrchardAddress = js_recipient.into();
        let token_count = js_token_count.try_to_u64()?;
        let total_agreed_price = js_total_agreed_price.try_to_u64()?;
        let memo = memo_bytes(js_memo);
        let sender_ovk = parse_sender_ovk(js_sender_ovk)?;
        let (identity_public_key, signer) =
            single_key_signer(js_identity_public_key, js_private_key)?;
        let identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let state_transition = build_token_direct_purchase_to_pool_transition(
                    token.token_id,
                    token.owner_id,
                    token.data_contract_id,
                    token.token_contract_position,
                    &recipient,
                    token_count,
                    total_agreed_price,
                    memo,
                    sender_ovk,
                    &identity_public_key,
                    identity_contract_nonce,
                    js_user_fee_increase,
                    &signer,
                    &prover,
                    &platform_version,
                )
                .await
                .with_js_error()?;

                Ok(StateTransitionNAPI::from(state_transition))
            }),
        )
    }

    /// Builds a `TokenShieldedTransferWithShieldedFee` transition: tokens move inside the token
    /// shielded pool and the fee is paid from the credit shielded pool, so no identity signs.
    /// Token and fee notes are spent with the same seed account, each against its own pool's
    /// anchor. Returns the transition with its shielded fee.
    #[napi(js_name = "tokenShieldedTransferWithShieldedFee")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_shielded_transfer_with_shielded_fee<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_token_spends: Vec<&SpendableNoteNAPI>,
        js_token_change_address: &OrchardAddressNAPI,
        js_token_anchor: Uint8Array,
        js_recipient: &OrchardAddressNAPI,
        js_transfer_amount: BigIntString,
        js_fee_spends: Vec<&SpendableNoteNAPI>,
        js_fee_change_address: &OrchardAddressNAPI,
        js_fee_anchor: Uint8Array,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let token_id: Identifier = IdentifierNAPI::try_from(js_token_id)?.into();
        let data_contract_id: Identifier = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        let token_spends = spendable_notes(&js_token_spends);
        let token_change_address: OrchardAddress = js_token_change_address.into();
        let token_anchor = parse_anchor(&js_token_anchor)?;
        let recipient: OrchardAddress = js_recipient.into();
        let transfer_amount = js_transfer_amount.try_to_u64()?;
        let fee_spends = spendable_notes(&js_fee_spends);
        let fee_change_address: OrchardAddress = js_fee_change_address.into();
        let fee_anchor = parse_anchor(&js_fee_anchor)?;
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let memo = memo_bytes(js_memo);
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) =
                    build_token_shielded_transfer_with_shielded_fee_transition(
                        token_id,
                        data_contract_id,
                        js_token_contract_position,
                        TokenPoolSpender {
                            spends: token_spends,
                            change_address: &token_change_address,
                            fvk: &fvk,
                            ask: &ask,
                            anchor: token_anchor,
                        },
                        &recipient,
                        transfer_amount,
                        memo,
                        ShieldedFeePayer {
                            spends: fee_spends,
                            change_address: &fee_change_address,
                            fvk: &fvk,
                            ask: &ask,
                            anchor: fee_anchor,
                        },
                        &prover,
                        &platform_version,
                    )
                    .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds a `TokenUnshieldWithShieldedFee` transition: tokens leave the token shielded pool
    /// for `recipientId`'s balance and the fee is paid from the credit shielded pool. Returns
    /// the transition with its shielded fee.
    #[napi(js_name = "tokenUnshieldWithShieldedFee")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_unshield_with_shielded_fee<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_token_spends: Vec<&SpendableNoteNAPI>,
        js_token_change_address: &OrchardAddressNAPI,
        js_token_anchor: Uint8Array,
        js_recipient_id: IdentifierLikeNAPI,
        js_amount: BigIntString,
        js_fee_spends: Vec<&SpendableNoteNAPI>,
        js_fee_change_address: &OrchardAddressNAPI,
        js_fee_anchor: Uint8Array,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let token_id: Identifier = IdentifierNAPI::try_from(js_token_id)?.into();
        let data_contract_id: Identifier = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        let token_spends = spendable_notes(&js_token_spends);
        let token_change_address: OrchardAddress = js_token_change_address.into();
        let token_anchor = parse_anchor(&js_token_anchor)?;
        let recipient_id: Identifier = IdentifierNAPI::try_from(js_recipient_id)?.into();
        let amount = js_amount.try_to_u64()?;
        let fee_spends = spendable_notes(&js_fee_spends);
        let fee_change_address: OrchardAddress = js_fee_change_address.into();
        let fee_anchor = parse_anchor(&js_fee_anchor)?;
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let memo = memo_bytes(js_memo);
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_token_unshield_with_shielded_fee_transition(
                    token_id,
                    data_contract_id,
                    js_token_contract_position,
                    TokenPoolSpender {
                        spends: token_spends,
                        change_address: &token_change_address,
                        fvk: &fvk,
                        ask: &ask,
                        anchor: token_anchor,
                    },
                    recipient_id,
                    amount,
                    memo,
                    ShieldedFeePayer {
                        spends: fee_spends,
                        change_address: &fee_change_address,
                        fvk: &fvk,
                        ask: &ask,
                        anchor: fee_anchor,
                    },
                    &prover,
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }

    /// Builds a `TokenPurchaseFromShieldedPool` transition: tokens are bought at their direct
    /// purchase price into the token shielded pool, paid (price and fee) from the credit
    /// shielded pool. `recipient` must belong to the seed account. Returns the transition with
    /// its shielded fee.
    #[napi(js_name = "tokenPurchaseFromShieldedPool")]
    #[allow(clippy::too_many_arguments)]
    pub fn token_purchase_from_shielded_pool<'env>(
        &self,
        env: &'env Env,
        js_token_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_recipient: &OrchardAddressNAPI,
        js_token_count: BigIntString,
        js_total_agreed_price: BigIntString,
        js_fee_spends: Vec<&SpendableNoteNAPI>,
        js_fee_change_address: &OrchardAddressNAPI,
        js_fee_anchor: Uint8Array,
        js_seed: Uint8Array,
        js_coin_type: u32,
        js_account: u32,
        js_memo: &ShieldedMemoNAPI,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<PromiseRaw<'env, ShieldedWithdrawalResultNAPI>, napi::Error> {
        let token_id: Identifier = IdentifierNAPI::try_from(js_token_id)?.into();
        let data_contract_id: Identifier = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        let recipient: OrchardAddress = js_recipient.into();
        let token_count = js_token_count.try_to_u64()?;
        let total_agreed_price = js_total_agreed_price.try_to_u64()?;
        let fee_spends = spendable_notes(&js_fee_spends);
        let fee_change_address: OrchardAddress = js_fee_change_address.into();
        let fee_anchor = parse_anchor(&js_fee_anchor)?;
        let (fvk, ask) = spend_authority_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
        let memo = memo_bytes(js_memo);
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();
        let prover = self.proover.shared();

        spawn_proving(
            env,
            Box::pin(async move {
                let (state_transition, fee) = build_token_purchase_from_shielded_pool_transition(
                    token_id,
                    data_contract_id,
                    js_token_contract_position,
                    &recipient,
                    &fvk,
                    token_count,
                    total_agreed_price,
                    memo,
                    ShieldedFeePayer {
                        spends: fee_spends,
                        change_address: &fee_change_address,
                        fvk: &fvk,
                        ask: &ask,
                        anchor: fee_anchor,
                    },
                    &prover,
                    &platform_version,
                )
                .with_js_error()?;

                Ok(ShieldedWithdrawalResultNAPI {
                    state_transition,
                    fee,
                })
            }),
        )
    }
}

/// Result of [`ShieldedBuilderNAPI::identity_create_from_shielded_pool`]: the new
/// identity's keys (with proof-of-possession signatures), the proven Orchard
/// bundle fields, the derived identity id, and the client-predicted fee.
#[napi(js_name = "IdentityCreateFromShieldedPoolResultNAPI")]
pub struct IdentityCreateFromShieldedPoolResultNAPI(IdentityCreateFromShieldedPoolBuildResult);

#[napi]
impl IdentityCreateFromShieldedPoolResultNAPI {
    #[napi(getter, js_name = "publicKeys")]
    pub fn public_keys(&self) -> Vec<IdentityPublicKeyInCreationNAPI> {
        self.0
            .public_keys
            .iter()
            .map(|pk| pk.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "identityId")]
    pub fn identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id.into()
    }

    #[napi(getter, js_name = "predictedFee")]
    pub fn predicted_fee(&self) -> BigIntString {
        BigIntString::from_u64(self.0.predicted_fee)
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0
            .bundle
            .actions
            .iter()
            .map(|a| a.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        Uint8Array::from(self.0.bundle.anchor.to_vec())
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        Uint8Array::from(self.0.bundle.proof.clone())
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        Uint8Array::from(self.0.bundle.binding_signature.to_vec())
    }
}

/// Result of a proving shielded spend builder ([`ShieldedBuilderNAPI::shielded_withdrawal`],
/// [`ShieldedBuilderNAPI::unshield`], [`ShieldedBuilderNAPI::shielded_transfer`]): the
/// proven state transition plus the shielded fee (credits) consensus charges for it.
#[napi(js_name = "ShieldedWithdrawalResultNAPI")]
pub struct ShieldedWithdrawalResultNAPI {
    state_transition: StateTransition,
    fee: u64,
}

#[napi]
impl ShieldedWithdrawalResultNAPI {
    #[napi(getter, js_name = "stateTransition")]
    pub fn state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(self.state_transition.clone())
    }

    #[napi(getter, js_name = "fee")]
    pub fn fee(&self) -> BigIntString {
        BigIntString::from_u64(self.fee)
    }
}
