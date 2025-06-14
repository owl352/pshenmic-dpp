use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationItem")]
    pub fn minting_allow_choosing_destination_item(flag: bool) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(flag),
        )
    }

    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationControlGroupItem")]
    pub fn minting_allow_choosing_destination_control_group_item(
        action_taker: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(
                action_taker.clone().into(),
            ),
        )
    }

    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationAdminGroupItem")]
    pub fn minting_allow_choosing_destination_admin_group_item(
        action_taker: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(
                action_taker.clone().into(),
            ),
        )
    }
}
