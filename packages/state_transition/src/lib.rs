use dpp::identity::KeyType;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransition;
use pshenmic_dpp_enums::keys::key_type::KeyTypeWASM;
use pshenmic_dpp_mock_bls::MockBLS;
use pshenmic_dpp_private_key::PrivateKeyWASM;
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "StateTransitionWASM")]
pub struct StateTransitionWASM(StateTransition);

impl From<StateTransition> for StateTransitionWASM {
    fn from(transition: StateTransition) -> Self {
        StateTransitionWASM(transition)
    }
}

impl From<StateTransitionWASM> for StateTransition {
    fn from(transition: StateTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl StateTransitionWASM {
    #[wasm_bindgen(js_name = "sign")]
    pub fn sign(
        &mut self,
        private_key: &PrivateKeyWASM,
        public_key: &IdentityPublicKeyWASM,
    ) -> Result<Vec<u8>, JsValue> {
        self.0
            .sign(
                &public_key.clone().into(),
                private_key.get_key_bytes().as_slice(),
                &MockBLS {},
            )
            .with_js_error()?;

        self.0.set_signature(self.0.signature().clone());
        self.0
            .set_signature_public_key_id(self.0.signature_public_key_id().unwrap());

        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "signByPrivateKey")]
    pub fn sign_by_private_key(
        &mut self,
        private_key: &PrivateKeyWASM,
        js_key_type: JsValue,
    ) -> Result<Vec<u8>, JsValue> {
        let key_type = KeyTypeWASM::try_from(js_key_type)?;
        
        let _sig = self
            .0
            .sign_by_private_key(
                &private_key.get_bytes().as_slice(),
                KeyType::from(key_type),
                &MockBLS {},
            )
            .with_js_error();

        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(JsValue::from(bytes.clone()))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<StateTransitionWASM, JsValue> {
        let st = StateTransition::deserialize_from_bytes(bytes.as_slice());

        match st {
            Err(err) => Err(JsValue::from_str(err.to_string().as_str())),
            Ok(transition) => Ok(StateTransitionWASM(transition)),
        }
    }
}
