use dpp::data_contract::associated_token::token_keeps_history_rules::TokenKeepsHistoryRules;
use dpp::data_contract::associated_token::token_keeps_history_rules::accessors::v0::{
    TokenKeepsHistoryRulesV0Getters, TokenKeepsHistoryRulesV0Setters,
};
use dpp::data_contract::associated_token::token_keeps_history_rules::v0::TokenKeepsHistoryRulesV0;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "TokenKeepsHistoryRulesNAPI")]
pub struct TokenKeepsHistoryRulesNAPI(TokenKeepsHistoryRules);

impl From<TokenKeepsHistoryRulesNAPI> for TokenKeepsHistoryRules {
    fn from(rules: TokenKeepsHistoryRulesNAPI) -> Self {
        rules.0
    }
}

impl From<TokenKeepsHistoryRules> for TokenKeepsHistoryRulesNAPI {
    fn from(rules: TokenKeepsHistoryRules) -> Self {
        Self(rules)
    }
}

#[napi]
impl TokenKeepsHistoryRulesNAPI {
    #[napi(constructor)]
    pub fn new(
        keeps_transfer_history: bool,
        keeps_freezing_history: bool,
        keeps_minting_history: bool,
        keeps_burning_history: bool,
        keeps_direct_pricing_history: bool,
        keeps_direct_purchase_history: bool,
    ) -> TokenKeepsHistoryRulesNAPI {
        TokenKeepsHistoryRulesNAPI(TokenKeepsHistoryRules::V0(TokenKeepsHistoryRulesV0 {
            keeps_transfer_history,
            keeps_freezing_history,
            keeps_minting_history,
            keeps_burning_history,
            keeps_direct_pricing_history,
            keeps_direct_purchase_history,
        }))
    }

    #[napi(getter, js_name = "keepsTransferHistory")]
    pub fn get_keeps_transfer_history(&self) -> bool {
        self.0.keeps_transfer_history()
    }

    #[napi(getter, js_name = "keepsFreezingHistory")]
    pub fn get_keeps_freezing_history(&self) -> bool {
        self.0.keeps_freezing_history()
    }

    #[napi(getter, js_name = "keepsMintingHistory")]
    pub fn get_keeps_minting_history(&self) -> bool {
        self.0.keeps_minting_history()
    }

    #[napi(getter, js_name = "keepsBurningHistory")]
    pub fn get_keeps_burning_history(&self) -> bool {
        self.0.keeps_burning_history()
    }

    #[napi(getter, js_name = "keepsDirectPricingHistory")]
    pub fn get_keeps_direct_pricing_history(&self) -> bool {
        self.0.keeps_direct_pricing_history()
    }

    #[napi(getter, js_name = "keepsDirectPurchaseHistory")]
    pub fn get_keeps_direct_purchase_history(&self) -> bool {
        self.0.keeps_direct_purchase_history()
    }

    #[napi(setter, js_name = "keepsTransferHistory")]
    pub fn set_keeps_transfer_history(&mut self, keeps_transfer_history: bool) {
        self.0.set_keeps_transfer_history(keeps_transfer_history);
    }

    #[napi(setter, js_name = "keepsFreezingHistory")]
    pub fn set_keeps_freezing_history(&mut self, keeps_freezing_history: bool) {
        self.0.set_keeps_freezing_history(keeps_freezing_history);
    }

    #[napi(setter, js_name = "keepsMintingHistory")]
    pub fn set_keeps_minting_history(&mut self, keeps_minting_history: bool) {
        self.0.set_keeps_minting_history(keeps_minting_history);
    }

    #[napi(setter, js_name = "keepsBurningHistory")]
    pub fn set_keeps_burning_history(&mut self, keeps_burning_history: bool) {
        self.0.set_keeps_burning_history(keeps_burning_history);
    }

    #[napi(setter, js_name = "keepsDirectPricingHistory")]
    pub fn set_keeps_direct_pricing_history(&mut self, keeps_direct_pricing_history: bool) {
        self.0
            .set_keeps_direct_pricing_history(keeps_direct_pricing_history);
    }

    #[napi(setter, js_name = "keepsDirectPurchaseHistory")]
    pub fn set_keeps_direct_purchase_history(&mut self, keeps_direct_purchase_history: bool) {
        self.0
            .set_keeps_direct_purchase_history(keeps_direct_purchase_history);
    }
}
