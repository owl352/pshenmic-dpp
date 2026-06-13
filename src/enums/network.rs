use dpp::dashcore::Network;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "NetworkNAPI")]
#[allow(non_camel_case_types)]
#[derive(Clone)]
pub enum NetworkNAPI {
    Mainnet = 0,
    Testnet = 1,
    Devnet = 2,
    Regtest = 3,
}

impl From<Network> for NetworkNAPI {
    fn from(value: Network) -> Self {
        match value {
            Network::Mainnet => NetworkNAPI::Mainnet,
            Network::Devnet => NetworkNAPI::Devnet,
            Network::Testnet => NetworkNAPI::Testnet,
            Network::Regtest => NetworkNAPI::Regtest,
        }
    }
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
            NetworkNAPI::Mainnet => Network::Mainnet,
            NetworkNAPI::Testnet => Network::Testnet,
            NetworkNAPI::Devnet => Network::Devnet,
            NetworkNAPI::Regtest => Network::Regtest,
        }
    }
}

impl TryFrom<u64> for NetworkNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
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

impl TryFrom<&DynamicValue> for NetworkNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            NetworkNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            NetworkNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid network value",
            ))
        }
    }
}
