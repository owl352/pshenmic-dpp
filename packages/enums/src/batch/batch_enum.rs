use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "BatchType")]
pub enum BatchType {
    CREATE,
    REPLACE,
    DELETE,
}

impl From<u8> for BatchType {
    fn from(value: u8) -> Self {
        match value {
            0 => BatchType::CREATE,
            1 => BatchType::REPLACE,
            2 => BatchType::DELETE,
            _ => panic!("Invalid BatchType"),
        }
    }
}
