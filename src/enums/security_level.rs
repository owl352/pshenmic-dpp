use dpp::identity::SecurityLevel;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, TryToU64};

#[napi(js_name = "SecurityLevelNAPI")]
pub enum SecurityLevelNAPI {
    MASTER = 0,
    CRITICAL = 1,
    HIGH = 2,
    MEDIUM = 3,
}

impl From<SecurityLevelNAPI> for String {
    fn from(level: SecurityLevelNAPI) -> String {
        match level {
            SecurityLevelNAPI::MASTER => String::from("MASTER"),
            SecurityLevelNAPI::CRITICAL => String::from("CRITICAL"),
            SecurityLevelNAPI::HIGH => String::from("HIGH"),
            SecurityLevelNAPI::MEDIUM => String::from("MEDIUM"),
        }
    }
}

impl From<SecurityLevelNAPI> for SecurityLevel {
    fn from(security_level: SecurityLevelNAPI) -> Self {
        match security_level {
            SecurityLevelNAPI::MASTER => SecurityLevel::MASTER,
            SecurityLevelNAPI::CRITICAL => SecurityLevel::CRITICAL,
            SecurityLevelNAPI::HIGH => SecurityLevel::HIGH,
            SecurityLevelNAPI::MEDIUM => SecurityLevel::MEDIUM,
        }
    }
}

impl From<SecurityLevel> for SecurityLevelNAPI {
    fn from(security_level: SecurityLevel) -> Self {
        match security_level {
            SecurityLevel::MASTER => SecurityLevelNAPI::MASTER,
            SecurityLevel::CRITICAL => SecurityLevelNAPI::CRITICAL,
            SecurityLevel::HIGH => SecurityLevelNAPI::HIGH,
            SecurityLevel::MEDIUM => SecurityLevelNAPI::MEDIUM,
        }
    }
}

impl TryFrom<u8> for SecurityLevelNAPI {
    type Error = napi::Error;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(SecurityLevelNAPI::MASTER),
            1 => Ok(SecurityLevelNAPI::CRITICAL),
            2 => Ok(SecurityLevelNAPI::HIGH),
            3 => Ok(SecurityLevelNAPI::MEDIUM),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid security level value",
            )),
        }
    }
}

impl TryFrom<String> for SecurityLevelNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "master" => Ok(SecurityLevelNAPI::MASTER),
            "critical" => Ok(SecurityLevelNAPI::CRITICAL),
            "high" => Ok(SecurityLevelNAPI::HIGH),
            "medium" => Ok(SecurityLevelNAPI::MEDIUM),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid security level value",
            )),
        }
    }
}

impl TryFrom<DynamicValue> for SecurityLevelNAPI {
    type Error = napi::Error;

    fn try_from(value: DynamicValue) -> Result<Self, Self::Error> {
        match value {
            DynamicValue::Text(str) => SecurityLevelNAPI::try_from(str),
            DynamicValue::Uint8(num) => SecurityLevelNAPI::try_from(num),
            DynamicValue::Uint16(num) => SecurityLevelNAPI::try_from(num as u8),
            DynamicValue::Uint32(num) => SecurityLevelNAPI::try_from(num as u8),
            DynamicValue::Uint64(num_str) => {
                SecurityLevelNAPI::try_from(num_str.try_to_u64()? as u8)
            }
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid security level value",
            )),
        }
    }
}
