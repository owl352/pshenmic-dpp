use dpp::data_contract::associated_token::token_perpetual_distribution::reward_distribution_type::RewardDistributionType;
use dpp::data_contract::associated_token::token_perpetual_distribution::reward_distribution_type::RewardDistributionType::{BlockBasedDistribution, EpochBasedDistribution, TimeBasedDistribution};
use napi::bindgen_prelude::Either3;
use napi_derive::napi;

use crate::dynamic_value::{TryToU64, Uint64String};
use crate::token_configuration::distribution_function::DistributionFunctionNAPI;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "RewardDistributionTypeNAPI")]
pub struct RewardDistributionTypeNAPI(RewardDistributionType);

impl From<RewardDistributionType> for RewardDistributionTypeNAPI {
    fn from(reward_distribution_type: RewardDistributionType) -> Self {
        Self(reward_distribution_type)
    }
}

impl From<RewardDistributionTypeNAPI> for RewardDistributionType {
    fn from(reward_distribution_type: RewardDistributionTypeNAPI) -> Self {
        reward_distribution_type.0
    }
}

#[napi]
impl RewardDistributionTypeNAPI {
    #[napi(js_name = "BlockBasedDistribution")]
    pub fn block_based_distribution(
        interval: Uint64String,
        distribution_function: &DistributionFunctionNAPI,
    ) -> Result<Self, napi::Error> {
        Ok(RewardDistributionTypeNAPI(BlockBasedDistribution {
            interval: interval.try_to_u64()?,
            function: distribution_function.clone().into(),
        }))
    }

    #[napi(js_name = "TimeBasedDistribution")]
    pub fn time_based_distribution(
        interval: Uint64String,
        distribution_function: &DistributionFunctionNAPI,
    ) -> Result<Self, napi::Error> {
        Ok(RewardDistributionTypeNAPI(TimeBasedDistribution {
            interval: interval.try_to_u64()?,
            function: distribution_function.clone().into(),
        }))
    }

    #[napi(js_name = "EpochBasedDistribution")]
    pub fn epoch_based_distribution(
        interval: u16,
        distribution_function: &DistributionFunctionNAPI,
    ) -> Self {
        RewardDistributionTypeNAPI(EpochBasedDistribution {
            interval,
            function: distribution_function.clone().into(),
        })
    }

    #[napi(js_name = "getDistribution")]
    pub fn get_distribution(
        &self,
    ) -> Either3<BlockBasedDistributionNAPI, TimeBasedDistributionNAPI, EpochBasedDistributionNAPI>
    {
        match self.0.clone() {
            RewardDistributionType::BlockBasedDistribution { interval, function } => {
                Either3::A(BlockBasedDistributionNAPI {
                    interval: Uint64String::from_u64(interval),
                    function: function.clone().into(),
                })
            }
            RewardDistributionType::TimeBasedDistribution { interval, function } => {
                Either3::B(TimeBasedDistributionNAPI {
                    interval: Uint64String::from_u64(interval),
                    function: function.clone().into(),
                })
            }
            RewardDistributionType::EpochBasedDistribution { interval, function } => {
                Either3::C(EpochBasedDistributionNAPI {
                    interval,
                    function: function.clone().into(),
                })
            }
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "BlockBasedDistributionNAPI")]
pub struct BlockBasedDistributionNAPI {
    pub interval: Uint64String,
    function: DistributionFunctionNAPI,
}

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "TimeBasedDistributionNAPI")]
pub struct TimeBasedDistributionNAPI {
    pub interval: Uint64String,
    function: DistributionFunctionNAPI,
}

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "EpochBasedDistributionNAPI")]
pub struct EpochBasedDistributionNAPI {
    pub interval: u16,
    function: DistributionFunctionNAPI,
}

#[napi]
impl BlockBasedDistributionNAPI {
    #[napi(getter, js_name = "function")]
    pub fn get_function(&self) -> DistributionFunctionNAPI {
        self.function.clone()
    }

    #[napi(setter, js_name = "function")]
    pub fn set_function(&mut self, distribution_function: &DistributionFunctionNAPI) {
        self.function = distribution_function.clone()
    }
}

#[napi]
impl TimeBasedDistributionNAPI {
    #[napi(getter, js_name = "function")]
    pub fn get_function(&self) -> DistributionFunctionNAPI {
        self.function.clone()
    }

    #[napi(setter, js_name = "function")]
    pub fn set_function(&mut self, distribution_function: &DistributionFunctionNAPI) {
        self.function = distribution_function.clone()
    }
}

#[napi]
impl EpochBasedDistributionNAPI {
    #[napi(getter, js_name = "function")]
    pub fn get_function(&self) -> DistributionFunctionNAPI {
        self.function.clone()
    }

    #[napi(setter, js_name = "function")]
    pub fn set_function(&mut self, distribution_function: &DistributionFunctionNAPI) {
        self.function = distribution_function.clone()
    }
}
