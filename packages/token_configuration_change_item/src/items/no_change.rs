use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "noChangeItem")]
    pub fn no_changes_item() -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::TokenConfigurationNoChange)
    }
}
