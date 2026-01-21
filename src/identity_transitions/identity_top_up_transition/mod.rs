use dpp::identifier::Identifier;
use dpp::identity::state_transition::{AssetLockProved, OptionallyAssetLockProved};
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_topup_transition::IdentityTopUpTransition;
use dpp::state_transition::identity_topup_transition::accessors::IdentityTopUpTransitionAccessorsV0;
use dpp::state_transition::identity_topup_transition::v0::IdentityTopUpTransitionV0;
use dpp::state_transition::{StateTransition, StateTransitionLike, StateTransitionSingleSigned};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityTopUpTransitionNAPI")]
#[derive(Clone)]
pub struct IdentityTopUpTransitionNAPI(IdentityTopUpTransition);

#[napi]
impl IdentityTopUpTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        asset_lock_proof: &AssetLockProofNAPI,
        js_identity_id: IdentifierLikeNAPI,
        user_fee_increase: Option<u16>,
    ) -> Result<IdentityTopUpTransitionNAPI, napi::Error> {
        let identity_id: Identifier = IdentifierNAPI::try_from(js_identity_id)?.into();

        Ok(IdentityTopUpTransitionNAPI(IdentityTopUpTransition::V0(
            IdentityTopUpTransitionV0 {
                asset_lock_proof: asset_lock_proof.clone().into(),
                identity_id,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature: Default::default(),
            },
        )))
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
            .map(|lock| lock.clone().into())
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "identityIdentifier")]
    pub fn get_identity_identifier(&self) -> IdentifierNAPI {
        self.0.identity_id().clone().into()
    }

    #[napi(getter, js_name = "assetLockProof")]
    pub fn get_asset_lock_proof(&self) -> AssetLockProofNAPI {
        self.0.asset_lock_proof().clone().into()
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase);
    }

    #[napi(setter, js_name = "identityIdentifier")]
    pub fn set_identity_identifier(
        &mut self,
        js_identity_identifier: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_identity_id(IdentifierNAPI::try_from(js_identity_identifier)?.into()))
    }

    #[napi(setter, js_name = "assetLockProof")]
    pub fn set_asset_lock_proof(
        &mut self,
        asset_lock_proof: &AssetLockProofNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_asset_lock_proof(asset_lock_proof.clone().into())
            .with_js_error()
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
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
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<IdentityTopUpTransitionNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let rs_transition =
            IdentityTopUpTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(IdentityTopUpTransitionNAPI(rs_transition))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityTopUpTransitionNAPI, napi::Error> {
        IdentityTopUpTransitionNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        )
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityTopUpTransitionNAPI, napi::Error> {
        IdentityTopUpTransitionNAPI::from_bytes(
            decode(base64.as_str(), Base64)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        )
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityTopUpTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityTopUp(st) => Ok(IdentityTopUpTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type",
            )),
        }
    }
}
