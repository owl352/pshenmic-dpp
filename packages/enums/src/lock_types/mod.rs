use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsError;

#[wasm_bindgen(js_name = "AssetLockProofTypeWASM")]
pub enum AssetLockProofTypeWASM {
    Instant = 0,
    Chain = 1,
}

impl From<AssetLockProofTypeWASM> for String {
    fn from(value: AssetLockProofTypeWASM) -> Self {
        match value {
            AssetLockProofTypeWASM::Instant => String::from("Instant"),
            AssetLockProofTypeWASM::Chain => String::from("Chain"),
        }
    }
}

impl TryFrom<u8> for AssetLockProofTypeWASM {
    type Error = JsError;
    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::Instant),
            1 => Ok(Self::Chain),
            _ => Err(JsError::new("Unexpected asset lock proof type")),
        }
    }
}

impl TryFrom<u64> for AssetLockProofTypeWASM {
    type Error = JsError;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::Instant),
            1 => Ok(Self::Chain),
            _ => Err(JsError::new("Unexpected asset lock proof type")),
        }
    }
}
