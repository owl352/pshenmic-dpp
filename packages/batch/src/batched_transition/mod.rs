use crate::document_transition::DocumentTransitionWASM;
use crate::token_transition::TokenTransitionWASM;
use dpp::state_transition::batch_transition::batched_transition::BatchedTransition;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::token_transition::TokenTransition;
use pshenmic_dpp_utils::{IntoWasm, get_class_type};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=BatchedTransitionWASM)]
pub struct BatchedTransitionWASM(BatchedTransition);

impl From<BatchedTransition> for BatchedTransitionWASM {
    fn from(v: BatchedTransition) -> Self {
        BatchedTransitionWASM(v)
    }
}

impl From<BatchedTransitionWASM> for BatchedTransition {
    fn from(v: BatchedTransitionWASM) -> Self {
        v.0
    }
}

#[wasm_bindgen]
impl BatchedTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "BatchedTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(js_transition: &JsValue) -> Result<BatchedTransitionWASM, JsValue> {
        match js_transition.is_undefined() && js_transition.is_object() {
            true => Err(JsValue::from_str("transition is undefined")),
            false => match get_class_type(js_transition)?.as_str() {
                "TokenTransitionWASM" => Ok(BatchedTransitionWASM::from(BatchedTransition::from(
                    TokenTransition::from(
                        js_transition
                            .to_wasm::<TokenTransitionWASM>("TokenTransitionWASM")?
                            .clone(),
                    ),
                ))),
                "DocumentTransitionWASM" => Ok(BatchedTransitionWASM(BatchedTransition::Document(
                    DocumentTransition::from(
                        js_transition
                            .to_wasm::<DocumentTransitionWASM>("DocumentTransitionWASM")?
                            .clone(),
                    ),
                ))),
                _ => Err(JsValue::from_str("Invalid transition type")),
            },
        }
    }

    #[wasm_bindgen(js_name = "toTransition")]
    pub fn to_transition(&self) -> JsValue {
        match &self.0 {
            BatchedTransition::Document(document_transition) => {
                DocumentTransitionWASM::from(document_transition.clone()).into()
            }
            BatchedTransition::Token(token_transition) => {
                TokenTransitionWASM::from(token_transition.clone()).into()
            }
        }
    }
}
