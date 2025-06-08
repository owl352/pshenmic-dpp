use crate::TokenConfigurationChangeItemWASM;
use dpp::balances::credits::TokenAmount;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "MaxSupplyConfiguration")]
    pub fn max_supply_configuration(supply: Option<TokenAmount>) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupply(supply))
    }

    #[wasm_bindgen(js_name = "MaxSupplyControlGroupConfiguration")]
    pub fn max_supply_control_group(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupplyControlGroup(
            action.clone().into(),
        ))
    }
    
    #[wasm_bindgen(js_name = "MaxSupplyAdminGroupConfiguration")]
    pub fn max_supply_admin_group(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::MaxSupplyAdminGroup(action.clone().into()))
    }
}
