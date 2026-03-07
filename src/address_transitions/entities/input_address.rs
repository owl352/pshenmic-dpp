use napi_derive::napi;

use crate::dynamic_value::{BigIntString, PlatformAddressLikeNAPI};
use crate::platform_address::PlatformAddressNAPI;

#[derive(Clone)]
#[napi(js_name = "InputAddressNAPI")]
pub struct InputAddressNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) nonce: u32,
    pub(crate) credits: BigIntString,
}

#[napi]
impl InputAddressNAPI {
    #[napi(constructor)]
    pub fn new(
        address: PlatformAddressLikeNAPI,
        nonce: u32,
        credits: BigIntString,
    ) -> Result<Self, napi::Error> {
        Ok(InputAddressNAPI {
            address: PlatformAddressNAPI::try_from(address)?,
            nonce,
            credits,
        })
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn nonce(&self) -> u32 {
        self.nonce
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> BigIntString {
        self.credits.clone()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, address: PlatformAddressLikeNAPI) -> Result<(), napi::Error> {
        self.address = PlatformAddressNAPI::try_from(address)?;

        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: u32) {
        self.nonce = nonce
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: BigIntString) {
        self.credits = credits
    }
}
