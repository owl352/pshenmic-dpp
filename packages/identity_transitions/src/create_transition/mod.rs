use crate::public_key_in_creation::IdentityPublicKeyInCreationWASM;
use dpp::identity::state_transition::AssetLockProved;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_create_transition::IdentityCreateTransition;
use dpp::state_transition::identity_create_transition::accessors::IdentityCreateTransitionAccessorsV0;
use dpp::state_transition::{StateTransition, StateTransitionLike};
use dpp::version::PlatformVersion;
use pshenmic_dpp_asset_lock_proof::AssetLockProofWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityCreateTransitionWASM")]
#[derive(Clone)]
pub struct IdentityCreateTransitionWASM(IdentityCreateTransition);

impl From<IdentityCreateTransition> for IdentityCreateTransitionWASM {
    fn from(val: IdentityCreateTransition) -> Self {
        IdentityCreateTransitionWASM(val)
    }
}

impl From<IdentityCreateTransitionWASM> for IdentityCreateTransition {
    fn from(val: IdentityCreateTransitionWASM) -> Self {
        val.0
    }
}

#[wasm_bindgen]
impl IdentityCreateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(platform_version: u32) -> Result<IdentityCreateTransitionWASM, JsValue> {
        let platform_version =
            &PlatformVersion::get(platform_version).map_err(|e| JsValue::from(e.to_string()))?;

        IdentityCreateTransition::default_versioned(platform_version)
            .map(Into::into)
            .map_err(|err| JsValue::from_str(&*err.to_string()))
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error();

        match bytes {
            Ok(bytes) => Ok(JsValue::from(bytes.clone())),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityCreateTransitionWASM, JsValue> {
        let rs_transition =
            IdentityCreateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error();

        match rs_transition {
            Ok(rs_st) => Ok(IdentityCreateTransitionWASM(rs_st)),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "defaultVersioned")]
    pub fn get_public_keys(&self) -> Vec<IdentityPublicKeyInCreationWASM> {
        self.0
            .public_keys()
            .iter()
            .map(|key| IdentityPublicKeyInCreationWASM::from(key.clone()))
            .collect()
    }

    #[wasm_bindgen(js_name = "getIdentifier")]
    pub fn get_identity_id(&self) -> IdentifierWASM {
        self.0.identity_id().into()
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(js_name = "getSignature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.signable_bytes().with_js_error()
    }

    #[wasm_bindgen(getter = "assetLock")]
    pub fn get_asset_lock_proof(&self) -> AssetLockProofWASM {
        AssetLockProofWASM::from(self.0.asset_lock_proof().clone())
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, amount: u16) {
        self.0.set_user_fee_increase(amount)
    }

    #[wasm_bindgen(js_name = "setSignature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature_bytes(signature)
    }

    #[wasm_bindgen(setter = "assetLock")]
    pub fn set_asset_lock_proof(&mut self, proof: AssetLockProofWASM) -> Result<(), JsValue> {
        self.0.set_asset_lock_proof(proof.into()).with_js_error()
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::IdentityCreate(self.clone().0))
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionWASM,
    ) -> Result<IdentityCreateTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreate(st) => Ok(IdentityCreateTransitionWASM(st)),
            _ => Err(JsValue::from_str(
                &"Invalid state document_transition type)",
            )),
        }
    }
}
