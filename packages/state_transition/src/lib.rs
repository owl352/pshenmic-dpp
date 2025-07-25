use dpp::dashcore::secp256k1::hashes::hex::Case::Lower;
use dpp::dashcore::secp256k1::hashes::hex::DisplayHex;
use dpp::identity::{KeyID, KeyType};
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::{Encoding, decode, encode};
use dpp::prelude::UserFeeIncrease;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::StateTransition;
use pshenmic_dpp_enums::keys::key_type::KeyTypeWASM;
use pshenmic_dpp_enums::keys::purpose::PurposeWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_mock_bls::MockBLS;
use pshenmic_dpp_private_key::PrivateKeyWASM;
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use pshenmic_dpp_utils::WithJsError;
use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

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
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "StateTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "StateTransitionWASM".to_string()
    }

    #[wasm_bindgen(js_name = "sign")]
    pub fn sign(
        &mut self,
        private_key: &PrivateKeyWASM,
        public_key: &IdentityPublicKeyWASM,
    ) -> Result<Vec<u8>, JsValue> {
        self.0
            .sign(
                &public_key.clone().into(),
                private_key.get_bytes().as_slice(),
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

    #[wasm_bindgen(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(JsValue::from(bytes.clone()))
    }

    #[wasm_bindgen(js_name = "hex")]
    pub fn to_hex(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(JsValue::from(encode(bytes.as_slice(), Encoding::Hex)))
    }

    #[wasm_bindgen(js_name = "base64")]
    pub fn to_base64(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(JsValue::from(encode(bytes.as_slice(), Encoding::Base64)))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<StateTransitionWASM, JsValue> {
        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<StateTransitionWASM, JsValue> {
        let bytes = decode(&hex, Encoding::Hex).map_err(JsError::from)?;

        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[wasm_bindgen(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<StateTransitionWASM, JsValue> {
        let bytes = decode(&base64, Encoding::Base64).map_err(JsError::from)?;

        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[wasm_bindgen(js_name = "hash")]
    pub fn get_hash(&self, skip_signature: bool) -> Result<String, JsValue> {
        let payload: Vec<u8>;

        if skip_signature {
            payload = self.0.signable_bytes().with_js_error()?;
        } else {
            payload = dpp::serialization::PlatformSerializable::serialize_to_bytes(&self.0)
                .with_js_error()?;
        }

        Ok(Sha256::digest(payload).to_hex_string(Lower))
    }

    #[wasm_bindgen(js_name = "getActionType")]
    pub fn get_action_type(&self) -> String {
        self.0.name()
    }

    #[wasm_bindgen(js_name = "getActionTypeNumber")]
    pub fn get_action_type_number(&self) -> u8 {
        match self.0 {
            StateTransition::DataContractCreate(_) => 0,
            StateTransition::Batch(_) => 1,
            StateTransition::IdentityCreate(_) => 2,
            StateTransition::IdentityTopUp(_) => 3,
            StateTransition::DataContractUpdate(_) => 4,
            StateTransition::IdentityUpdate(_) => 5,
            StateTransition::IdentityCreditWithdrawal(_) => 6,
            StateTransition::IdentityCreditTransfer(_) => 7,
            StateTransition::MasternodeVote(_) => 8,
        }
    }

    #[wasm_bindgen(js_name = "getOwnerId")]
    pub fn get_owner_id(&self) -> IdentifierWASM {
        self.0.owner_id().into()
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(getter = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> Option<KeyID> {
        self.0.signature_public_key_id()
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(js_name = "getPurposeRequirement")]
    pub fn get_purpose_requirement(&self) -> Option<Vec<String>> {
        let requirements = self.0.purpose_requirement();

        match requirements {
            None => None,
            Some(req) => Some(
                req.iter()
                    .map(|purpose| PurposeWASM::from(purpose.clone()))
                    .map(String::from)
                    .collect(),
            ),
        }
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature(BinaryData::from(signature))
    }

    #[wasm_bindgen(setter = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: KeyID) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase)
    }
}
