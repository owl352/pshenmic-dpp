use dpp::balances::credits::TokenAmount;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::TokenPreProgrammedDistribution;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::accessors::v0::TokenPreProgrammedDistributionV0Methods;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::v0::TokenPreProgrammedDistributionV0;
use dpp::prelude::{Identifier, TimestampMillis};
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;

#[derive(Clone, PartialEq, Debug)]
#[napi(js_name = "TokenPreProgrammedDistributionNAPI")]
pub struct TokenPreProgrammedDistributionNAPI(TokenPreProgrammedDistribution);

impl From<TokenPreProgrammedDistributionNAPI> for TokenPreProgrammedDistribution {
    fn from(value: TokenPreProgrammedDistributionNAPI) -> Self {
        value.0
    }
}

impl From<TokenPreProgrammedDistribution> for TokenPreProgrammedDistributionNAPI {
    fn from(value: TokenPreProgrammedDistribution) -> Self {
        TokenPreProgrammedDistributionNAPI(value)
    }
}

#[napi]
impl TokenPreProgrammedDistributionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_distributions: Vec<(BigIntString, Vec<(IdentifierLikeNAPI, BigIntString)>)>,
    ) -> Result<TokenPreProgrammedDistributionNAPI, napi::Error> {
        let mut distributions: BTreeMap<TimestampMillis, BTreeMap<Identifier, TokenAmount>> =
            BTreeMap::new();

        for (js_timestamp, js_inner_list) in js_distributions {
            let timestamp = js_timestamp.try_to_u64()?;

            let inner_map = distributions.entry(timestamp).or_default();

            for (js_identifier, js_token_amount) in js_inner_list {
                let identifier: Identifier = IdentifierNAPI::try_from(js_identifier)?.into();
                let token_amount = js_token_amount.try_to_u64()?;

                inner_map.insert(identifier, token_amount);
            }
        }

        Ok(TokenPreProgrammedDistributionNAPI(
            TokenPreProgrammedDistribution::V0(TokenPreProgrammedDistributionV0 { distributions }),
        ))
    }

    #[napi(getter, js_name = "distributions")]
    pub fn get_distributions(&self) -> Vec<(BigIntString, Vec<(IdentifierNAPI, BigIntString)>)> {
        let mut result = Vec::new();

        for (timestamp, inner_map) in self.0.distributions().iter() {
            let mut js_inner_vec = Vec::new();

            for (identifier, token_amount) in inner_map {
                js_inner_vec.push((
                    identifier.clone().into(),
                    BigIntString::from_u64(*token_amount),
                ));
            }

            result.push((BigIntString::from_u64(*timestamp), js_inner_vec));
        }

        result
    }

    #[napi(setter, js_name = "distributions")]
    pub fn set_distributions(
        &mut self,
        js_distributions: Vec<(BigIntString, Vec<(IdentifierLikeNAPI, BigIntString)>)>,
    ) -> Result<(), napi::Error> {
        let mut distributions: BTreeMap<TimestampMillis, BTreeMap<Identifier, TokenAmount>> =
            BTreeMap::new();

        for (js_timestamp, js_inner_list) in js_distributions {
            let timestamp = js_timestamp.try_to_u64()?;

            let inner_map = distributions.entry(timestamp).or_default();

            for (js_identifier, js_token_amount) in js_inner_list {
                let identifier: Identifier = IdentifierNAPI::try_from(js_identifier)?.into();
                let token_amount = js_token_amount.try_to_u64()?;

                inner_map.insert(identifier, token_amount);
            }
        }

        self.0.set_distributions(distributions);

        Ok(())
    }
}
