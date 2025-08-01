pub mod items;

use dpp::data_contract::associated_token::token_configuration_item::TokenConfigurationChangeItem;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_token_configuration::authorized_action_takers::AuthorizedActionTakersWASM;
use pshenmic_dpp_token_configuration::configuration_convention::TokenConfigurationConventionWASM;
use pshenmic_dpp_token_configuration::perpetual_distribution::TokenPerpetualDistributionWASM;
use pshenmic_dpp_token_configuration::trade_mode::TokenTradeModeWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = "TokenConfigurationChangeItemWASM")]
pub struct TokenConfigurationChangeItemWASM(TokenConfigurationChangeItem);

impl From<TokenConfigurationChangeItemWASM> for TokenConfigurationChangeItem {
    fn from(item: TokenConfigurationChangeItemWASM) -> Self {
        item.0
    }
}

impl From<TokenConfigurationChangeItem> for TokenConfigurationChangeItemWASM {
    fn from(item: TokenConfigurationChangeItem) -> Self {
        TokenConfigurationChangeItemWASM(item)
    }
}

#[wasm_bindgen]
impl TokenConfigurationChangeItemWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenConfigurationChangeItemWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "TokenConfigurationChangeItemWASM".to_string()
    }

    #[wasm_bindgen(js_name = "getItemName")]
    pub fn get_item_name(&self) -> String {
        match self.0.clone() {
            TokenConfigurationChangeItem::TokenConfigurationNoChange => {
                String::from("TokenConfigurationNoChange")
            }
            TokenConfigurationChangeItem::Conventions(_) => String::from("Conventions"),
            TokenConfigurationChangeItem::ConventionsControlGroup(_) => {
                String::from("ConventionsControlGroup")
            }
            TokenConfigurationChangeItem::ConventionsAdminGroup(_) => {
                String::from("ConventionsAdminGroup")
            }
            TokenConfigurationChangeItem::MaxSupply(_) => String::from("MaxSupply"),
            TokenConfigurationChangeItem::MaxSupplyControlGroup(_) => {
                String::from("MaxSupplyControlGroup")
            }
            TokenConfigurationChangeItem::MaxSupplyAdminGroup(_) => {
                String::from("MaxSupplyAdminGroup")
            }
            TokenConfigurationChangeItem::PerpetualDistribution(_) => {
                String::from("PerpetualDistribution")
            }
            TokenConfigurationChangeItem::PerpetualDistributionControlGroup(_) => {
                String::from("PerpetualDistributionControlGroup")
            }
            TokenConfigurationChangeItem::PerpetualDistributionAdminGroup(_) => {
                String::from("PerpetualDistributionAdminGroup")
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentity(_) => {
                String::from("NewTokensDestinationIdentity")
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentityControlGroup(_) => {
                String::from("NewTokensDestinationIdentityControlGroup")
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentityAdminGroup(_) => {
                String::from("NewTokensDestinationIdentityAdminGroup")
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(_) => {
                String::from("MintingAllowChoosingDestination")
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(_) => {
                String::from("MintingAllowChoosingDestinationControlGroup")
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(_) => {
                String::from("MintingAllowChoosingDestinationAdminGroup")
            }
            TokenConfigurationChangeItem::ManualMinting(_) => String::from("ManualMinting"),
            TokenConfigurationChangeItem::ManualMintingAdminGroup(_) => {
                String::from("ManualMintingAdminGroup")
            }
            TokenConfigurationChangeItem::ManualBurning(_) => String::from("ManualBurning"),
            TokenConfigurationChangeItem::ManualBurningAdminGroup(_) => {
                String::from("ManualBurningAdminGroup")
            }
            TokenConfigurationChangeItem::Freeze(_) => String::from("Freeze"),
            TokenConfigurationChangeItem::FreezeAdminGroup(_) => String::from("FreezeAdminGroup"),
            TokenConfigurationChangeItem::Unfreeze(_) => String::from("Unfreeze"),
            TokenConfigurationChangeItem::UnfreezeAdminGroup(_) => {
                String::from("UnfreezeAdminGroup")
            }
            TokenConfigurationChangeItem::DestroyFrozenFunds(_) => {
                String::from("DestroyFrozenFunds")
            }
            TokenConfigurationChangeItem::DestroyFrozenFundsAdminGroup(_) => {
                String::from("DestroyFrozenFundsAdminGroup")
            }
            TokenConfigurationChangeItem::EmergencyAction(_) => String::from("EmergencyAction"),
            TokenConfigurationChangeItem::EmergencyActionAdminGroup(_) => {
                String::from("EmergencyActionAdminGroup")
            }
            TokenConfigurationChangeItem::MarketplaceTradeMode(_) => {
                String::from("MarketplaceTradeMode")
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeControlGroup(_) => {
                String::from("MarketplaceTradeModeControlGroup")
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeAdminGroup(_) => {
                String::from("MarketplaceTradeModeAdminGroup")
            }
            TokenConfigurationChangeItem::MainControlGroup(_) => String::from("MainControlGroup"),
        }
    }

    #[wasm_bindgen(js_name = "getItem")]
    pub fn get_item(&self) -> JsValue {
        match self.0.clone() {
            TokenConfigurationChangeItem::TokenConfigurationNoChange => {
                JsValue::from_str("TokenConfigurationNoChange")
            }
            TokenConfigurationChangeItem::Conventions(convention) => {
                JsValue::from(TokenConfigurationConventionWASM::from(convention))
            }
            TokenConfigurationChangeItem::ConventionsControlGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::ConventionsAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MaxSupply(amount) => JsValue::from(amount),
            TokenConfigurationChangeItem::MaxSupplyControlGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MaxSupplyAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::PerpetualDistribution(perpetual_distribution) => {
                match perpetual_distribution {
                    Some(token_perpetual_distribution) => JsValue::from(
                        TokenPerpetualDistributionWASM::from(token_perpetual_distribution),
                    ),
                    None => JsValue::null(),
                }
            }
            TokenConfigurationChangeItem::PerpetualDistributionControlGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::PerpetualDistributionAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentity(identifier) => {
                match identifier {
                    Some(id) => JsValue::from(IdentifierWASM::from(id)),
                    None => JsValue::null(),
                }
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentityControlGroup(
                action_takers,
            ) => JsValue::from(AuthorizedActionTakersWASM::from(action_takers)),
            TokenConfigurationChangeItem::NewTokensDestinationIdentityAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(flag) => {
                JsValue::from_bool(flag)
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(
                action_takers,
            ) => JsValue::from(AuthorizedActionTakersWASM::from(action_takers)),
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(
                action_takers,
            ) => JsValue::from(AuthorizedActionTakersWASM::from(action_takers)),
            TokenConfigurationChangeItem::ManualMinting(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualMintingAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualBurning(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualBurningAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::Freeze(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::FreezeAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::Unfreeze(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::UnfreezeAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::DestroyFrozenFunds(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::DestroyFrozenFundsAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::EmergencyAction(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::EmergencyActionAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MarketplaceTradeMode(trade_mode) => {
                JsValue::from(TokenTradeModeWASM::from(trade_mode))
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeControlGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeAdminGroup(action_takers) => {
                JsValue::from(AuthorizedActionTakersWASM::from(action_takers))
            }
            TokenConfigurationChangeItem::MainControlGroup(group_contract_position) => {
                JsValue::from(group_contract_position)
            }
        }
    }
}
