use dpp::identity::identity_public_key::v0::IdentityPublicKeyV0;
use dpp::identity::{IdentityPublicKey, KeyType, Purpose, SecurityLevel};
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::Hex;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::public_key_in_creation::accessors::{
    IdentityPublicKeyInCreationV0Getters, IdentityPublicKeyInCreationV0Setters,
};
use dpp::state_transition::public_key_in_creation::v0::IdentityPublicKeyInCreationV0;
use pshenmic_dpp_enums::keys::key_type::KeyTypeWASM;
use pshenmic_dpp_enums::keys::purpose::PurposeWASM;
use pshenmic_dpp_enums::keys::security_level::SecurityLevelWASM;
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityPublicKeyInCreationWASM")]
pub struct IdentityPublicKeyInCreationWASM(IdentityPublicKeyInCreation);

impl From<IdentityPublicKeyInCreation> for IdentityPublicKeyInCreationWASM {
    fn from(value: IdentityPublicKeyInCreation) -> Self {
        IdentityPublicKeyInCreationWASM(value)
    }
}

impl From<IdentityPublicKeyInCreationWASM> for IdentityPublicKeyInCreation {
    fn from(value: IdentityPublicKeyInCreationWASM) -> Self {
        value.0
    }
}

impl From<IdentityPublicKeyInCreationWASM> for IdentityPublicKey {
    fn from(value: IdentityPublicKeyInCreationWASM) -> Self {
        let contract_bounds = match value.0.contract_bounds() {
            None => None,
            Some(bounds) => Some(bounds.clone()),
        };

        IdentityPublicKey::V0(IdentityPublicKeyV0 {
            id: value.0.id(),
            purpose: value.0.purpose(),
            security_level: value.0.security_level(),
            contract_bounds,
            key_type: value.0.key_type(),
            read_only: value.0.read_only(),
            data: value.0.data().clone(),
            disabled_at: None,
        })
    }
}

#[wasm_bindgen]
impl IdentityPublicKeyInCreationWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        id: u32,
        purpose: PurposeWASM,
        security_level: SecurityLevelWASM,
        key_type: KeyTypeWASM,
        read_only: bool,
        binary_data: Vec<u8>,
        signature: Vec<u8>,
    ) -> IdentityPublicKeyInCreationWASM {
        IdentityPublicKeyInCreationWASM(IdentityPublicKeyInCreation::V0(
            IdentityPublicKeyInCreationV0 {
                id,
                key_type: KeyType::from(key_type),
                purpose: Purpose::from(purpose),
                security_level: SecurityLevel::from(security_level),
                contract_bounds: None,
                read_only,
                data: BinaryData::from(binary_data),
                signature: BinaryData::from(signature),
            },
        ))
    }

    #[wasm_bindgen(js_name = toIdentityPublicKey)]
    pub fn to_identity_public_key(&self) -> Result<IdentityPublicKeyWASM, JsValue> {
        IdentityPublicKeyWASM::new(
            self.0.id(),
            JsValue::from(PurposeWASM::from(self.0.purpose())),
            JsValue::from(SecurityLevelWASM::from(self.0.security_level())),
            JsValue::from(KeyTypeWASM::from(self.0.key_type())),
            self.0.read_only(),
            self.0.data().to_string(Hex).as_str(),
            None,
        )
    }

    #[wasm_bindgen(js_name = getKeyId)]
    pub fn get_key_id(&self) -> u32 {
        self.0.id()
    }

    #[wasm_bindgen(js_name = getPurpose)]
    pub fn get_purpose(&self) -> String {
        PurposeWASM::from(self.0.purpose()).into()
    }

    #[wasm_bindgen(js_name = getSecurityLevel)]
    pub fn get_security_level(&self) -> String {
        SecurityLevelWASM::from(self.0.security_level()).into()
    }

    #[wasm_bindgen(js_name = getKeyType)]
    pub fn get_key_type(&self) -> String {
        KeyTypeWASM::from(self.0.key_type()).into()
    }

    #[wasm_bindgen(js_name = getReadOnly)]
    pub fn get_read_only(&self) -> bool {
        self.0.read_only()
    }

    #[wasm_bindgen(js_name = getData)]
    pub fn get_data(&self) -> String {
        self.0.data().to_string(Hex)
    }

    #[wasm_bindgen(js_name = setKeyId)]
    pub fn set_key_id(&mut self, key_id: u32) {
        self.0.set_id(key_id)
    }

    #[wasm_bindgen(js_name = setPurpose)]
    pub fn set_purpose(&mut self, js_purpose: JsValue) -> Result<(), JsValue> {
        let purpose = PurposeWASM::try_from(js_purpose)?;
        Ok(self.0.set_purpose(Purpose::from(purpose)))
    }

    #[wasm_bindgen(js_name = setSecurityLevel)]
    pub fn set_security_level(&mut self, js_security_level: JsValue) -> Result<(), JsValue> {
        let security_level = SecurityLevelWASM::try_from(js_security_level)?;
        Ok(self
            .0
            .set_security_level(SecurityLevel::from(security_level)))
    }

    #[wasm_bindgen(js_name = setReadOnly)]
    pub fn set_read_only(&mut self, read_only: bool) {
        self.0.set_read_only(read_only)
    }

    #[wasm_bindgen(js_name = setData)]
    pub fn set_data(&mut self, binary_data: Vec<u8>) {
        let data = BinaryData::from(binary_data);
        self.0.set_data(data)
    }
}
