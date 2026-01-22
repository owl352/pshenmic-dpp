use dpp::data_contract::associated_token::token_configuration_localization::TokenConfigurationLocalization;
use dpp::data_contract::associated_token::token_configuration_localization::accessors::v0::{
    TokenConfigurationLocalizationV0Getters, TokenConfigurationLocalizationV0Setters,
};
use dpp::data_contract::associated_token::token_configuration_localization::v0::TokenConfigurationLocalizationV0;
use napi_derive::napi;

#[napi(object, js_name = "TokenConfigurationLocalizationJsonNAPI")]
pub struct TokenConfigurationLocalizationJsonNAPI {
    pub should_capitalize: bool,
    pub singular_form: String,
    pub plural_form: String,
}

impl From<TokenConfigurationLocalization> for TokenConfigurationLocalizationJsonNAPI {
    fn from(
        configuration: TokenConfigurationLocalization,
    ) -> TokenConfigurationLocalizationJsonNAPI {
        TokenConfigurationLocalizationJsonNAPI {
            should_capitalize: configuration.should_capitalize(),
            singular_form: configuration.singular_form().to_string(),
            plural_form: configuration.plural_form().to_string(),
        }
    }
}

impl From<TokenConfigurationLocalizationJsonNAPI> for TokenConfigurationLocalization {
    fn from(
        configuration: TokenConfigurationLocalizationJsonNAPI,
    ) -> TokenConfigurationLocalization {
        TokenConfigurationLocalization::V0(TokenConfigurationLocalizationV0 {
            should_capitalize: configuration.should_capitalize,
            singular_form: configuration.singular_form,
            plural_form: configuration.plural_form,
        })
    }
}

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = TokenConfigurationLocalizationNAPI)]
pub struct TokenConfigurationLocalizationNAPI(TokenConfigurationLocalization);

impl From<TokenConfigurationLocalization> for TokenConfigurationLocalizationNAPI {
    fn from(configuration: TokenConfigurationLocalization) -> TokenConfigurationLocalizationNAPI {
        TokenConfigurationLocalizationNAPI(configuration)
    }
}

impl From<TokenConfigurationLocalizationNAPI> for TokenConfigurationLocalization {
    fn from(configuration: TokenConfigurationLocalizationNAPI) -> TokenConfigurationLocalization {
        configuration.0
    }
}

#[napi]
impl TokenConfigurationLocalizationNAPI {
    #[napi(constructor)]
    pub fn new(
        should_capitalize: bool,
        singular_form: String,
        plural_form: String,
    ) -> TokenConfigurationLocalizationNAPI {
        TokenConfigurationLocalizationNAPI(TokenConfigurationLocalization::V0(
            TokenConfigurationLocalizationV0 {
                should_capitalize,
                singular_form,
                plural_form,
            },
        ))
    }

    #[napi(getter, js_name = "shouldCapitalize")]
    pub fn get_should_capitalize(&self) -> bool {
        self.0.should_capitalize()
    }

    #[napi(getter, js_name = "pluralForm")]
    pub fn get_plural_form(&self) -> String {
        self.0.plural_form().to_string()
    }

    #[napi(getter, js_name = "singularForm")]
    pub fn get_singular_form(&self) -> String {
        self.0.singular_form().to_string()
    }

    #[napi(setter, js_name = "shouldCapitalize")]
    pub fn set_should_capitalize(&mut self, capitalize: bool) {
        self.0.set_should_capitalize(capitalize);
    }

    #[napi(setter, js_name = "pluralForm")]
    pub fn set_plural_form(&mut self, plural_form: String) {
        self.0.set_plural_form(plural_form);
    }

    #[napi(setter, js_name = "singularForm")]
    pub fn set_singular_form(&mut self, singular_form: String) {
        self.0.set_singular_form(singular_form);
    }

    #[napi(js_name = "toJSON")]
    pub fn to_json(&self) -> TokenConfigurationLocalizationJsonNAPI {
        self.0.clone().into()
    }
}
