pub mod address_witness;

use dpp::address_funds::PlatformAddress;
use pshenmic_dpp_enums::network::NetworkWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "PlatformAddressWASM")]
pub struct PlatformAddressWASM(PlatformAddress);

impl From<PlatformAddress> for PlatformAddressWASM {
    fn from(platform: PlatformAddress) -> Self {
        Self(platform)
    }
}

impl From<PlatformAddressWASM> for PlatformAddress {
    fn from(platform: PlatformAddressWASM) -> Self {
        platform.0
    }
}

#[wasm_bindgen]
impl PlatformAddressWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "PlatformAddressWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "PlatformAddressWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(address: Vec<u8>) -> Result<PlatformAddressWASM, JsValue> {
        Ok(PlatformAddressWASM(
            PlatformAddress::from_bytes(address.as_slice()).with_js_error()?,
        ))
    }

    #[wasm_bindgen(js_name = "bytes")]
    pub fn address(&self) -> Vec<u8> {
        self.0.to_bytes()
    }

    #[wasm_bindgen(js_name = "toAddress")]
    pub fn to_address(&self, js_network: JsValue) -> Result<String, JsValue> {
        let network = NetworkWASM::try_from(js_network)?;

        Ok(self.0.to_address_with_network(network.into()).to_string())
    }

    #[wasm_bindgen(js_name = "isP2PKH")]
    pub fn is_p2pkh(&self) -> bool {
        self.0.is_p2pkh()
    }

    #[wasm_bindgen(js_name = "isP2SH")]
    pub fn is_p2sh(&self) -> bool {
        self.0.is_p2sh()
    }

    #[wasm_bindgen(js_name = "hash")]
    pub fn hash(&self) -> Vec<u8> {
        self.0.hash().to_vec()
    }
}
