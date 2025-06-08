use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationConfiguration")]
    pub fn minting_allow_choosing_destination(flag: bool) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(flag),
        )
    }

    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationControlGroupConfiguration")]
    pub fn minting_allow_choosing_destination_control_group(
        action: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(
                action.clone().into(),
            ),
        )
    }

    #[wasm_bindgen(js_name = "MintingAllowChoosingDestinationAdminGroupConfiguration")]
    pub fn minting_allow_choosing_destination_admin_group(
        action: &AuthorizedActionTakersWASM,
    ) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(
                action.clone().into(),
            ),
        )
    }
}
