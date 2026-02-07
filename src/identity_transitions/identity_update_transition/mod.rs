use dpp::identity::state_transition::OptionallyAssetLockProved;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use dpp::state_transition::identity_update_transition::accessors::IdentityUpdateTransitionAccessorsV0;
use dpp::state_transition::identity_update_transition::v0::IdentityUpdateTransitionV0;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike,
    StateTransitionSingleSigned,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::enums::purpose::PurposeNAPI;
use crate::identifier::IdentifierNAPI;
use crate::identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityUpdateTransitionNAPI")]
#[derive(Clone)]
pub struct IdentityUpdateTransitionNAPI(IdentityUpdateTransition);

#[napi]
impl IdentityUpdateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_identity_id: IdentifierLikeNAPI,
        revision: BigIntString,
        nonce: BigIntString,
        js_add_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>,
        disable_public_keys: Vec<u32>,
        user_fee_increase: Option<u16>,
    ) -> Result<IdentityUpdateTransitionNAPI, napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;

        Ok(IdentityUpdateTransitionNAPI(IdentityUpdateTransition::V0(
            IdentityUpdateTransitionV0 {
                identity_id: identity_id.into(),
                revision: revision.try_to_u64()?,
                nonce: nonce.try_to_u64()?,
                add_public_keys: js_add_public_keys
                    .into_iter()
                    .map(|key| key.clone().into())
                    .collect(),
                disable_public_keys,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            },
        )))
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> BigIntString {
        BigIntString::from_u64(self.0.revision())
    }

    #[napi(getter, js_name = "nonce")]
    pub fn get_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.nonce())
    }

    #[napi(getter, js_name = "identityIdentifier")]
    pub fn get_identity_identifier(&self) -> IdentifierNAPI {
        self.0.identity_id().into()
    }

    #[napi(js_name = "getPurposeRequirement")]
    pub fn get_purpose_requirement(&self) -> Vec<String> {
        self.0
            .purpose_requirement()
            .iter()
            .map(|purpose| PurposeNAPI::from(purpose.clone()).into())
            .collect()
    }

    #[napi(js_name = "getModifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Vec<IdentifierNAPI> {
        self.0
            .modified_data_ids()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[napi(js_name = "getOptionalAssetLockProof")]
    pub fn get_optional_asset_lock_proof(&self) -> Option<AssetLockProofNAPI> {
        self.0
            .optional_asset_lock_proof()
            .map(|proof| AssetLockProofNAPI::from(proof.clone()))
    }

    #[napi(getter, js_name = "publicKeyIdsToDisable")]
    pub fn get_public_key_ids_to_disable(&self) -> Vec<u32> {
        self.0.public_key_ids_to_disable().to_vec()
    }

    #[napi(getter, js_name = "publicKeyIdsToAdd")]
    pub fn get_public_key_ids_to_add(&self) -> Vec<IdentityPublicKeyInCreationNAPI> {
        self.0
            .public_keys_to_add()
            .to_vec()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: BigIntString) -> Result<(), napi::Error> {
        self.0.set_revision(revision.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_nonce(nonce.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "identityIdentifier")]
    pub fn set_identity_identifier(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
        self.0.set_identity_id(identity_id.clone().into());
        Ok(())
    }

    #[napi(setter, js_name = "publicKeyIdsToAdd")]
    pub fn set_public_key_ids_to_add(
        &mut self,
        js_add_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>,
    ) {
        let keys: Vec<IdentityPublicKeyInCreation> = js_add_public_keys
            .into_iter()
            .map(|id| id.clone().into())
            .collect();

        self.0.set_public_keys_to_add(keys)
    }

    #[napi(setter, js_name = "publicKeyIdsToDisable")]
    pub fn set_public_key_ids_to_disable(&mut self, public_keys: Vec<u32>) {
        self.0.set_public_key_ids_to_disable(public_keys)
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, signature_public_key_id: u32) {
        self.0.set_signature_public_key_id(signature_public_key_id)
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityUpdateTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        IdentityUpdateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityUpdateTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        IdentityUpdateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<IdentityUpdateTransitionNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let rs_transition =
            IdentityUpdateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(IdentityUpdateTransitionNAPI(rs_transition))
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityUpdateTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityUpdate(st) => Ok(IdentityUpdateTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type",
            )),
        }
    }
}
