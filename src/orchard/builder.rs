use dpp::{
    address_funds::{AddressFundsFeeStrategyStep, OrchardAddress, PlatformAddress},
    identity::IdentityPublicKey,
    prelude::AssetLockProof,
    shielded::{
        ShieldedMemo,
        builder::{
            IdentityCreateFromShieldedPoolBuildResult,
            build_identity_create_from_shielded_pool_transition,
            build_shield_from_asset_lock_transition, build_shield_transition,
            build_shielded_transfer_transition, build_shielded_withdrawal_transition,
            build_unshield_transition,
        },
    },
    state_transition::{StateTransition, public_key_in_creation::IdentityPublicKeyInCreation},
    version::PlatformVersion,
};
use futures::executor::block_on;
use grovedb_commitment_tree::{
    Anchor, FullViewingKey, OutgoingViewingKey, SpendAuthorizingKey, SpendingKey,
};
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;
use zip32::AccountId;

use crate::{
    address_transitions::entities::{
        address_funds_fee_step::AddressFundsFeeStrategyStepNAPI, input_address::InputAddressNAPI,
    },
    asset_lock_proof::AssetLockProofNAPI,
    core_script::CoreScriptNAPI,
    dynamic_value::{BigIntString, DynamicValue, PlatformAddressLikeNAPI, TryToU64},
    enums::{platform_version::PlatformVersionNAPI, pooling::PoolingNAPI},
    identifier::IdentifierNAPI,
    identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI,
    orchard::{
        memo::ShieldedMemoNAPI, orchard_address::OrchardAddressNAPI, proover::OrchardProverNAPI,
        serialized_action::SerializedActionNAPI, signer::AddressKeySigner,
        signer::IdentityKeySigner, spendable_note::SpendableNoteNAPI,
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
    let account_id = AccountId::try_from(account).map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "account must be a non-hardened index (< 2^31)",
        )
    })?;

    let spending_key = SpendingKey::from_zip32_seed(seed, coin_type, account_id).map_err(|e| {
        napi::Error::new(
            napi::Status::InvalidArg,
            format!("failed to derive Orchard spending key from seed: {e:?}"),
        )
    })?;

    Ok((
        FullViewingKey::from(&spending_key),
        SpendAuthorizingKey::from(&spending_key),
    ))
}

#[napi(js_name = "ShieldedBuilderNAPI")]
pub struct ShieldedBuilderNAPI {
    proover: OrchardProverNAPI,
}

#[napi]
impl ShieldedBuilderNAPI {
    #[napi(constructor)]
    pub fn new() -> Self {
        ShieldedBuilderNAPI {
            proover: OrchardProverNAPI::new(),
        }
    }

    #[napi(js_name = "shieldFromAssetLock")]
    #[allow(clippy::too_many_arguments)]
    pub fn shield_from_asset_lock(
        &self,
        js_recipient: &OrchardAddressNAPI,
        js_shield_amount: BigIntString,
        js_asset_lock_proof: &AssetLockProofNAPI,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_memo: &ShieldedMemoNAPI,
        js_dummy_outputs: u32,
        js_sender_ovk: Option<Uint8Array>,
        js_surplus_output: Option<PlatformAddressLikeNAPI>,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<StateTransitionNAPI, napi::Error> {
        let shield_amount = js_shield_amount.try_to_u64()?;

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

        let state_transition: StateTransition = build_shield_from_asset_lock_transition(
            &js_recipient.into(),
            shield_amount,
            asset_lock_proof,
            PrivateKeyNAPI::bytes_from_js_value(js_private_key)?
                .to_vec()
                .as_slice()
                .as_ref(),
            &self.proover,
            memo.to_bytes(),
            sender_ovk,
            surplus_output,
            js_dummy_outputs as usize,
            &platform_version,
        )
        .with_js_error()?;

        Ok(StateTransitionNAPI::from(state_transition))
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
    pub fn shielded_withdrawal(
        &self,
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
    ) -> Result<ShieldedWithdrawalResultNAPI, napi::Error> {
        let withdrawal_amount = js_withdrawal_amount.try_to_u64()?;

        let spends = js_spends.iter().map(|s| s.to_spendable()).collect();

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
            &self.proover,
            memo.to_bytes(),
            &platform_version,
        )
        .with_js_error()?;

        Ok(ShieldedWithdrawalResultNAPI {
            state_transition,
            fee,
        })
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
    pub fn unshield(
        &self,
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
    ) -> Result<ShieldedWithdrawalResultNAPI, napi::Error> {
        let unshield_amount = js_unshield_amount.try_to_u64()?;

        let spends = js_spends.iter().map(|s| s.to_spendable()).collect();

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

        let (state_transition, fee) = build_unshield_transition(
            spends,
            output_address,
            unshield_amount,
            &change_address,
            &fvk,
            &ask,
            anchor,
            &self.proover,
            memo.to_bytes(),
            &platform_version,
        )
        .with_js_error()?;

        Ok(ShieldedWithdrawalResultNAPI {
            state_transition,
            fee,
        })
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
    pub fn shielded_transfer(
        &self,
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
    ) -> Result<ShieldedWithdrawalResultNAPI, napi::Error> {
        let transfer_amount = js_transfer_amount.try_to_u64()?;

        let spends = js_spends.iter().map(|s| s.to_spendable()).collect();

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

        let (state_transition, fee) = build_shielded_transfer_transition(
            spends,
            &recipient,
            transfer_amount,
            &change_address,
            &fvk,
            &ask,
            anchor,
            &self.proover,
            memo.to_bytes(),
            &platform_version,
        )
        .with_js_error()?;

        Ok(ShieldedWithdrawalResultNAPI {
            state_transition,
            fee,
        })
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
    pub fn shield(
        &self,
        js_recipient: &OrchardAddressNAPI,
        js_shield_amount: BigIntString,
        js_inputs: Vec<&InputAddressNAPI>,
        js_private_keys: Vec<&PrivateKeyNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        js_user_fee_increase: u16,
        js_memo: &ShieldedMemoNAPI,
        js_sender_ovk: Option<Uint8Array>,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<StateTransitionNAPI, napi::Error> {
        let shield_amount = js_shield_amount.try_to_u64()?;

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

        // The Shield builder is async only because the `Signer` trait is async;
        // our signer does no IO, so blocking is fine and keeps `&self.proover`
        // usable (napi async methods can't borrow self across an await).
        let state_transition = block_on(build_shield_transition(
            &js_recipient.into(),
            shield_amount,
            inputs,
            fee_strategy,
            &signer,
            js_user_fee_increase,
            &self.proover,
            memo.to_bytes(),
            sender_ovk,
            &platform_version,
        ))
        .with_js_error()?;

        Ok(StateTransitionNAPI::from(state_transition))
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
    pub fn identity_create_from_shielded_pool(
        &self,
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
    ) -> Result<IdentityCreateFromShieldedPoolResultNAPI, napi::Error> {
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

        let result = block_on(build_identity_create_from_shielded_pool_transition(
            public_keys,
            denomination,
            send_to_address,
            spends,
            &change_address,
            &fvk,
            &ask,
            anchor,
            &self.proover,
            &signer,
            memo.to_bytes(),
            &platform_version,
        ))
        .with_js_error()?;

        Ok(IdentityCreateFromShieldedPoolResultNAPI(result))
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
