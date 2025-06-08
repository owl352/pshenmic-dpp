use crate::token_base_transition::TokenBaseTransitionWASM;
use dpp::state_transition::batch_transition::TokenConfigUpdateTransition;
use dpp::state_transition::batch_transition::token_config_update_transition::TokenConfigUpdateTransitionV0;
use pshenmic_dpp_token_configuration_change_item::TokenConfigurationChangeItemWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = "TokenConfigUpdateTransitionWASM")]
pub struct TokenConfigUpdateTransitionWASM(TokenConfigUpdateTransition);

impl From<TokenConfigUpdateTransitionWASM> for TokenConfigUpdateTransition {
    fn from(transition: TokenConfigUpdateTransitionWASM) -> Self {
        transition.0
    }
}

impl From<TokenConfigUpdateTransition> for TokenConfigUpdateTransitionWASM {
    fn from(transition: TokenConfigUpdateTransition) -> Self {
        TokenConfigUpdateTransitionWASM(transition)
    }
}

#[wasm_bindgen]
impl TokenConfigUpdateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        base: &TokenBaseTransitionWASM,
        update_token_configuration_item: &TokenConfigurationChangeItemWASM,
        public_note: Option<String>,
    ) -> Result<TokenConfigUpdateTransitionWASM, JsValue> {
        Ok(TokenConfigUpdateTransitionWASM(
            TokenConfigUpdateTransition::V0(TokenConfigUpdateTransitionV0 {
                base: base.clone().into(),
                update_token_configuration_item: update_token_configuration_item.clone().into(),
                public_note,
            }),
        ))
    }
}
