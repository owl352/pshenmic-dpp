use dpp::data_contract::associated_token::token_marketplace_rules::v0::TokenTradeMode;
use napi_derive::napi;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "TokenTradeModeNAPI")]
pub struct TokenTradeModeNAPI(TokenTradeMode);

impl From<TokenTradeMode> for TokenTradeModeNAPI {
    fn from(trade_mode: TokenTradeMode) -> Self {
        TokenTradeModeNAPI(trade_mode)
    }
}

impl From<TokenTradeModeNAPI> for TokenTradeMode {
    fn from(trade_mode: TokenTradeModeNAPI) -> Self {
        trade_mode.0
    }
}

#[napi]
impl TokenTradeModeNAPI {
    #[napi(js_name = "NotTradeable")]
    pub fn not_tradeable() -> TokenTradeModeNAPI {
        TokenTradeModeNAPI(TokenTradeMode::NotTradeable)
    }

    /// Holders may list the token and make offers for it. Admitted from protocol
    /// version 16: earlier versions refuse a contract or a configuration update
    /// that uses it.
    #[napi(js_name = "Tradeable")]
    pub fn tradeable() -> TokenTradeModeNAPI {
        TokenTradeModeNAPI(TokenTradeMode::Tradeable)
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> String {
        match self.0 {
            TokenTradeMode::NotTradeable => String::from("NotTradeable"),
            TokenTradeMode::Tradeable => String::from("Tradeable"),
        }
    }
}
