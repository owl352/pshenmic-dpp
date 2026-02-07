use napi_derive::napi;

use crate::{dynamic_value::BigIntString, platform_address::PlatformAddressNAPI};

#[derive(Clone)]
#[napi(js_name = "OutputAddressNAPI")]
pub struct OutputAddressNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) credits: BigIntString,
}

#[napi]
impl OutputAddressNAPI {
    #[napi(constructor)]
    pub fn new(address: &PlatformAddressNAPI, credits: BigIntString) -> Self {
        OutputAddressNAPI {
            address: address.clone(),
            credits,
        }
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
    pub fn set_address(&mut self, address: &PlatformAddressNAPI) {
        self.address = address.clone()
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
    pub fn new(address: &PlatformAddressNAPI, credits: Option<BigIntString>) -> Self {
        OutputAddressNullableCreditsNAPI {
            address: address.clone(),
            credits,
        }
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
    pub fn set_address(&mut self, address: &PlatformAddressNAPI) {
        self.address = address.clone()
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: Option<BigIntString>) {
        self.credits = credits
    }
}
