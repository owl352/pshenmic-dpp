use crate::TokenConfigurationChangeItemWASM;
use dpp::balances::credits::TokenAmount;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "MaxSupplyItem")]
    pub fn max_supply_item(supply: Option<TokenAmount>) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupply(supply))
    }

    #[wasm_bindgen(js_name = "MaxSupplyControlGroupItem")]
    pub fn max_supply_control_group_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupplyControlGroup(
            action_taker.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "MaxSupplyAdminGroupItem")]
    pub fn max_supply_admin_group_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupplyAdminGroup(
            action_taker.clone().into(),
        ))
    }
}
