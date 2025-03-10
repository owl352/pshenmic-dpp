mod purpose;
mod security_level;
mod key_type;

use dpp::identity::identity_public_key::v0::IdentityPublicKeyV0;
use dpp::identity::{IdentityPublicKey, KeyType, Purpose, SecurityLevel, TimestampMillis};
use dpp::identity::identity_public_key::accessors::v0::{IdentityPublicKeyGettersV0, IdentityPublicKeySettersV0};
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{Hex};
use js_sys::Boolean;
use wasm_bindgen::prelude::wasm_bindgen;
use crate::identity_public_key::key_type::KeyTypeWASM;
use crate::identity_public_key::purpose::PurposeWASM;
use crate::identity_public_key::security_level::SecurityLevelWASM;

#[wasm_bindgen(js_name = IdentityPublicKeyWASM)]
pub struct IdentityPublicKeyWASM {
    public_key: IdentityPublicKey,
}

#[wasm_bindgen]
impl IdentityPublicKeyWASM {
    #[wasm_bindgen]
    pub fn new(
        id: u32,
        purpose: PurposeWASM,
        security_level: SecurityLevelWASM,
        key_type: KeyTypeWASM,
        read_only: Boolean,
        binary_data: &str,
        disabled_at: Option<TimestampMillis>,
    ) -> Self {
        IdentityPublicKeyWASM {
            public_key: IdentityPublicKey::from(IdentityPublicKeyV0 {
                id,
                purpose: Purpose::from(purpose),
                security_level: SecurityLevel::from(security_level),
                contract_bounds: None,
                key_type: KeyType::from(key_type),
                read_only: read_only.as_bool().unwrap(),
                data: BinaryData::from_string(binary_data, Hex).unwrap(),
                disabled_at,
            }),
        }
    }
}


impl IdentityPublicKeyWASM {
    pub fn get_key(&self) -> IdentityPublicKey {
        self.public_key.clone()
    }
}

#[wasm_bindgen]
impl IdentityPublicKeyWASM {
    #[wasm_bindgen(js_name = getKeyId)]
    pub fn get_key_id(&self) -> u32 {
        self.public_key.id()
    }

    #[wasm_bindgen(js_name = getPurpose)]
    pub fn get_purpose(&self) -> PurposeWASM {
        PurposeWASM::from(self.public_key.purpose())
    }

    #[wasm_bindgen(js_name = getSecurityLevel)]
    pub fn get_security_level(&self) -> SecurityLevelWASM {
        SecurityLevelWASM::from(self.public_key.security_level())
    }

    #[wasm_bindgen(js_name = getKeyType)]
    pub fn get_key_type(&self) -> KeyTypeWASM {
        KeyTypeWASM::from(self.public_key.key_type())
    }

    #[wasm_bindgen(js_name = getReadOnly)]
    pub fn get_read_only(&self) -> bool {
        self.public_key.read_only()
    }

    #[wasm_bindgen(js_name = getData)]
    pub fn get_data(&self) -> String {
        self.public_key.data().to_string(Hex)
    }

    #[wasm_bindgen(js_name = getDisabledAt)]
    pub fn get_disabled_at(&self) -> Option<u64> {
        self.public_key.disabled_at()
    }

    #[wasm_bindgen(js_name = setKeyId)]
    pub fn set_key_id(&mut self, key_id: u32) {
        self.public_key.set_id(key_id)
    }

    #[wasm_bindgen(js_name = setPurpose)]
    pub fn set_purpose(&mut self, purpose: PurposeWASM) {
        self.public_key.set_purpose(Purpose::from(purpose))
    }

    #[wasm_bindgen(js_name = setSecurityLevel)]
    pub fn set_security_level(&mut self, security_level: SecurityLevelWASM) {
        self.public_key.set_security_level(SecurityLevel::from(security_level))
    }

    #[wasm_bindgen(js_name = setKeyType)]
    pub fn set_key_type(&mut self, key_type: KeyTypeWASM) {
        self.public_key.set_key_type(KeyType::from(key_type))
    }

    #[wasm_bindgen(js_name = setReadOnly)]
    pub fn set_read_only(&mut self, read_only: Boolean) {
        self.public_key.set_read_only(read_only.as_bool().unwrap())
    }

    #[wasm_bindgen(js_name = setData)]
    pub fn set_data(&mut self, binary_data: &str) {
        let data = BinaryData::from_string(binary_data, Hex).unwrap();
        self.public_key.set_data(data)
    }

    #[wasm_bindgen(js_name = setDisabledAt)]
    pub fn set_disabled_at(&mut self, disabled_at: u64) {
        self.public_key.set_disabled_at(disabled_at)
    }
}
