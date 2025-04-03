use dpp::dashcore::PrivateKey;
use pshenmic_dpp_enums::network::NetworkWASM;
use std::str::FromStr;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "PrivateKeyWASM")]
pub struct PrivateKeyWASM(PrivateKey);

#[wasm_bindgen]
impl PrivateKeyWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(wif: &str) -> Result<Self, JsValue> {
        let pk = PrivateKey::from_wif(wif).map_err(|err| JsValue::from_str(&*err.to_string()));

        match pk {
            Ok(pk) => Ok(PrivateKeyWASM(pk)),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>, network: NetworkWASM) -> Result<Self, JsValue> {
        let pk = PrivateKey::from_slice(bytes.as_slice(), network.into())
            .map_err(|err| JsValue::from_str(&*err.to_string()));

        match pk {
            Ok(pk) => Ok(PrivateKeyWASM(pk)),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "fromString")]
    pub fn from_string(key: String) -> Result<Self, JsValue> {
        let pk =
            PrivateKey::from_str(key.as_str()).map_err(|err| JsValue::from_str(&*err.to_string()));

        match pk {
            Ok(pk) => Ok(PrivateKeyWASM(pk)),
            Err(err) => Err(err),
        }
    }
}

#[wasm_bindgen]
impl PrivateKeyWASM {
    #[wasm_bindgen(js_name = "getKeyWIF")]
    pub fn get_key_wif(&self) -> String {
        self.0.to_wif()
    }

    #[wasm_bindgen(js_name = "getKeyBytes")]
    pub fn get_key_bytes(&self) -> Vec<u8> {
        self.0.to_bytes()
    }

    #[wasm_bindgen(js_name = "getKeyString")]
    pub fn to_string(&self) -> String {
        self.0.to_string()
    }
}
