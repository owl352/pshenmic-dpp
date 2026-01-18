use dpp::fee::Credits;
use dpp::prelude::AddressNonce;
use pshenmic_dpp_platform_address::PlatformAddressWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "InputAddressWASM")]
pub struct InputAddressWASM {
    pub(crate) address: PlatformAddressWASM,
    pub(crate) nonce: AddressNonce,
    pub(crate) credits: Credits,
}

#[wasm_bindgen]
impl InputAddressWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "InputAddressWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "InputAddressWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(address: &PlatformAddressWASM, nonce: AddressNonce, credits: Credits) -> Self {
        InputAddressWASM {
            address: address.clone(),
            nonce,
            credits,
        }
    }

    #[wasm_bindgen(getter=address)]
    pub fn address(&self) -> PlatformAddressWASM {
        self.address.clone()
    }

    #[wasm_bindgen(getter=nonce)]
    pub fn nonce(&self) -> AddressNonce {
        self.nonce
    }

    #[wasm_bindgen(getter=credits)]
    pub fn credits(&self) -> Credits {
        self.credits
    }

    #[wasm_bindgen(setter=address)]
    pub fn set_address(&mut self, address: &PlatformAddressWASM) {
        self.address = address.clone()
    }

    #[wasm_bindgen(setter=nonce)]
    pub fn set_nonce(&mut self, nonce: AddressNonce) {
        self.nonce = nonce
    }

    #[wasm_bindgen(setter=credits)]
    pub fn set_credits(&mut self, credits: Credits) {
        self.credits = credits
    }
}
