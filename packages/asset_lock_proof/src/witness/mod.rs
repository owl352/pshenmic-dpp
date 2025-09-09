use dpp::dashcore::Witness;
use js_sys::Uint8Array;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "WitnessWASM")]
pub struct WitnessWASM(Witness);

impl From<Witness> for WitnessWASM {
    fn from(witness: Witness) -> Self {
        WitnessWASM(witness)
    }
}

impl From<WitnessWASM> for Witness {
    fn from(witness: WitnessWASM) -> Self {
        witness.0
    }
}

#[wasm_bindgen]
impl WitnessWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "WitnessWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "WitnessWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(optional_bytes: Option<Vec<Uint8Array>>) -> Self {
        WitnessWASM(match optional_bytes {
            None => Witness::new(),
            Some(bytes) => Witness::from(
                bytes
                    .iter()
                    .map(|v| v.to_vec().clone())
                    .collect::<Vec<Vec<u8>>>(),
            ),
        })
    }

    #[wasm_bindgen(js_name = "getBytes")]
    pub fn get_bytes(&self) -> Vec<Uint8Array> {
        self.0
            .to_vec()
            .iter()
            .map(|v| Uint8Array::from(v.as_slice()))
            .collect()
    }

    #[wasm_bindgen(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    #[wasm_bindgen(js_name = "clear")]
    pub fn clear(&mut self) {
        self.0.clear();
    }

    #[wasm_bindgen(js_name = "push")]
    pub fn push(&mut self, new_element: Vec<u8>) {
        self.0.push(new_element)
    }
}
