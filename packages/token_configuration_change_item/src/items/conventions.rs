use crate::TokenConfigurationChangeItemWASM;
use crate::items::entities::configuration_convention::TokenConfigurationConventionWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "conventionsConfiguration")]
    pub fn conventions_configuration(convention: &TokenConfigurationConventionWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::Conventions(
            convention.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "ConventionsAdminGroupConfiguration")]
    pub fn conventions_admin_group_configuration(
        action_taker: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ConventionsAdminGroup(
            action_taker.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "ConventionsControlGroupConfiguration")]
    pub fn conventions_control_group_configuration(
        action_taker: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ConventionsControlGroup(
            action_taker.clone().into(),
        ))
    }
}
