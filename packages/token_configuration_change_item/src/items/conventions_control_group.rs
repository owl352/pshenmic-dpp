use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "ConventionsControlGroupConfiguration")]
    pub fn conventions_control_group_configuration(
        action_taker: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ConventionsControlGroup(
            action_taker.clone().into(),
        ))
    }
}
