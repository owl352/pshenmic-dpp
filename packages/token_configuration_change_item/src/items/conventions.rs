use crate::TokenConfigurationChangeItemWASM;
use crate::items::entities::configuration_convention::TokenConfigurationConventionWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "conventionsConfiguration")]
    pub fn conventions_configuration(convention: &TokenConfigurationConventionWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::Conventions(
            convention.clone().into(),
        ))
    }
}
