use dpp::dashcore::Network;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, TryToU64};

#[napi(js_name="NetworkNAPI")]
#[allow(non_camel_case_types)]
pub enum NetworkNAPI {
    Mainnet = 0,
    Testnet = 1,
    Devnet = 2,
    Regtest = 3,
}

impl From<NetworkNAPI> for String {
    fn from(value: NetworkNAPI) -> Self {
        match value {
            NetworkNAPI::Mainnet => "Mainnet".to_string(),
            NetworkNAPI::Testnet => "Testnet".to_string(),
            NetworkNAPI::Devnet => "Devnet".to_string(),
            NetworkNAPI::Regtest => "Regtest".to_string(),
        }
    }
}

impl From<NetworkNAPI> for Network {
    fn from(network: NetworkNAPI) -> Self {
        match network {
            NetworkNAPI::Mainnet => Network::Dash,
            NetworkNAPI::Testnet => Network::Testnet,
            NetworkNAPI::Devnet => Network::Devnet,
            NetworkNAPI::Regtest => Network::Regtest,
        }
    }
}

impl TryFrom<u8> for NetworkNAPI {
    type Error = napi::Error;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(NetworkNAPI::Mainnet),
            1 => Ok(NetworkNAPI::Testnet),
            2 => Ok(NetworkNAPI::Devnet),
            3 => Ok(NetworkNAPI::Regtest),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid network value",
            )),
        }
    }
}

impl TryFrom<String> for NetworkNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "mainnet" => Ok(NetworkNAPI::Mainnet),
            "testnet" => Ok(NetworkNAPI::Testnet),
            "devnet" => Ok(NetworkNAPI::Devnet),
            "regtest" => Ok(NetworkNAPI::Regtest),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid network value",
            )),
        }
    }
}

impl TryFrom<DynamicValue> for NetworkNAPI {
    type Error = napi::Error;

    fn try_from(value: DynamicValue) -> Result<Self, Self::Error> {
        match value {
            DynamicValue::Text(str) => NetworkNAPI::try_from(str),
            DynamicValue::Uint8(num) => NetworkNAPI::try_from(num),
            DynamicValue::Uint16(num) => NetworkNAPI::try_from(num as u8),
            DynamicValue::Uint32(num) => NetworkNAPI::try_from(num as u8),
            DynamicValue::Uint64(num_str) => NetworkNAPI::try_from(num_str.try_to_u64()? as u8),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid platform version value",
            )),
        }
    }
}
