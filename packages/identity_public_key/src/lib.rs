use dpp::dashcore::Network;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::identity::hash::IdentityPublicKeyHashMethodsV0;
use dpp::identity::identity_public_key::accessors::v0::{
    IdentityPublicKeyGettersV0, IdentityPublicKeySettersV0,
};
use dpp::identity::identity_public_key::v0::IdentityPublicKeyV0;
use dpp::identity::{IdentityPublicKey, KeyType, Purpose, SecurityLevel, TimestampMillis};
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::Hex;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use pshenmic_dpp_enums::keys::key_type::KeyTypeWASM;
use pshenmic_dpp_enums::keys::purpose::PurposeWASM;
use pshenmic_dpp_enums::keys::security_level::SecurityLevelWASM;
use pshenmic_dpp_enums::network::NetworkWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = IdentityPublicKeyWASM)]
pub struct IdentityPublicKeyWASM(IdentityPublicKey);

impl From<IdentityPublicKey> for IdentityPublicKeyWASM {
    fn from(value: IdentityPublicKey) -> Self {
        IdentityPublicKeyWASM(value)
    }
}

impl From<IdentityPublicKeyWASM> for IdentityPublicKey {
    fn from(value: IdentityPublicKeyWASM) -> Self {
        value.0
    }
}

#[wasm_bindgen]
impl IdentityPublicKeyWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        id: u32,
        js_purpose: JsValue,
        js_security_level: JsValue,
        js_key_type: JsValue,
        read_only: bool,
        binary_data: &str,
        disabled_at: Option<TimestampMillis>,
    ) -> Result<Self, JsValue> {
        let purpose = PurposeWASM::try_from(js_purpose)?;
        let security_level = SecurityLevelWASM::try_from(js_security_level)?;
        let key_type = KeyTypeWASM::try_from(js_key_type)?;

        Ok(IdentityPublicKeyWASM(IdentityPublicKey::from(
            IdentityPublicKeyV0 {
                id,
                purpose: Purpose::from(purpose),
                security_level: SecurityLevel::from(security_level),
                contract_bounds: None,
                key_type: KeyType::from(key_type),
                read_only,
                data: BinaryData::from_string(binary_data, Hex).unwrap(),
                disabled_at,
            },
        )))
    }
}

#[wasm_bindgen]
impl IdentityPublicKeyWASM {
    #[wasm_bindgen(js_name = "validatePrivateKey")]
    pub fn validate_private_key(
        &self,
        js_private_key_bytes: Vec<u8>,
        js_network: JsValue,
    ) -> Result<bool, JsValue> {
        let mut private_key_bytes = [0u8; 32];
        let len = js_private_key_bytes.len().min(32);
        private_key_bytes[..len].copy_from_slice(&js_private_key_bytes[..len]);

        let network = Network::from(NetworkWASM::try_from(js_network)?);

        self.0
            .validate_private_key_bytes(&private_key_bytes, network)
            .with_js_error()
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

    #[wasm_bindgen(js_name = getDisabledAt)]
    pub fn get_disabled_at(&self) -> Option<u64> {
        self.0.disabled_at()
    }

    #[wasm_bindgen(js_name = setKeyId)]
    pub fn set_key_id(&mut self, key_id: u32) {
        self.0.set_id(key_id)
    }

    #[wasm_bindgen(js_name = setPurpose)]
    pub fn set_purpose(&mut self, purpose: JsValue) -> Result<(), JsValue> {
        Ok(self
            .0
            .set_purpose(Purpose::from(PurposeWASM::try_from(purpose)?)))
    }

    #[wasm_bindgen(js_name = setSecurityLevel)]
    pub fn set_security_level(&mut self, security_level: JsValue) -> Result<(), JsValue> {
        Ok(self
            .0
            .set_security_level(SecurityLevel::from(SecurityLevelWASM::try_from(
                security_level,
            )?)))
    }

    #[wasm_bindgen(js_name = setKeyType)]
    pub fn set_key_type(&mut self, key_type: JsValue) -> Result<(), JsValue> {
        Ok(self
            .0
            .set_key_type(KeyType::from(KeyTypeWASM::try_from(key_type)?)))
    }

    #[wasm_bindgen(js_name = setReadOnly)]
    pub fn set_read_only(&mut self, read_only: bool) {
        self.0.set_read_only(read_only)
    }

    #[wasm_bindgen(js_name = setData)]
    pub fn set_data(&mut self, binary_data: &str) {
        let data = BinaryData::from_string(binary_data, Hex).unwrap();

        self.0.set_data(data)
    }

    #[wasm_bindgen(js_name = setDisabledAt)]
    pub fn set_disabled_at(&mut self, disabled_at: u64) {
        self.0.set_disabled_at(disabled_at)
    }

    #[wasm_bindgen(js_name = "getPublicKeyHash")]
    pub fn public_key_hash(&self) -> Result<String, JsValue> {
        let hash = self
            .0
            .public_key_hash()
            .with_js_error()
            .map(|slice| slice.to_vec())?
            .to_hex_string(Case::Lower);

        Ok(hash)
    }

    #[wasm_bindgen(js_name = toBytes)]
    pub fn to_byes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = fromBytes)]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityPublicKeyWASM, JsValue> {
        match IdentityPublicKey::deserialize_from_bytes(bytes.as_slice()).with_js_error() {
            Ok(pk) => Ok(IdentityPublicKeyWASM(pk)),
            Err(e) => Err(e),
        }
    }
}
