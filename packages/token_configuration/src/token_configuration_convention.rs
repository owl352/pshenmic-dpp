use crate::localization::TokenConfigurationLocalizationWASM;
use dpp::ProtocolError;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::associated_token::token_configuration_convention::TokenConfigurationConvention;
use dpp::data_contract::associated_token::token_configuration_convention::accessors::v0::{
    TokenConfigurationConventionV0Getters, TokenConfigurationConventionV0Setters,
};
use dpp::data_contract::associated_token::token_configuration_convention::v0::TokenConfigurationConventionV0;
use dpp::data_contract::associated_token::token_configuration_localization::TokenConfigurationLocalization;
use dpp::data_contract::associated_token::token_configuration_localization::v0::TokenConfigurationLocalizationV0;
use dpp::platform_value::Value;
use dpp::platform_value::converter::serde_json::BTreeValueJsonConverter;
use pshenmic_dpp_utils::{ToSerdeJSONExt, WithJsError};
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = TokenConfigurationConventionWASM)]
pub struct TokenConfigurationConventionWASM(TokenConfigurationConvention);

impl From<TokenConfigurationConvention> for TokenConfigurationConventionWASM {
    fn from(convention: TokenConfigurationConvention) -> Self {
        TokenConfigurationConventionWASM(convention)
    }
}

impl From<TokenConfigurationConventionWASM> for TokenConfigurationConvention {
    fn from(convention: TokenConfigurationConventionWASM) -> Self {
        convention.0
    }
}

#[wasm_bindgen]
impl TokenConfigurationConventionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenConfigurationConventionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        js_localizations: &JsValue,
        decimals: u8,
    ) -> Result<TokenConfigurationConventionWASM, JsValue> {
        let localizations: BTreeMap<String, TokenConfigurationLocalization> =
            js_value_to_localizations(js_localizations)?;

        Ok(TokenConfigurationConventionWASM(
            TokenConfigurationConvention::V0(TokenConfigurationConventionV0 {
                localizations,
                decimals,
            }),
        ))
    }

    #[wasm_bindgen(getter = "decimals")]
    pub fn decimals(&self) -> u8 {
        self.0.decimals()
    }

    #[wasm_bindgen(getter = "localizations")]
    pub fn localizations(&self) -> Result<JsValue, JsValue> {
        let json_value = self
            .0
            .localizations()
            .iter()
            .map(|(key, value)| {
                (
                    key.clone(),
                    JsValue::from(TokenConfigurationLocalizationWASM::from(value.clone()))
                        .with_serde_to_platform_value()
                        .unwrap(),
                )
            })
            .collect::<BTreeMap<String, Value>>()
            .to_json_value()
            .map_err(ProtocolError::ValueError)
            .with_js_error()?;

        let js_value = json_value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())?;

        Ok(js_value)
    }

    #[wasm_bindgen(setter = "decimals")]
    pub fn set_decimals(&mut self, decimals: u8) {
        self.0.set_decimals(decimals)
    }

    #[wasm_bindgen(setter = "localizations")]
    pub fn set_localizations(&mut self, js_localizations: &JsValue) -> Result<(), JsValue> {
        let localizations: BTreeMap<String, TokenConfigurationLocalization> =
            js_value_to_localizations(js_localizations)?;

        Ok(self.0.set_localizations(localizations))
    }
}

fn js_value_to_localizations(
    js_localizations: &JsValue,
) -> Result<BTreeMap<String, TokenConfigurationLocalization>, JsValue> {
    let localizations: BTreeMap<String, TokenConfigurationLocalization> = js_localizations
        .clone()
        .with_serde_to_platform_value_map()?
        .iter()
        .map(|(key, value)| {
            (
                key.clone(),
                TokenConfigurationLocalization::V0(TokenConfigurationLocalizationV0 {
                    should_capitalize: value
                        .get_value("shouldCapitalize")
                        .unwrap()
                        .as_bool()
                        .unwrap(),
                    singular_form: value
                        .get_value("singularForm")
                        .unwrap()
                        .as_str()
                        .unwrap()
                        .to_string(),
                    plural_form: value
                        .get_value("pluralForm")
                        .unwrap()
                        .as_str()
                        .unwrap()
                        .to_string(),
                }),
            )
        })
        .collect();

    Ok(localizations)
}
