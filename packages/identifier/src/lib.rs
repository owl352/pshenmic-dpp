use dpp::platform_value::string_encoding::Encoding::{Base58, Base64, Hex};
use dpp::prelude::Identifier;
use pshenmic_dpp_utils::{IntoWasm, get_class_type, identifier_from_js_value};
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

impl From<[u8; 32]> for IdentifierWASM {
    fn from(identifier: [u8; 32]) -> Self {
        IdentifierWASM(Identifier::new(identifier))
    }
}

impl From<&IdentifierWASM> for Identifier {
    fn from(identifier: &IdentifierWASM) -> Self {
        identifier.clone().into()
    }
}

impl TryFrom<JsValue> for IdentifierWASM {
    type Error = JsValue;
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        match value.is_object() {
            true => match get_class_type(&value) {
                Ok(class_type) => match class_type.as_str() {
                    "IdentifierWASM" => {
                        Ok(value.to_wasm::<IdentifierWASM>("IdentifierWASM")?.clone())
                    }
                    "" => Ok(identifier_from_js_value(&value)?.into()),
                    _ => Err(Self::Error::from_str(&format!(
                        "Invalid type of data for identifier (passed {})",
                        class_type
                    ))),
                },
                Err(_) => Ok(identifier_from_js_value(&value)?.into()),
            },
            false => Ok(identifier_from_js_value(&value)?.into()),
        }
    }
}

impl TryFrom<&JsValue> for IdentifierWASM {
    type Error = JsValue;
    fn try_from(value: &JsValue) -> Result<Self, Self::Error> {
        IdentifierWASM::try_from(value.clone())
    }
}

#[wasm_bindgen]
impl IdentifierWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "IdentifierWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "IdentifierWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: &JsValue) -> Result<IdentifierWASM, JsValue> {
        IdentifierWASM::try_from(js_identifier)
    }

    #[wasm_bindgen(js_name = "base58")]
    pub fn get_base58(&self) -> String {
        self.0.to_string(Base58)
    }

    #[wasm_bindgen(js_name = "base64")]
    pub fn get_base64(&self) -> String {
        self.0.to_string(Base64)
    }

    #[wasm_bindgen(js_name = "hex")]
    pub fn get_hex(&self) -> String {
        self.0.to_string(Hex)
    }

    #[wasm_bindgen(js_name = "bytes")]
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

impl IdentifierWASM {
    pub fn to_slice(&self) -> [u8; 32] {
        self.0.as_bytes().clone()
    }
}
