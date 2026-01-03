use dpp::withdrawal::Pooling;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, TryToU64};

#[napi]
pub enum PoolingNAPI {
    Never = 0,
    IfAvailable = 1,
    Standard = 2,
}

impl From<Pooling> for PoolingNAPI {
    fn from(value: Pooling) -> Self {
        match value {
            Pooling::IfAvailable => PoolingNAPI::IfAvailable,
            Pooling::Standard => PoolingNAPI::Standard,
            Pooling::Never => PoolingNAPI::Never,
        }
    }
}

impl From<PoolingNAPI> for String {
    fn from(value: PoolingNAPI) -> Self {
        match value {
            PoolingNAPI::Never => "Never".to_string(),
            PoolingNAPI::IfAvailable => "IfAvailable".to_string(),
            PoolingNAPI::Standard => "Standard".to_string(),
        }
    }
}

impl From<PoolingNAPI> for Pooling {
    fn from(network: PoolingNAPI) -> Self {
        match network {
            PoolingNAPI::Never => Pooling::Never,
            PoolingNAPI::IfAvailable => Pooling::IfAvailable,
            PoolingNAPI::Standard => Pooling::Standard,
        }
    }
}

impl TryFrom<u8> for PoolingNAPI {
    type Error = napi::Error;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(PoolingNAPI::Never),
            1 => Ok(PoolingNAPI::IfAvailable),
            2 => Ok(PoolingNAPI::Standard),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid pooling value",
            )),
        }
    }
}

impl TryFrom<String> for PoolingNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "never" => Ok(PoolingNAPI::Never),
            "ifavailable" => Ok(PoolingNAPI::IfAvailable),
            "standard" => Ok(PoolingNAPI::Standard),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid pooling value",
            )),
        }
    }
}

impl TryFrom<DynamicValue> for PoolingNAPI {
    type Error = napi::Error;

    fn try_from(value: DynamicValue) -> Result<Self, Self::Error> {
        match value {
            DynamicValue::Text(str) => PoolingNAPI::try_from(str),
            DynamicValue::Uint8(num) => PoolingNAPI::try_from(num),
            DynamicValue::Uint16(num) => PoolingNAPI::try_from(num as u8),
            DynamicValue::Uint32(num) => PoolingNAPI::try_from(num as u8),
            DynamicValue::Uint64(num_str) => PoolingNAPI::try_from(num_str.try_to_u64()? as u8),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid pooling value",
            )),
        }
    }
}
