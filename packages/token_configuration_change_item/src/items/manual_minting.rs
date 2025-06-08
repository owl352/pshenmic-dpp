use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "ManualMintingConfiguration")]
    pub fn manual_minting(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ManualMinting(
            action.clone().into(),
        ))
    }

    #[wasm_bindgen(js_name = "ManualMintingAdminGroupConfiguration")]
    pub fn manual_minting_admin_group(action: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::ManualMintingAdminGroup(
            action.clone().into(),
        ))
    }
}
