use crate::token_transitions::token_mint::TokenMintTransitionWASM;
use dpp::state_transition::batch_transition::TokenMintTransition;
use dpp::state_transition::batch_transition::batched_transition::token_transition::TokenTransition;
use pshenmic_dpp_utils::{IntoWasm, get_class_type};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=TokenTransitionWASM)]
pub struct TokenTransitionWASM(TokenTransition);

impl From<TokenTransition> for TokenTransitionWASM {
    fn from(transition: TokenTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenTransitionWASM> for TokenTransition {
    fn from(transition: TokenTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl TokenTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenTransitionWASM".to_string()
    }
    #[wasm_bindgen(constructor)]
    pub fn new(js_transition: &JsValue) -> Result<TokenTransitionWASM, JsValue> {
        let transition = match js_transition.is_object() {
            true => match get_class_type(js_transition)?.to_lowercase().as_str() {
                "tokenminttransitionwasm" => Ok(TokenTransition::from(TokenMintTransition::from(
                    js_transition
                        .to_wasm::<TokenMintTransitionWASM>("TokenMintTransitionWASM")?
                        .clone(),
                ))),
                _ => Err(JsValue::from("Bad token transition input")),
            },
            false => Err(JsValue::from("Bad token transition input")),
        }?;

        Ok(TokenTransitionWASM(TokenTransition::from(transition)))
    }
}
