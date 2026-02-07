use crate::{
    dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64},
    identifier::IdentifierNAPI,
    token_configuration::{
        authorized_action_taker::AuthorizedActionTakersNAPI,
        change_control_rules::ChangeControlRulesNAPI,
        configuration_convention::TokenConfigurationConventionNAPI,
        distribution_rules::TokenDistributionRulesNAPI,
        keep_history_rules::TokenKeepsHistoryRulesNAPI,
        marketplace_rules::TokenMarketplaceRulesNAPI,
    },
};
use dpp::{
    data_contract::{
        TokenConfiguration,
        associated_token::token_configuration::{
            accessors::v0::{TokenConfigurationV0Getters, TokenConfigurationV0Setters},
            v0::TokenConfigurationV0,
        },
    },
    tokens::calculate_token_id,
};
use napi_derive::napi;

pub mod action_taker;
pub mod authorized_action_taker;
pub mod change_control_rules;
pub mod configuration_convention;
pub mod distribution_function;
pub mod distribution_recipient;
pub mod distribution_rules;
pub mod distribution_structs;
pub mod group;
pub mod keep_history_rules;
pub mod localization;
pub mod marketplace_rules;
pub mod perpetual_distribution;
pub mod pre_programmed_distribution;
pub mod reward_distribution_type;
pub mod trade_mode;

#[derive(Clone, PartialEq, Debug)]
#[napi(js_name = "TokenConfigurationNAPI")]
pub struct TokenConfigurationNAPI(TokenConfiguration);

impl From<TokenConfiguration> for TokenConfigurationNAPI {
    fn from(configuration: TokenConfiguration) -> Self {
        Self(configuration)
    }
}

impl From<TokenConfigurationNAPI> for TokenConfiguration {
    fn from(configuration: TokenConfigurationNAPI) -> Self {
        configuration.0
    }
}

#[napi]
impl TokenConfigurationNAPI {
    #[napi(constructor)]
    pub fn new(
        conventions: &TokenConfigurationConventionNAPI,
        conventions_change_rules: &ChangeControlRulesNAPI,
        base_supply: BigIntString,
        max_supply: Option<BigIntString>,
        keeps_history: &TokenKeepsHistoryRulesNAPI,
        start_as_paused: bool,
        allow_transfer_to_frozen_balance: bool,
        max_supply_change_rules: &ChangeControlRulesNAPI,
        distribution_rules: &TokenDistributionRulesNAPI,
        marketplace_rules: &TokenMarketplaceRulesNAPI,
        manual_minting_rules: &ChangeControlRulesNAPI,
        manual_burning_rules: &ChangeControlRulesNAPI,
        freeze_rules: &ChangeControlRulesNAPI,
        unfreeze_rules: &ChangeControlRulesNAPI,
        destroy_frozen_funds_rules: &ChangeControlRulesNAPI,
        emergency_action_rules: &ChangeControlRulesNAPI,
        main_control_group: Option<u16>,
        main_control_group_can_be_modified: &AuthorizedActionTakersNAPI,
        description: Option<String>,
    ) -> Result<TokenConfigurationNAPI, napi::Error> {
        Ok(TokenConfigurationNAPI(TokenConfiguration::V0(
            TokenConfigurationV0 {
                conventions: conventions.clone().into(),
                conventions_change_rules: conventions_change_rules.clone().into(),
                base_supply: base_supply.try_to_u64()?,
                max_supply: max_supply.map(|val| val.try_to_u64()).transpose()?,
                keeps_history: keeps_history.clone().into(),
                start_as_paused,
                allow_transfer_to_frozen_balance,
                max_supply_change_rules: max_supply_change_rules.clone().into(),
                distribution_rules: distribution_rules.clone().into(),
                marketplace_rules: marketplace_rules.clone().into(),
                manual_minting_rules: manual_minting_rules.clone().into(),
                manual_burning_rules: manual_burning_rules.clone().into(),
                freeze_rules: freeze_rules.clone().into(),
                unfreeze_rules: unfreeze_rules.clone().into(),
                destroy_frozen_funds_rules: destroy_frozen_funds_rules.clone().into(),
                emergency_action_rules: emergency_action_rules.clone().into(),
                main_control_group,
                main_control_group_can_be_modified: main_control_group_can_be_modified
                    .clone()
                    .into(),
                description,
            },
        )))
    }

