use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "ManualBurningConfiguration")]
    pub fn manual_burning(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ManualBurning(
            action.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "ManualBurningAdminGroupConfiguration")]
    pub fn manual_burning_admin_group(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ManualBurningAdminGroup(
            action.clone().into(),
        ))
    }
}
