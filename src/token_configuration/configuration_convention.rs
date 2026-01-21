use dpp::data_contract::associated_token::token_configuration_convention::TokenConfigurationConvention;
use dpp::data_contract::associated_token::token_configuration_convention::accessors::v0::{
    TokenConfigurationConventionV0Getters, TokenConfigurationConventionV0Setters,
};
use dpp::data_contract::associated_token::token_configuration_convention::v0::TokenConfigurationConventionV0;
use dpp::data_contract::associated_token::token_configuration_localization::TokenConfigurationLocalization;
use napi::Either;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::token_configuration::localization::{
    TokenConfigurationLocalizationJsonNAPI, TokenConfigurationLocalizationNAPI,
};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenConfigurationConventionNAPI")]
pub struct TokenConfigurationConventionNAPI(TokenConfigurationConvention);

impl From<TokenConfigurationConvention> for TokenConfigurationConventionNAPI {
    fn from(convention: TokenConfigurationConvention) -> Self {
        TokenConfigurationConventionNAPI(convention)
    }
}

impl From<TokenConfigurationConventionNAPI> for TokenConfigurationConvention {
    fn from(convention: TokenConfigurationConventionNAPI) -> Self {
        convention.0
    }
}

#[napi]
impl TokenConfigurationConventionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_localizations: Vec<(
            String,
            Either<&TokenConfigurationLocalizationNAPI, TokenConfigurationLocalizationJsonNAPI>,
        )>,
        decimals: u8,
    ) -> Result<TokenConfigurationConventionNAPI, napi::Error> {
        let localizations: BTreeMap<String, TokenConfigurationLocalization> = js_localizations
            .into_iter()
            .map(|(key, value)| match value {
                Either::A(localization) => (
                    key,
                    TokenConfigurationLocalization::from(localization.clone()),
                ),
                Either::B(localization) => {
                    (key, TokenConfigurationLocalization::from(localization))
                }
            })
            .collect();

        Ok(TokenConfigurationConventionNAPI(
            TokenConfigurationConvention::V0(TokenConfigurationConventionV0 {
                localizations,
                decimals,
            }),
        ))
    }

    #[napi(getter, js_name = "decimals")]
    pub fn decimals(&self) -> u8 {
        self.0.decimals()
    }

    #[napi(getter, js_name = "localizations")]
    pub fn localizations(&self) -> Vec<(String, TokenConfigurationLocalizationNAPI)> {
        self.0
            .localizations()
            .iter()
            .map(|(key, val)| {
                (
                    key.clone(),
                    TokenConfigurationLocalizationNAPI::from(val.clone()),
                )
            })
            .collect()
    }

    #[napi(setter, js_name = "decimals")]
    pub fn set_decimals(&mut self, decimals: u8) {
        self.0.set_decimals(decimals)
    }

    #[napi(setter, js_name = "localizations")]
    pub fn set_localizations(
        &mut self,
        js_localizations: Vec<(
            String,
            Either<&TokenConfigurationLocalizationNAPI, TokenConfigurationLocalizationJsonNAPI>,
        )>,
    ) -> Result<(), napi::Error> {
        let localizations = js_localizations
            .into_iter()
            .map(|(key, value)| match value {
                Either::A(localization) => (
                    key,
                    TokenConfigurationLocalization::from(localization.clone()),
                ),
                Either::B(localization) => {
                    (key, TokenConfigurationLocalization::from(localization))
                }
            })
            .collect();

        Ok(self.0.set_localizations(localizations))
    }
}
