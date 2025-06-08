use crate::distribution_recipient::TokenDistributionRecipientWASM;
use crate::reward_distribution_type::RewardDistributionTypeWASM;
use dpp::data_contract::associated_token::token_perpetual_distribution::TokenPerpetualDistribution;
use dpp::data_contract::associated_token::token_perpetual_distribution::v0::TokenPerpetualDistributionV0;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone, PartialEq, Debug)]
#[wasm_bindgen(js_name = "TokenPerpetualDistributionWASM")]
pub struct TokenPerpetualDistributionWASM(TokenPerpetualDistribution);

impl From<TokenPerpetualDistributionWASM> for TokenPerpetualDistribution {
    fn from(value: TokenPerpetualDistributionWASM) -> Self {
        value.0
    }
}

impl From<TokenPerpetualDistribution> for TokenPerpetualDistributionWASM {
    fn from(value: TokenPerpetualDistribution) -> Self {
        TokenPerpetualDistributionWASM(value)
    }
}

#[wasm_bindgen]
impl TokenPerpetualDistributionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        distribution_type: &RewardDistributionTypeWASM,
        recipient: &TokenDistributionRecipientWASM,
    ) -> Self {
        TokenPerpetualDistributionWASM(TokenPerpetualDistribution::V0(
            TokenPerpetualDistributionV0 {
                distribution_type: distribution_type.clone().into(),
                distribution_recipient: recipient.clone().into(),
            },
        ))
    }
}
