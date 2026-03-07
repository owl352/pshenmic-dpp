pub mod address_witness;

use dpp::address_funds::PlatformAddress;
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, PlatformAddressLikeNAPI},
    enums::network::NetworkNAPI,
    utils::WithJsError,
};

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

impl TryFrom<Either<&PlatformAddressNAPI, &DynamicValue>> for PlatformAddressNAPI {
    type Error = napi::Error;

    fn try_from(value: Either<&PlatformAddressNAPI, &DynamicValue>) -> Result<Self, Self::Error> {
        match value {
            Either::A(addr) => Ok(addr.clone()),
            Either::B(dyn_val) => {
                if dyn_val.is_string() {
                    PlatformAddressNAPI::from_bech32m(dyn_val.as_string().unwrap())
                } else if dyn_val.is_uint_8_array() {
                    PlatformAddressNAPI::from_bytes(dyn_val.as_bytes().unwrap().clone().into())
                } else {
                    Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Invalid Platform Address value ",
                    ))
                }
            }
        }
    }
}

#[napi]
impl PlatformAddressNAPI {
    #[napi(constructor)]
    pub fn new(address: PlatformAddressLikeNAPI) -> Result<PlatformAddressNAPI, napi::Error> {
        PlatformAddressNAPI::try_from(address)
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

    #[napi(js_name = "fromBech32m")]
    pub fn from_bech32m(bech32m: String) -> Result<Self, napi::Error> {
        Ok(PlatformAddressNAPI(
            PlatformAddress::from_bech32m_string(bech32m.as_str())
                .with_js_error()?
                .0,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        Ok(PlatformAddressNAPI(
            PlatformAddress::from_bytes(bytes.to_vec().as_slice()).with_js_error()?,
        ))
    }
}
