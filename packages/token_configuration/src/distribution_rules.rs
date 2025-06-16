use crate::change_control_rules::ChangeControlRulesWASM;
use crate::perpetual_distribution::TokenPerpetualDistributionWASM;
use crate::pre_programmed_distribution::TokenPreProgrammedDistributionWASM;
use dpp::data_contract::associated_token::token_distribution_rules::TokenDistributionRules;
use dpp::data_contract::associated_token::token_distribution_rules::v0::TokenDistributionRulesV0;
use dpp::data_contract::associated_token::token_perpetual_distribution::TokenPerpetualDistribution;
use dpp::data_contract::associated_token::token_pre_programmed_distribution::TokenPreProgrammedDistribution;
use dpp::prelude::Identifier;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::IntoWasm;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone, Debug, PartialEq)]
#[wasm_bindgen(js_name = "TokenDistributionRulesWASM")]
pub struct TokenDistributionRulesWASM(TokenDistributionRules);

impl From<TokenDistributionRulesWASM> for TokenDistributionRules {
    fn from(rules: TokenDistributionRulesWASM) -> Self {
        rules.0
    }
}

impl From<TokenDistributionRules> for TokenDistributionRulesWASM {
    fn from(rules: TokenDistributionRules) -> Self {
        Self(rules)
    }
}

#[wasm_bindgen]
impl TokenDistributionRulesWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        js_perpetual_distribution: &JsValue,
        perpetual_distribution_rules: &ChangeControlRulesWASM,
        js_pre_programmed_distribution: &JsValue,
        js_new_tokens_destination_identity: &JsValue,
        new_tokens_destination_identity_rules: &ChangeControlRulesWASM,
        minting_allow_choosing_destination: bool,
        minting_allow_choosing_destination_rules: &ChangeControlRulesWASM,
        change_direct_purchase_pricing_rules: &ChangeControlRulesWASM,
    ) -> Result<TokenDistributionRulesWASM, JsValue> {
        let perpetual_distribution = match js_perpetual_distribution.is_undefined() {
            true => None,
            false => Some(TokenPerpetualDistribution::from(
                js_perpetual_distribution
                    .to_wasm::<TokenPerpetualDistributionWASM>("TokenPerpetualDistributionWASM")?
                    .clone(),
            )),
        };

        let pre_programmed_distribution = match js_pre_programmed_distribution.is_undefined() {
            true => None,
            false => Some(TokenPreProgrammedDistribution::from(
                js_pre_programmed_distribution
                    .to_wasm::<TokenPreProgrammedDistributionWASM>(
                        "TokenPreProgrammedDistributionWASM",
                    )?
                    .clone(),
            )),
        };

        let new_tokens_destination_identity =
            match js_new_tokens_destination_identity.is_undefined() {
                true => None,
                false => Some(Identifier::from(IdentifierWASM::try_from(
                    js_new_tokens_destination_identity,
                )?)),
            };

        Ok(TokenDistributionRulesWASM(TokenDistributionRules::V0(
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
}
