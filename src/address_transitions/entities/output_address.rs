use napi_derive::napi;

use crate::{dynamic_value::Uint64String, platform_address::PlatformAddressNAPI};

#[derive(Clone)]
#[napi(js_name = "OutputAddressNAPI")]
pub struct OutputAddressNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) credits: Uint64String,
}

#[napi]
impl OutputAddressNAPI {
    #[napi(constructor)]
    pub fn new(address: &PlatformAddressNAPI, credits: Uint64String) -> Self {
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
    pub fn credits(&self) -> Uint64String {
        self.credits.clone()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, address: &PlatformAddressNAPI) {
        self.address = address.clone()
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: Uint64String) {
        self.credits = credits
    }
}

#[derive(Clone)]
#[napi(js_name = "OutputAddressNullableCreditsNAPI")]
pub struct OutputAddressNullableCreditsNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) credits: Option<Uint64String>,
}

#[napi]
impl OutputAddressNullableCreditsNAPI {
    #[napi(constructor)]
    pub fn new(address: &PlatformAddressNAPI, credits: Option<Uint64String>) -> Self {
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
    pub fn credits(&self) -> Option<Uint64String> {
        self.credits.clone()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, address: &PlatformAddressNAPI) {
        self.address = address.clone()
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: Option<Uint64String>) {
        self.credits = credits
    }
}
