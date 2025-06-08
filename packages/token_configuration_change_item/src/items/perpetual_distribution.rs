use crate::TokenConfigurationChangeItemWASM;
use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use dpp::data_contract::associated_token::token_perpetual_distribution::TokenPerpetualDistribution;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use pshenmic_dpp_token_configuration::perpetual_distribution::TokenPerpetualDistributionWASM;
use pshenmic_dpp_utils::IntoWasm;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(js_name = "PerpetualDistributionConfigurationItem")]
    pub fn perpetual_distribution_item(js_perpetual_distribution_value: JsValue) -> Self {
        let perpetual_distribution_value: Option<TokenPerpetualDistribution> =
            match js_perpetual_distribution_value.is_undefined() {
                true => None,
                false => Some(
                    js_perpetual_distribution_value
                        .to_wasm::<TokenPerpetualDistributionWASM>("TokenPerpetualDistributionWASM")
                        .unwrap()
                        .clone()
                        .into(),
                ),
            };

        TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem::PerpetualDistribution(
            perpetual_distribution_value,
        ))
    }

    #[wasm_bindgen(js_name = "PerpetualDistributionControlGroupItem")]
    pub fn perpetual_distribution_control_group_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::PerpetualDistributionControlGroup(action_taker.clone().into()),
        )
    }

    #[wasm_bindgen(js_name = "PerpetualDistributionAdminGroupItem")]
    pub fn perpetual_distribution_admin_group_item(action_taker: &AuthorizedActionTakersWASM) -> Self {
        TokenConfigurationChangeItemWASM(
            TokenConfigurationChangeItem::PerpetualDistributionAdminGroup(action_taker.clone().into()),
        )
    }
}
