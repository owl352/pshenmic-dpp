use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, PlatformAddressLikeNAPI},
    platform_address::PlatformAddressNAPI,
};

#[derive(Clone)]
#[napi(js_name = "OutputAddressNAPI")]
pub struct OutputAddressNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) credits: BigIntString,
}

#[napi]
impl OutputAddressNAPI {
    #[napi(constructor)]
    pub fn new(
        address: PlatformAddressLikeNAPI,
        credits: BigIntString,
    ) -> Result<Self, napi::Error> {
        Ok(OutputAddressNAPI {
            address: PlatformAddressNAPI::try_from(address)?,
            credits,
        })
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
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

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: BigIntString) {
        self.credits = credits
    }
}

#[derive(Clone)]
#[napi(js_name = "OutputAddressNullableCreditsNAPI")]
pub struct OutputAddressNullableCreditsNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) credits: Option<BigIntString>,
}

#[napi]
impl OutputAddressNullableCreditsNAPI {
    #[napi(constructor)]
    pub fn new(
        address: PlatformAddressLikeNAPI,
        credits: Option<BigIntString>,
    ) -> Result<Self, napi::Error> {
        Ok(OutputAddressNullableCreditsNAPI {
            address: PlatformAddressNAPI::try_from(address)?,
            credits,
        })
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> Option<BigIntString> {
        self.credits.clone()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, address: PlatformAddressLikeNAPI) -> Result<(), napi::Error> {
        self.address = PlatformAddressNAPI::try_from(address)?;
        Ok(())
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: Option<BigIntString>) {
        self.credits = credits
    }
}
