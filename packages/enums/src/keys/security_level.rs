use dpp::identity::SecurityLevel;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = SecurityLevel)]
pub enum SecurityLevelWASM {
    MASTER = 0,
    CRITICAL = 1,
    HIGH = 2,
    MEDIUM = 3,
}

impl From<SecurityLevelWASM> for SecurityLevel {
    fn from(security_level: SecurityLevelWASM) -> Self {
        match security_level {
            SecurityLevelWASM::MASTER => SecurityLevel::MASTER,
            SecurityLevelWASM::CRITICAL => SecurityLevel::CRITICAL,
            SecurityLevelWASM::HIGH => SecurityLevel::HIGH,
            SecurityLevelWASM::MEDIUM => SecurityLevel::MEDIUM,
        }
    }
}

impl From<SecurityLevel> for SecurityLevelWASM {
    fn from(security_level: SecurityLevel) -> Self {
        match security_level {
            SecurityLevel::MASTER => SecurityLevelWASM::MASTER,
            SecurityLevel::CRITICAL => SecurityLevelWASM::CRITICAL,
            SecurityLevel::HIGH => SecurityLevelWASM::HIGH,
            SecurityLevel::MEDIUM => SecurityLevelWASM::MEDIUM,
        }
    }
}
