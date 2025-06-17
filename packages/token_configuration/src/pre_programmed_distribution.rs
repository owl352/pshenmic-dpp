use dpp::balances::credits::TokenAmount;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::TokenPreProgrammedDistribution;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::accessors::v0::TokenPreProgrammedDistributionV0Methods;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::v0::TokenPreProgrammedDistributionV0;
use dpp::prelude::{Identifier, TimestampMillis};
use js_sys::{Object, Reflect};
use pshenmic_dpp_identifier::IdentifierWASM;
use std::collections::BTreeMap;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[derive(Clone, PartialEq, Debug)]
#[wasm_bindgen(js_name = "TokenPreProgrammedDistributionWASM")]
pub struct TokenPreProgrammedDistributionWASM(TokenPreProgrammedDistribution);

impl From<TokenPreProgrammedDistributionWASM> for TokenPreProgrammedDistribution {
    fn from(value: TokenPreProgrammedDistributionWASM) -> Self {
        value.0
    }
}

impl From<TokenPreProgrammedDistribution> for TokenPreProgrammedDistributionWASM {
    fn from(value: TokenPreProgrammedDistribution) -> Self {
        TokenPreProgrammedDistributionWASM(value)
    }
}

pub fn js_distributions_to_distributions(
    js_distributions: &JsValue,
) -> Result<BTreeMap<TimestampMillis, BTreeMap<Identifier, TokenAmount>>, JsValue> {
    let distributions_object = Object::from(js_distributions.clone());
    let distributions_keys = Object::keys(&distributions_object);

    let mut distributions = BTreeMap::new();

    for key in distributions_keys.iter() {
        let timestamp = match key.as_string() { 
            None => Err(JsValue::from("Cannot read timestamp in distribution rules")),
            Some(timestamp) => Ok(timestamp.parse::<TimestampMillis>().map_err(JsError::from)?),
        }?;

        let identifiers_object = Object::from(Reflect::get(&distributions_object, &key)?.clone());
        let identifiers_keys = Object::keys(&identifiers_object);

        let mut ids = BTreeMap::new();

        for id_key in identifiers_keys.iter() {
            let identifier = Identifier::from(IdentifierWASM::try_from(id_key.clone())?);

            let token_amount = Reflect::get(&identifiers_keys, &id_key.clone())?
                .as_f64()
                .unwrap_or(0f64) as TokenAmount;

            ids.insert(identifier, token_amount);
        }

        distributions.insert(timestamp, ids);
    }

    Ok(distributions)
}

#[wasm_bindgen]
impl TokenPreProgrammedDistributionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenPreProgrammedDistributionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(js_distributions: &JsValue) -> Result<TokenPreProgrammedDistributionWASM, JsValue> {
        let distributions = js_distributions_to_distributions(js_distributions)?;

        Ok(TokenPreProgrammedDistributionWASM(
            TokenPreProgrammedDistribution::V0(TokenPreProgrammedDistributionV0 { distributions }),
        ))
    }

    #[wasm_bindgen(getter = "distributions")]
    pub fn get_distributions(&self) -> Result<JsValue, JsError> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0
            .distributions()
            .iter()
            .map(|(k, v)| {
                let identifiers: BTreeMap<String, TokenAmount> = v
                    .iter()
                    .map(|(identifier, v)| (IdentifierWASM::from(identifier.clone()).get_base58(), v.clone()))
                    .collect();

                (k.clone().to_string(), identifiers.clone())
            })
            .collect::<BTreeMap<String, BTreeMap<String, TokenAmount>>>()
            .serialize(&serializer)
            .map_err(JsError::from)
    }

    #[wasm_bindgen(setter = "distributions")]
    pub fn set_distributions(&mut self, js_distributions: &JsValue) -> Result<(), JsValue> {
        let distributions = js_distributions_to_distributions(js_distributions)?;

        self.0.set_distributions(distributions);

        Ok(())
    }
}
