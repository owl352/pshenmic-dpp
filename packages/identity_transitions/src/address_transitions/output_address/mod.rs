use dpp::fee::Credits;
use pshenmic_dpp_platform_address::PlatformAddressWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "OutputAddressWASM")]
pub struct OutputAddressWASM {
    pub(crate) address: PlatformAddressWASM,
    pub(crate) credits: Credits,
}

#[wasm_bindgen]
impl OutputAddressWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "OutputAddressWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "OutputAddressWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(address: &PlatformAddressWASM, credits: Credits) -> Self {
        OutputAddressWASM { address: address.clone(), credits }
    }

    #[wasm_bindgen(getter=address)]
    pub fn address(&self) -> PlatformAddressWASM {
        self.address.clone()
    }

    #[wasm_bindgen(getter=credits)]
    pub fn credits(&self) -> Credits {
        self.credits
    }

    #[wasm_bindgen(setter=address)]
    pub fn set_address(&mut self, address: &PlatformAddressWASM) {
        self.address = address.clone()
    }

    #[wasm_bindgen(setter=credits)]
    pub fn set_credits(&mut self, credits: Credits) {
        self.credits = credits
    }
}
