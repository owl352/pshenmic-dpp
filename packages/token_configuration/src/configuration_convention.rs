use crate::localization::TokenConfigurationLocalizationWASM;
use dpp::data_contract::associated_token::token_configuration_convention::TokenConfigurationConvention;
use dpp::data_contract::associated_token::token_configuration_convention::accessors::v0::{
    TokenConfigurationConventionV0Getters, TokenConfigurationConventionV0Setters,
};
use dpp::data_contract::associated_token::token_configuration_convention::v0::TokenConfigurationConventionV0;
use dpp::data_contract::associated_token::token_configuration_localization::TokenConfigurationLocalization;
use dpp::data_contract::associated_token::token_configuration_localization::v0::TokenConfigurationLocalizationV0;
use dpp::platform_value::{Error, Value};
use js_sys::{Object, Reflect};
use pshenmic_dpp_utils::ToSerdeJSONExt;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = "TokenConfigurationConventionWASM")]
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

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
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
        let object = Object::new();

        for (key, value) in &self.0.localizations().clone() {
            Reflect::set(
                &object,
                &JsValue::from(key.clone()),
                &TokenConfigurationLocalizationWASM::from(value.clone()).into(),
            )?;
        }

        Ok(object.into())
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
            let json_should_capitalize = value
                .get_value("shouldCapitalize")
                .map_err(|e| JsValue::from(e.to_string()))?;
            let json_singular_form = value
                .get_value("singularForm")
                .map_err(|e| JsValue::from(e.to_string()))?;
            let json_plural_form = value
                .get_value("pluralForm")
                .map_err(|e| JsValue::from(e.to_string()))?;

            let should_capitalize = match json_should_capitalize.as_bool() {
                None => Err(JsValue::from("shouldCapitalize must be a boolean")),
                Some(should_capitalize) => Ok(should_capitalize),
            }?;
            let singular_form = match json_singular_form.as_str() {
                None => Err(JsValue::from("singularForm must be a string")),
                Some(singular_form) => Ok(singular_form.to_string()),
            }?;
            let plural_form = match json_plural_form.as_str() {
                None => Err(JsValue::from("pluralForm must be a string")),
                Some(plural_form) => Ok(plural_form.to_string()),
            }?;

            Ok((
                key.clone(),
                TokenConfigurationLocalization::V0(TokenConfigurationLocalizationV0 {
                    should_capitalize,
                    singular_form,
                    plural_form,
                }),
            ))
        })
        .collect::<Result<BTreeMap<String, TokenConfigurationLocalization>, JsValue>>()?;

    Ok(localizations)
}
