use dpp::{
    data_contract::associated_token::{
        token_configuration_item::TokenConfigurationChangeItem,
        token_perpetual_distribution::TokenPerpetualDistribution,
    },
    prelude::Identifier,
};
use napi::bindgen_prelude::Either9;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64},
    identifier::IdentifierNAPI,
    token_configuration::{
        authorized_action_taker::AuthorizedActionTakersNAPI,
        configuration_convention::TokenConfigurationConventionNAPI,
        perpetual_distribution::TokenPerpetualDistributionNAPI, trade_mode::TokenTradeModeNAPI,
    },
};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenConfigurationChangeItemNAPI")]
pub struct TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem);

impl From<TokenConfigurationChangeItemNAPI> for TokenConfigurationChangeItem {
    fn from(item: TokenConfigurationChangeItemNAPI) -> Self {
        item.0
    }
}

impl From<TokenConfigurationChangeItem> for TokenConfigurationChangeItemNAPI {
    fn from(item: TokenConfigurationChangeItem) -> Self {
        TokenConfigurationChangeItemNAPI(item)
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "getItemName")]
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

    #[napi(js_name = "getItem")]
    pub fn get_item(
        &self,
    ) -> Either9<
        String,
        TokenConfigurationConventionNAPI,
        AuthorizedActionTakersNAPI,
        Option<BigIntString>,
        Option<TokenPerpetualDistributionNAPI>,
        Option<IdentifierNAPI>,
        bool,
        TokenTradeModeNAPI,
        Option<u16>,
    > {
        match self.0.clone() {
            TokenConfigurationChangeItem::TokenConfigurationNoChange => {
                Either9::A("TokenConfigurationNoChange".to_string())
            }
            TokenConfigurationChangeItem::Conventions(convention) => {
                Either9::B(TokenConfigurationConventionNAPI::from(convention))
            }
            TokenConfigurationChangeItem::ConventionsControlGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::ConventionsAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MaxSupply(amount) => {
                Either9::D(amount.map(BigIntString::from_u64))
            }
            TokenConfigurationChangeItem::MaxSupplyControlGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MaxSupplyAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::PerpetualDistribution(perpetual_distribution) => {
                Either9::E(perpetual_distribution.map(TokenPerpetualDistributionNAPI::from))
            }
            TokenConfigurationChangeItem::PerpetualDistributionControlGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::PerpetualDistributionAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentity(identifier) => {
                Either9::F(identifier.map(IdentifierNAPI::from))
            }
            TokenConfigurationChangeItem::NewTokensDestinationIdentityControlGroup(
                action_takers,
            ) => Either9::C(AuthorizedActionTakersNAPI::from(action_takers)),
            TokenConfigurationChangeItem::NewTokensDestinationIdentityAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(flag) => Either9::G(flag),
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(
                action_takers,
            ) => Either9::C(AuthorizedActionTakersNAPI::from(action_takers)),
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(
                action_takers,
            ) => Either9::C(AuthorizedActionTakersNAPI::from(action_takers)),
            TokenConfigurationChangeItem::ManualMinting(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualMintingAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualBurning(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::ManualBurningAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::Freeze(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::FreezeAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::Unfreeze(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::UnfreezeAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::DestroyFrozenFunds(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::DestroyFrozenFundsAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::EmergencyAction(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::EmergencyActionAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MarketplaceTradeMode(trade_mode) => {
                Either9::H(TokenTradeModeNAPI::from(trade_mode))
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeControlGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MarketplaceTradeModeAdminGroup(action_takers) => {
                Either9::C(AuthorizedActionTakersNAPI::from(action_takers))
            }
            TokenConfigurationChangeItem::MainControlGroup(group_contract_position) => {
                Either9::I(group_contract_position)
            }
        }
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "ConventionsItem")]
    pub fn conventions_item(convention: &TokenConfigurationConventionNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::Conventions(
            convention.clone().into(),
        ))
    }

    #[napi(js_name = "ConventionsAdminGroupItem")]
    pub fn conventions_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ConventionsAdminGroup(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "ConventionsControlGroupItem")]
    pub fn conventions_control_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ConventionsControlGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "FreezeItem")]
    pub fn freeze_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> TokenConfigurationChangeItemNAPI {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::Freeze(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "FreezeAdminGroupItem")]
    pub fn freeze_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> TokenConfigurationChangeItemNAPI {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::FreezeAdminGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "DestroyFrozenFundsItem")]
    pub fn destroy_frozen_funds_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::DestroyFrozenFunds(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "DestroyFrozenFundsAdminGroupItem")]
    pub fn destroy_frozen_funds_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::DestroyFrozenFundsAdminGroup(action_taker.clone().into()),
        )
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "EmergencyActionItem")]
    pub fn emergency_action_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> TokenConfigurationChangeItemNAPI {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::EmergencyAction(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "EmergencyActionAdminGroupItem")]
    pub fn emergency_action_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> TokenConfigurationChangeItemNAPI {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::EmergencyActionAdminGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "MainControlGroupItem")]
    pub fn main_control_group_item(group_contract_position: Option<u16>) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::MainControlGroup(
            group_contract_position,
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "ManualBurningItem")]
    pub fn manual_burning_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ManualBurning(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "ManualBurningAdminGroupItem")]
    pub fn manual_burning_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ManualBurningAdminGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "ManualMintingItem")]
    pub fn manual_minting_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ManualMinting(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "ManualMintingAdminGroupItem")]
    pub fn manual_minting_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::ManualMintingAdminGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "MarketplaceTradeModeItem")]
    pub fn market_trade_mode_item(trade_mode: &TokenTradeModeNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::MarketplaceTradeMode(
            trade_mode.clone().into(),
        ))
    }

    #[napi(js_name = "MarketplaceTradeModeControlGroupItem")]
    pub fn market_trade_mode_control_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MarketplaceTradeModeControlGroup(
                action_taker.clone().into(),
            ),
        )
    }

    #[napi(js_name = "MarketplaceTradeModeAdminGroupItem")]
    pub fn market_trade_mode_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MarketplaceTradeModeAdminGroup(
                action_taker.clone().into(),
            ),
        )
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "MaxSupplyItem")]
    pub fn max_supply_item(supply: Option<BigIntString>) -> Result<Self, napi::Error> {
        Ok(TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MaxSupply(supply.map(|s| s.try_to_u64()).transpose()?),
        ))
    }

    #[napi(js_name = "MaxSupplyControlGroupItem")]
    pub fn max_supply_control_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::MaxSupplyControlGroup(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "MaxSupplyAdminGroupItem")]
    pub fn max_supply_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::MaxSupplyAdminGroup(
            action_taker.clone().into(),
        ))
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "MintingAllowChoosingDestinationItem")]
    pub fn minting_allow_choosing_destination_item(flag: bool) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MintingAllowChoosingDestination(flag),
        )
    }

    #[napi(js_name = "MintingAllowChoosingDestinationControlGroupItem")]
    pub fn minting_allow_choosing_destination_control_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationControlGroup(
                action_taker.clone().into(),
            ),
        )
    }

    #[napi(js_name = "MintingAllowChoosingDestinationAdminGroupItem")]
    pub fn minting_allow_choosing_destination_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::MintingAllowChoosingDestinationAdminGroup(
                action_taker.clone().into(),
            ),
        )
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "NewTokensDestinationIdentityItem")]
    pub fn new_tokens_destination_identity_item(
        js_identity_id: Option<IdentifierLikeNAPI>,
    ) -> Result<TokenConfigurationChangeItemNAPI, napi::Error> {
        let identity_id: Option<Identifier> = js_identity_id
            .map(|id| IdentifierNAPI::try_from(id))
            .transpose()?
            .map(Into::into);

        Ok(TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::NewTokensDestinationIdentity(identity_id),
        ))
    }

    #[napi(js_name = "NewTokensDestinationIdentityControlGroupItem")]
    pub fn new_tokens_destination_identity_control_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::NewTokensDestinationIdentityControlGroup(
                action_taker.clone().into(),
            ),
        )
    }

    #[napi(js_name = "NewTokensDestinationIdentityAdminGroupItem")]
    pub fn new_tokens_destination_identity_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::NewTokensDestinationIdentityAdminGroup(
                action_taker.clone().into(),
            ),
        )
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "noChangeItem")]
    pub fn no_changes_item() -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::TokenConfigurationNoChange)
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "PerpetualDistributionConfigurationItem")]
    pub fn perpetual_distribution_item(
        js_perpetual_distribution_value: Option<&TokenPerpetualDistributionNAPI>,
    ) -> Self {
        let perpetual_distribution_value: Option<TokenPerpetualDistribution> =
            js_perpetual_distribution_value.map(|v| v.clone().into());

        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::PerpetualDistribution(
            perpetual_distribution_value,
        ))
    }

    #[napi(js_name = "PerpetualDistributionControlGroupItem")]
    pub fn perpetual_distribution_control_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::PerpetualDistributionControlGroup(
                action_taker.clone().into(),
            ),
        )
    }

    #[napi(js_name = "PerpetualDistributionAdminGroupItem")]
    pub fn perpetual_distribution_admin_group_item(
        action_taker: &AuthorizedActionTakersNAPI,
    ) -> Self {
        TokenConfigurationChangeItemNAPI(
            TokenConfigurationChangeItem::PerpetualDistributionAdminGroup(
                action_taker.clone().into(),
            ),
        )
    }
}

#[napi]
impl TokenConfigurationChangeItemNAPI {
    #[napi(js_name = "UnfreezeItem")]
    pub fn unfreeze_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::Unfreeze(
            action_taker.clone().into(),
        ))
    }

    #[napi(js_name = "UnfreezeAdminGroupItem")]
    pub fn unfreeze_admin_group_item(action_taker: &AuthorizedActionTakersNAPI) -> Self {
        TokenConfigurationChangeItemNAPI(TokenConfigurationChangeItem::UnfreezeAdminGroup(
            action_taker.clone().into(),
        ))
    }
}
