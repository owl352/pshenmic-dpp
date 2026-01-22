pub mod address_witness;

use dpp::address_funds::PlatformAddress;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{dynamic_value::DynamicValue, enums::network::NetworkNAPI, utils::WithJsError};

#[derive(Clone)]
#[napi(js_name = "PlatformAddressNAPI")]
pub struct PlatformAddressNAPI(PlatformAddress);

impl From<PlatformAddress> for PlatformAddressNAPI {
    fn from(platform: PlatformAddress) -> Self {
        Self(platform)
    }
}

impl From<PlatformAddressNAPI> for PlatformAddress {
    fn from(platform: PlatformAddressNAPI) -> Self {
        platform.0
    }
}

#[napi]
impl PlatformAddressNAPI {
    #[napi(constructor)]
    pub fn new(address: Uint8Array) -> Result<PlatformAddressNAPI, napi::Error> {
        Ok(PlatformAddressNAPI(
            PlatformAddress::from_bytes(address.to_vec().as_slice()).with_js_error()?,
        ))
    }

    #[napi(js_name = "bytes")]
    pub fn address(&self) -> Uint8Array {
        Uint8Array::from(self.0.to_bytes())
    }

    #[napi(js_name = "toAddress")]
    pub fn to_address(&self, js_network: &DynamicValue) -> Result<String, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        Ok(self.0.to_address_with_network(network.into()).to_string())
    }

    #[napi(js_name = "toBech32m")]
    pub fn to_bech32m(&self, js_network: &DynamicValue) -> Result<String, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        Ok(self.0.to_bech32m_string(network.into()).to_string())
    }

    #[napi(js_name = "isP2PKH")]
    pub fn is_p2pkh(&self) -> bool {
        self.0.is_p2pkh()
    }

    #[napi(js_name = "isP2SH")]
    pub fn is_p2sh(&self) -> bool {
        self.0.is_p2sh()
    }

    #[napi(js_name = "hash")]
    pub fn hash(&self) -> Uint8Array {
        self.0.hash().to_vec().into()
    }
}
