use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;
use crate::TokenConfigurationChangeItemWASM;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = noChangeConfiguration)]
    pub fn no_changes_configuration() -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::TokenConfigurationNoChange)
    }
}