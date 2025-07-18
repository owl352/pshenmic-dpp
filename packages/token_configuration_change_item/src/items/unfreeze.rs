use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "UnfreezeItem")]
    pub fn unfreeze_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::Unfreeze(
            action_taker.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "UnfreezeAdminGroupItem")]
    pub fn unfreeze_admin_group_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::UnfreezeAdminGroup(
            action_taker.clone().into(),
        ))
    }
}
