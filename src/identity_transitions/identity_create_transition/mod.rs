use dpp::identity::state_transition::AssetLockProved;
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::decode;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_create_transition::IdentityCreateTransition;
use dpp::state_transition::identity_create_transition::accessors::IdentityCreateTransitionAccessorsV0;
use dpp::state_transition::identity_create_transition::v0::IdentityCreateTransitionV0;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::{StateTransition, StateTransitionLike};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::dynamic_value::DynamicValue;
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityCreateTransitionNAPI")]
#[derive(Clone)]
pub struct IdentityCreateTransitionNAPI(IdentityCreateTransition);

impl From<IdentityCreateTransition> for IdentityCreateTransitionNAPI {
    fn from(val: IdentityCreateTransition) -> Self {
        IdentityCreateTransitionNAPI(val)
    }
}

impl From<IdentityCreateTransitionNAPI> for IdentityCreateTransition {
    fn from(val: IdentityCreateTransitionNAPI) -> Self {
        val.0
    }
}

#[napi]
impl IdentityCreateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>,
        asset_lock: &AssetLockProofNAPI,
        signature: Option<Uint8Array>,
        user_fee_increase: Option<u16>,
    ) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        Ok(IdentityCreateTransitionNAPI(IdentityCreateTransition::V0(
            IdentityCreateTransitionV0 {
                public_keys: js_public_keys
                    .into_iter()
                    .map(|key| key.clone().into())
                    .collect(),
                asset_lock_proof: asset_lock.clone().into(),
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature: BinaryData::from(signature.map(|sig| sig.to_vec()).unwrap_or(vec![])),
                identity_id: asset_lock.create_identifier()?.into(),
            },
        )))
    }

    #[napi(js_name = "default")]
    pub fn default(
        js_platform_version: &DynamicValue,
    ) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

        IdentityCreateTransition::default_versioned(&platform_version.into())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))
            .map(Into::into)
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        IdentityCreateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        IdentityCreateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        let bytes_vec = bytes.to_vec();

        let rs_transition = IdentityCreateTransition::deserialize_from_bytes(bytes_vec.as_slice())
            .with_js_error()?;

        Ok(IdentityCreateTransitionNAPI(rs_transition))
    }

    #[napi(getter, js_name = "publicKeys")]
    pub fn get_public_keys(&self) -> Vec<IdentityPublicKeyInCreationNAPI> {
        self.0
            .public_keys()
            .iter()
            .map(|key| IdentityPublicKeyInCreationNAPI::from(key.clone()))
            .collect()
    }

    #[napi(js_name = "getIdentifier")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id().into()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(getter, js_name = "assetLock")]
    pub fn get_asset_lock_proof(&self) -> AssetLockProofNAPI {
        AssetLockProofNAPI::from(self.0.asset_lock_proof().clone())
    }

    #[napi(setter, js_name = "publicKeys")]
    pub fn set_public_keys(&mut self, js_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>) {
        self.0.set_public_keys(
            js_public_keys
                .into_iter()
                .map(|key| IdentityPublicKeyInCreation::from(key.clone()))
                .collect(),
        );
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, amount: u16) {
        self.0.set_user_fee_increase(amount)
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
    }

    #[napi(setter, js_name = "assetLock")]
    pub fn set_asset_lock_proof(&mut self, proof: &AssetLockProofNAPI) -> Result<(), napi::Error> {
        self.0
            .set_asset_lock_proof(proof.clone().into())
            .with_js_error()
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::IdentityCreate(self.clone().0))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityCreateTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreate(st) => Ok(IdentityCreateTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state document_transition type",
            )),
        }
    }
}
