use dpp::data_contract::associated_token::token_distribution_rules::TokenDistributionRules;
use dpp::data_contract::associated_token::token_distribution_rules::accessors::v0::{
    TokenDistributionRulesV0Getters, TokenDistributionRulesV0Setters,
};
use dpp::data_contract::associated_token::token_distribution_rules::v0::TokenDistributionRulesV0;
use dpp::data_contract::associated_token::token_perpetual_distribution::TokenPerpetualDistribution;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::TokenPreProgrammedDistribution;
use dpp::prelude::Identifier;
use napi_derive::napi;

use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;
use crate::token_configuration::change_control_rules::ChangeControlRulesNAPI;
use crate::token_configuration::perpetual_distribution::TokenPerpetualDistributionNAPI;
use crate::token_configuration::pre_programmed_distribution::TokenPreProgrammedDistributionNAPI;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "TokenDistributionRulesNAPI")]
pub struct TokenDistributionRulesNAPI(TokenDistributionRules);

impl From<TokenDistributionRulesNAPI> for TokenDistributionRules {
    fn from(rules: TokenDistributionRulesNAPI) -> Self {
        rules.0
    }
}

impl From<TokenDistributionRules> for TokenDistributionRulesNAPI {
    fn from(rules: TokenDistributionRules) -> Self {
        Self(rules)
    }
}

#[napi]
impl TokenDistributionRulesNAPI {
    #[napi(constructor)]
    pub fn new(
        js_perpetual_distribution: Option<&TokenPerpetualDistributionNAPI>,
        perpetual_distribution_rules: &ChangeControlRulesNAPI,
        js_pre_programmed_distribution: Option<&TokenPreProgrammedDistributionNAPI>,
        js_new_tokens_destination_identity: Option<IdentifierLikeNAPI>,
        new_tokens_destination_identity_rules: &ChangeControlRulesNAPI,
        minting_allow_choosing_destination: bool,
        minting_allow_choosing_destination_rules: &ChangeControlRulesNAPI,
        change_direct_purchase_pricing_rules: &ChangeControlRulesNAPI,
    ) -> Result<TokenDistributionRulesNAPI, napi::Error> {
        let perpetual_distribution: Option<TokenPerpetualDistribution> =
            js_perpetual_distribution.map(|val| val.clone().into());

        let pre_programmed_distribution: Option<TokenPreProgrammedDistribution> =
            js_pre_programmed_distribution.map(|val| val.clone().into());

        let new_tokens_destination_identity: Option<Identifier> =
            js_new_tokens_destination_identity
                .map(|destination| IdentifierNAPI::try_from(destination.clone()))
                .transpose()?
                .map(Into::into);

        Ok(TokenDistributionRulesNAPI(TokenDistributionRules::V0(
            TokenDistributionRulesV0 {
                perpetual_distribution,
                perpetual_distribution_rules: perpetual_distribution_rules.clone().into(),
                pre_programmed_distribution,
                new_tokens_destination_identity,
                new_tokens_destination_identity_rules: new_tokens_destination_identity_rules
                    .clone()
                    .into(),
                minting_allow_choosing_destination,
                minting_allow_choosing_destination_rules: minting_allow_choosing_destination_rules
                    .clone()
                    .into(),
                change_direct_purchase_pricing_rules: change_direct_purchase_pricing_rules
                    .clone()
                    .into(),
            },
        )))
    }

    #[napi(getter, js_name = "perpetualDistribution")]
    pub fn get_perpetual_distribution(&self) -> Option<TokenPerpetualDistributionNAPI> {
        self.0.perpetual_distribution().map(|pd| pd.clone().into())
    }

    #[napi(getter, js_name = "perpetualDistributionRules")]
    pub fn get_perpetual_distribution_rules(&self) -> ChangeControlRulesNAPI {
        self.0.perpetual_distribution_rules().clone().into()
    }

    #[napi(getter, js_name = "preProgrammedDistribution")]
    pub fn get_pre_programmed_distribution(&self) -> Option<TokenPreProgrammedDistributionNAPI> {
        self.0
            .pre_programmed_distribution()
            .map(|ppd| ppd.clone().into())
    }

    #[napi(getter, js_name = "newTokenDestinationIdentity")]
    pub fn get_new_tokens_destination_identity(&self) -> Option<IdentifierNAPI> {
        self.0
            .new_tokens_destination_identity()
            .map(|id| id.clone().into())
    }

    #[napi(getter, js_name = "newTokenDestinationIdentityRules")]
    pub fn get_new_tokens_destination_identity_rules(&self) -> ChangeControlRulesNAPI {
        self.0
            .new_tokens_destination_identity_rules()
            .clone()
            .into()
    }

    #[napi(getter, js_name = "mintingAllowChoosingDestination")]
    pub fn get_minting_allow_choosing_destination(&self) -> bool {
        self.0.minting_allow_choosing_destination()
    }

    #[napi(getter, js_name = "mintingAllowChoosingDestinationRules")]
    pub fn get_minting_allow_choosing_destination_rules(&self) -> ChangeControlRulesNAPI {
        self.0
            .minting_allow_choosing_destination_rules()
            .clone()
            .into()
    }

    #[napi(getter, js_name = "changeDirectPurchasePricingRules")]
    pub fn get_change_direct_purchase_pricing_rules(&self) -> ChangeControlRulesNAPI {
        self.0.change_direct_purchase_pricing_rules().clone().into()
    }

    #[napi(setter, js_name = "perpetualDistribution")]
    pub fn set_perpetual_distribution(
        &mut self,
        js_perpetual_distribution: Option<&TokenPerpetualDistributionNAPI>,
    ) {
        let perpetual_distribution = js_perpetual_distribution.map(|pd| pd.clone().into());

        self.0.set_perpetual_distribution(perpetual_distribution)
    }

    #[napi(setter, js_name = "perpetualDistributionRules")]
    pub fn set_perpetual_distribution_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0
            .set_perpetual_distribution_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "preProgrammedDistribution")]
    pub fn set_pre_programmed_distribution(
        &mut self,
        js_distribution: Option<&TokenPreProgrammedDistributionNAPI>,
    ) {
        let distribution = js_distribution.map(|ppd| ppd.clone().into());

        self.0.set_pre_programmed_distribution(distribution)
    }

    #[napi(setter, js_name = "newTokenDestinationIdentity")]
    pub fn set_new_tokens_destination_identity(
        &mut self,
        js_identifier: Option<IdentifierLikeNAPI>,
    ) -> Result<(), napi::Error> {
        let identifier: Option<IdentifierNAPI> =
            js_identifier.map(|id| id.clone().try_into()).transpose()?;

        Ok(self
            .0
            .set_new_tokens_destination_identity(identifier.map(Into::into)))
    }

    #[napi(setter, js_name = "newTokenDestinationIdentityRules")]
    pub fn set_new_tokens_destination_identity_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0
            .set_new_tokens_destination_identity_rules(rules.clone().into());
    }

    #[napi(setter, js_name = "mintingAllowChoosingDestination")]
    pub fn set_minting_allow_choosing_destination(&mut self, flag: bool) {
        self.0.set_minting_allow_choosing_destination(flag);
    }

    #[napi(setter, js_name = "mintingAllowChoosingDestinationRules")]
    pub fn set_minting_allow_choosing_destination_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0
            .set_minting_allow_choosing_destination_rules(rules.clone().into());
    }

    #[napi(setter, js_name = "changeDirectPurchasePricingRules")]
    pub fn set_change_direct_purchase_pricing_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0
            .set_change_direct_purchase_pricing_rules(rules.clone().into());
    }
}
