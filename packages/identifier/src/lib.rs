use dpp::platform_value::string_encoding::Encoding::{Base58, Base64, Hex};
use dpp::prelude::Identifier;
use pshenmic_dpp_utils::identifier_from_js_value;
use wasm_bindgen::prelude::*;

#[derive(Copy, Clone)]
#[wasm_bindgen(js_name = "IdentifierWASM")]
pub struct IdentifierWASM(Identifier);

impl From<IdentifierWASM> for Identifier {
    fn from(identifier: IdentifierWASM) -> Self {
        identifier.0
    }
}

impl From<Identifier> for IdentifierWASM {
    fn from(identifier: Identifier) -> Self {
        IdentifierWASM(identifier)
    }
}

#[wasm_bindgen]
impl IdentifierWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: JsValue) -> Result<IdentifierWASM, JsValue> {
        let identifier = identifier_from_js_value(&js_identifier)?;

        Ok(IdentifierWASM(identifier))
    }

    #[wasm_bindgen(js_name = "getBase58")]
    pub fn get_base58(&self) -> String {
        self.0.to_string(Base58)
    }

    #[wasm_bindgen(js_name = "getBase64")]
    pub fn get_base64(&self) -> String {
        self.0.to_string(Base64)
    }

    #[wasm_bindgen(js_name = "getHex")]
    pub fn get_hex(&self) -> String {
        self.0.to_string(Hex)
    }

    #[wasm_bindgen(js_name = "getBytes")]
    pub fn get_bytes(&self) -> Vec<u8> {
        self.0.to_vec()
    }

    #[wasm_bindgen(js_name = "fromBase58")]
    pub fn from_base58(base58: String) -> Result<IdentifierWASM, JsValue> {
        let identitfier = Identifier::from_string(base58.as_str(), Base58)
            .map_err(|err| JsValue::from(err.to_string()))?;

        Ok(IdentifierWASM(identitfier))
    }

    #[wasm_bindgen(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentifierWASM, JsValue> {
        let identitfier = Identifier::from_string(base64.as_str(), Base64)
            .map_err(|err| JsValue::from(err.to_string()))?;

        Ok(IdentifierWASM(identitfier))
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentifierWASM, JsValue> {
        let identitfier = Identifier::from_string(hex.as_str(), Hex)
            .map_err(|err| JsValue::from(err.to_string()))?;

        Ok(IdentifierWASM(identitfier))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentifierWASM, JsValue> {
        let identifier =
            Identifier::from_vec(bytes).map_err(|err| JsValue::from(err.to_string()))?;

        Ok(IdentifierWASM(identifier))
    }
}
