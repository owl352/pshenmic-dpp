use dpp::data_contract::associated_token::token_marketplace_rules::TokenMarketplaceRules;
use dpp::data_contract::associated_token::token_marketplace_rules::accessors::v0::{
    TokenMarketplaceRulesV0Getters, TokenMarketplaceRulesV0Setters,
};
use dpp::data_contract::associated_token::token_marketplace_rules::v0::TokenMarketplaceRulesV0;
use napi_derive::napi;

use crate::token_configuration::change_control_rules::ChangeControlRulesNAPI;
use crate::token_configuration::trade_mode::TokenTradeModeNAPI;

#[derive(Clone, PartialEq, Debug)]
#[napi(js_name = "TokenMarketplaceRulesNAPI")]
pub struct TokenMarketplaceRulesNAPI(TokenMarketplaceRules);

impl From<TokenMarketplaceRules> for TokenMarketplaceRulesNAPI {
    fn from(rules: TokenMarketplaceRules) -> Self {
        TokenMarketplaceRulesNAPI(rules)
    }
}

impl From<TokenMarketplaceRulesNAPI> for TokenMarketplaceRules {
    fn from(rules: TokenMarketplaceRulesNAPI) -> Self {
        rules.0
    }
}

#[napi]
impl TokenMarketplaceRulesNAPI {
    #[napi(constructor)]
    pub fn new(
        trade_mode: &TokenTradeModeNAPI,
        trade_mode_change_rules: &ChangeControlRulesNAPI,
    ) -> TokenMarketplaceRulesNAPI {
        TokenMarketplaceRulesNAPI(TokenMarketplaceRules::V0({
            TokenMarketplaceRulesV0 {
                trade_mode: trade_mode.clone().into(),
                trade_mode_change_rules: trade_mode_change_rules.clone().into(),
            }
        }))
    }

    #[napi(getter, js_name = "tradeMode")]
    pub fn trade_mode(&self) -> TokenTradeModeNAPI {
        self.0.trade_mode().clone().into()
    }

    #[napi(getter, js_name = "tradeModeChangeRules")]
    pub fn trade_mode_change_rules(&self) -> ChangeControlRulesNAPI {
        self.0.trade_mode_change_rules().clone().into()
    }

    #[napi(setter, js_name = "tradeMode")]
    pub fn set_trade_mode(&mut self, trade_mode: &TokenTradeModeNAPI) {
        self.0.set_trade_mode(trade_mode.clone().into());
    }

    #[napi(setter, js_name = "tradeModeChangeRules")]
    pub fn set_trade_mode_change_rules(
        &mut self,
        trade_mode_change_rules: &ChangeControlRulesNAPI,
    ) {
        self.0
            .set_trade_mode_change_rules(trade_mode_change_rules.clone().into());
    }
}
