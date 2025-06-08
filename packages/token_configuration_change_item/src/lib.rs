pub mod items;

use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = "TokenConfigurationChangeItemWASM")]
pub struct TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem);

impl From<TokenConfigurationChangeItemWASM> for TokenConfigurationChangeItem {
    fn from(item: TokenConfigurationChangeItemWASM) -> Self {
        item.0
    }
}

impl From<TokenConfigurationChangeItem> for TokenConfigurationChangeItemWASM {
    fn from(item: TokenConfigurationChangeItem) -> Self {
        TokenConfigurationChangeItemWASM(item)
    }
}
