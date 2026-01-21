use dpp::data_contract::associated_token::token_perpetual_distribution::TokenPerpetualDistribution;
use dpp::data_contract::associated_token::token_perpetual_distribution::methods::v0::TokenPerpetualDistributionV0Accessors;
use dpp::data_contract::associated_token::token_perpetual_distribution::v0::TokenPerpetualDistributionV0;
use napi_derive::napi;

use crate::token_configuration::distribution_recipient::TokenDistributionRecipientNAPI;
use crate::token_configuration::reward_distribution_type::RewardDistributionTypeNAPI;

#[derive(Clone, PartialEq, Debug)]
#[napi(js_name = "TokenPerpetualDistributionNAPI")]
pub struct TokenPerpetualDistributionNAPI(TokenPerpetualDistribution);

impl From<TokenPerpetualDistributionNAPI> for TokenPerpetualDistribution {
    fn from(value: TokenPerpetualDistributionNAPI) -> Self {
        value.0
    }
}

impl From<TokenPerpetualDistribution> for TokenPerpetualDistributionNAPI {
    fn from(value: TokenPerpetualDistribution) -> Self {
        TokenPerpetualDistributionNAPI(value)
    }
}

#[napi]
impl TokenPerpetualDistributionNAPI {
    #[napi(constructor)]
    pub fn new(
        distribution_type: &RewardDistributionTypeNAPI,
        recipient: &TokenDistributionRecipientNAPI,
    ) -> Self {
        TokenPerpetualDistributionNAPI(TokenPerpetualDistribution::V0(
            TokenPerpetualDistributionV0 {
                distribution_type: distribution_type.clone().into(),
                distribution_recipient: recipient.clone().into(),
            },
        ))
    }

    #[napi(getter, js_name = distributionType)]
    pub fn distribution_type(&self) -> RewardDistributionTypeNAPI {
        self.0.distribution_type().clone().into()
    }

    #[napi(getter, js_name = distributionRecipient)]
    pub fn recipient(&self) -> TokenDistributionRecipientNAPI {
        self.0.distribution_recipient().clone().into()
    }

    #[napi(setter = distributionType)]
    pub fn set_distribution_type(&mut self, distribution_type: &RewardDistributionTypeNAPI) {
        self.0
            .set_distribution_type(distribution_type.clone().into());
    }

    #[napi(setter = distributionRecipient)]
    pub fn set_recipient(&mut self, distribution_recipient: &TokenDistributionRecipientNAPI) {
        self.0
            .set_distribution_recipient(distribution_recipient.clone().into());
    }
}
