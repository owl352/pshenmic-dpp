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

    #[wasm_bindgen(js_name = "fromTokenTransition")]
    pub fn from_token_transition(transition: &TokenTransitionWASM) -> BatchedTransitionWASM {
        BatchedTransitionWASM(BatchedTransition::from(TokenTransition::from(
            transition.clone(),
        )))
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(transition: &DocumentTransitionWASM) -> BatchedTransitionWASM {
        BatchedTransitionWASM(BatchedTransition::from(DocumentTransition::from(
            transition.clone(),
        )))
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
