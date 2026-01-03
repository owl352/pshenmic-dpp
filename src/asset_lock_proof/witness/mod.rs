use dpp::dashcore::Witness;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "WitnessNAPI")]
pub struct WitnessNAPI(Witness);

impl From<Witness> for WitnessNAPI {
    fn from(witness: Witness) -> Self {
        WitnessNAPI(witness)
    }
}

impl From<WitnessNAPI> for Witness {
    fn from(witness: WitnessNAPI) -> Self {
        witness.0
    }
}

#[napi]
impl WitnessNAPI {
    #[napi(constructor)]
    pub fn new(optional_bytes: Option<Vec<Uint8Array>>) -> Self {
        WitnessNAPI(match optional_bytes {
            None => Witness::new(),
            Some(bytes) => Witness::from(
                bytes
                    .iter()
                    .map(|v| v.to_vec().clone())
                    .collect::<Vec<Vec<u8>>>(),
            ),
        })
    }

    #[napi(js_name = "getBytes")]
    pub fn get_bytes(&self) -> Vec<Uint8Array> {
        self.0
            .to_vec()
            .iter()
            .map(|v| Uint8Array::from(v.as_slice()))
            .collect()
    }

    #[napi(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    #[napi(js_name = "clear")]
    pub fn clear(&mut self) {
        self.0.clear();
    }

    #[napi(js_name = "push")]
    pub fn push(&mut self, new_element: Uint8Array) {
        self.0.push(new_element.to_vec())
    }
}
