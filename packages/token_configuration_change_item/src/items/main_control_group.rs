use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::GroupContractPosition;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "MainControlGroupItem")]
    pub fn main_control_group_item(group_contract_position: Option<GroupContractPosition>) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MainControlGroup(
            group_contract_position,
        ))
    }
}