    #[napi(getter, js_name = "conventions")]
    pub fn get_conventions(&self) -> TokenConfigurationConventionNAPI {
        self.0.conventions().clone().into()
    }

    #[napi(getter, js_name = "conventionsChangeRules")]
    pub fn get_conventions_change_rules(&self) -> ChangeControlRulesNAPI {
        self.0.conventions_change_rules().clone().into()
    }

    #[napi(getter, js_name = "baseSupply")]
    pub fn get_base_supply(&self) -> BigIntString {
        BigIntString::from_u64(self.0.base_supply())
    }

    #[napi(getter, js_name = "keepsHistory")]
    pub fn get_keeps_history(&self) -> TokenKeepsHistoryRulesNAPI {
        self.0.keeps_history().clone().into()
    }

    #[napi(getter, js_name = "startAsPaused")]
    pub fn get_start_as_paused(&self) -> bool {
        self.0.start_as_paused()
    }

    #[napi(getter, js_name = "isAllowedTransferToFrozenBalance")]
    pub fn get_is_allowed_transfer_to_frozen_balance(&self) -> bool {
        self.0.is_allowed_transfer_to_frozen_balance()
    }

    #[napi(getter, js_name = "maxSupply")]
    pub fn get_max_supply(&self) -> Option<BigIntString> {
        self.0.max_supply().map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "maxSupplyChangeRules")]
    pub fn get_max_supply_change_rules(&self) -> ChangeControlRulesNAPI {
        self.0.max_supply_change_rules().clone().into()
    }

    #[napi(getter, js_name = "distributionRules")]
    pub fn get_distribution_rules(&self) -> TokenDistributionRulesNAPI {
        self.0.distribution_rules().clone().into()
    }

    #[napi(getter, js_name = "marketplaceRules")]
    pub fn get_marketplace_rules(&self) -> TokenMarketplaceRulesNAPI {
        match self.0.clone() {
            TokenConfiguration::V0(v0) => v0.marketplace_rules.clone().into(),
        }
    }

    #[napi(getter, js_name = "manualMintingRules")]
    pub fn get_manual_minting_rules(&self) -> ChangeControlRulesNAPI {
        self.0.manual_minting_rules().clone().into()
    }

    #[napi(getter, js_name = "manualBurningRules")]
    pub fn get_manual_burning_rules(&self) -> ChangeControlRulesNAPI {
        self.0.manual_burning_rules().clone().into()
    }

    #[napi(getter, js_name = "freezeRules")]
    pub fn get_freeze_rules(&self) -> ChangeControlRulesNAPI {
        self.0.freeze_rules().clone().into()
    }

    #[napi(getter, js_name = "unfreezeRules")]
    pub fn get_unfreeze_rules(&self) -> ChangeControlRulesNAPI {
        self.0.unfreeze_rules().clone().into()
    }

    #[napi(getter, js_name = "destroyFrozenFundsRules")]
    pub fn get_destroy_frozen_funds_rules(&self) -> ChangeControlRulesNAPI {
        self.0.destroy_frozen_funds_rules().clone().into()
    }

    #[napi(getter, js_name = "emergencyActionRules")]
    pub fn get_emergency_action_rules(&self) -> ChangeControlRulesNAPI {
        self.0.emergency_action_rules().clone().into()
    }

    #[napi(getter, js_name = "mainControlGroup")]
    pub fn get_main_control_group(&self) -> Option<u16> {
        self.0.main_control_group()
    }

    #[napi(getter, js_name = "mainControlGroupCanBeModified")]
    pub fn get_main_control_group_can_be_modified(&self) -> AuthorizedActionTakersNAPI {
        self.0.main_control_group_can_be_modified().clone().into()
    }

    #[napi(getter, js_name = "description")]
    pub fn get_description(&self) -> Option<String> {
        self.0.description().clone()
    }

    #[napi(setter, js_name = "conventions")]
    pub fn set_conventions(&mut self, conventions: &TokenConfigurationConventionNAPI) {
        self.0.set_conventions(conventions.clone().into())
    }

    #[napi(setter, js_name = "conventionsChangeRules")]
    pub fn set_conventions_change_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_conventions_change_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "baseSupply")]
    pub fn set_base_supply(&mut self, base_supply: BigIntString) -> Result<(), napi::Error> {
        self.0.set_base_supply(base_supply.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "keepsHistory")]
    pub fn set_keeps_history(&mut self, keeps_history: &TokenKeepsHistoryRulesNAPI) {
        self.0 = match self.0.clone() {
            TokenConfiguration::V0(mut v0) => {
                v0.keeps_history = keeps_history.clone().into();

                TokenConfiguration::V0(v0)
            }
        };
    }

    #[napi(setter, js_name = "startAsPaused")]
    pub fn set_start_as_paused(&mut self, start_as_paused: bool) {
        self.0.set_start_as_paused(start_as_paused)
    }

    #[napi(setter, js_name = "isAllowedTransferToFrozenBalance")]
    pub fn set_is_allowed_transfer_to_frozen_balance(
        &mut self,
        is_allowed_transfer_to_frozen_balance: bool,
    ) {
        self.0
            .allow_transfer_to_frozen_balance(is_allowed_transfer_to_frozen_balance);
    }

    #[napi(setter, js_name = "maxSupply")]
    pub fn set_max_supply(&mut self, max_supply: Option<BigIntString>) -> Result<(), napi::Error> {
        self.0
            .set_max_supply(max_supply.map(|v| v.try_to_u64()).transpose()?);
        Ok(())
    }

    #[napi(setter, js_name = "maxSupplyChangeRules")]
    pub fn set_max_supply_change_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_max_supply_change_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "distributionRules")]
    pub fn set_distribution_rules(&mut self, rules: &TokenDistributionRulesNAPI) {
        self.0.set_distribution_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "marketplaceRules")]
    pub fn set_marketplace_rules(&mut self, marketplace_rules: &TokenMarketplaceRulesNAPI) {
        self.0 = match self.0.clone() {
            TokenConfiguration::V0(mut v0) => {
                v0.marketplace_rules = marketplace_rules.clone().into();

                TokenConfiguration::V0(v0)
            }
        }
    }

    #[napi(setter, js_name = "manualMintingRules")]
    pub fn set_manual_minting_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_manual_minting_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "manualBurningRules")]
    pub fn set_manual_burning_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_manual_burning_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "freezeRules")]
    pub fn set_freeze_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_freeze_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "unfreezeRules")]
    pub fn set_unfreeze_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_unfreeze_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "destroyFrozenFundsRules")]
    pub fn set_destroy_frozen_funds_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_destroy_frozen_funds_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "emergencyActionRules")]
    pub fn set_emergency_action_rules(&mut self, rules: &ChangeControlRulesNAPI) {
        self.0.set_emergency_action_rules(rules.clone().into())
    }

    #[napi(setter, js_name = "mainControlGroup")]
    pub fn set_main_control_group(&mut self, group: Option<u16>) {
        self.0.set_main_control_group(group)
    }

    #[napi(setter, js_name = "mainControlGroupCanBeModified")]
    pub fn set_main_control_group_can_be_modified(
        &mut self,
        authorized_action_taker: &AuthorizedActionTakersNAPI,
    ) {
        self.0
            .set_main_control_group_can_be_modified(authorized_action_taker.clone().into())
    }

    #[napi(setter, js_name = "description")]
    pub fn set_description(&mut self, description: Option<String>) {
        self.0.set_description(description)
    }

    #[napi(js_name = "calculateTokenId")]
    pub fn calculate_token_id(
        js_contract_id: IdentifierLikeNAPI,
        token_pos: u16,
    ) -> Result<IdentifierNAPI, napi::Error> {
        let contract_id = IdentifierNAPI::try_from(js_contract_id)?;

        Ok(IdentifierNAPI::from(calculate_token_id(
            &contract_id.to_slice(),
            token_pos,
        )))
    }
}
