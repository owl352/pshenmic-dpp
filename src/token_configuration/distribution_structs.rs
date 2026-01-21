use napi_derive::napi;

use crate::dynamic_value::Uint64String;

#[napi(object, js_name = "DistributionFixedAmountNAPI")]
pub struct DistributionFixedAmountNAPI {
    pub amount: Uint64String,
}

#[napi(object, js_name = "DistributionRandomNAPI")]
pub struct DistributionRandomNAPI {
    pub min: Uint64String,
    pub max: Uint64String,
}

#[napi(object, js_name = "DistributionStepDecreasingAmountNAPI")]
pub struct DistributionStepDecreasingAmountNAPI {
    pub step_count: u32,
    pub decrease_per_interval_numerator: u16,
    pub decrease_per_interval_denominator: u16,
    pub start_decreasing_offset: Option<Uint64String>,
    pub max_interval_count: Option<u16>,
    pub distribution_start_amount: Uint64String,
    pub trailing_distribution_interval_amount: Uint64String,
    pub min_value: Option<Uint64String>,
}

#[napi(object, js_name = "DistributionLinearNAPI")]
pub struct DistributionLinearNAPI {
    pub a: i64,
    pub d: Uint64String,
    pub start_step: Option<Uint64String>,
    pub starting_amount: Uint64String,
    pub min_value: Option<Uint64String>,
    pub max_value: Option<Uint64String>,
}

#[napi(object, js_name = "DistributionPolynomialNAPI")]
pub struct DistributionPolynomialNAPI {
    pub a: i64,
    pub d: Uint64String,
    pub m: i64,
    pub n: Uint64String,
    pub o: i64,
    pub start_moment: Option<Uint64String>,
    pub b: Uint64String,
    pub min_value: Option<Uint64String>,
    pub max_value: Option<Uint64String>,
}

#[napi(object, js_name = "DistributionExponentialNAPI")]
pub struct DistributionExponentialNAPI {
    pub a: Uint64String,
    pub d: Uint64String,
    pub m: i64,
    pub n: Uint64String,
    pub o: i64,
    pub start_moment: Option<Uint64String>,
    pub b: Uint64String,
    pub min_value: Option<Uint64String>,
    pub max_value: Option<Uint64String>,
}

#[napi(object, js_name = "DistributionLogarithmicNAPI")]
pub struct DistributionLogarithmicNAPI {
    pub a: i64,
    pub d: Uint64String,
    pub m: Uint64String,
    pub n: Uint64String,
    pub o: i64,
    pub start_moment: Option<Uint64String>,
    pub b: Uint64String,
    pub min_value: Option<Uint64String>,
    pub max_value: Option<Uint64String>,
}

#[napi(object, js_name = "DistributionInvertedLogarithmicNAPI")]
pub struct DistributionInvertedLogarithmicNAPI {
    pub a: i64,
    pub d: Uint64String,
    pub m: Uint64String,
    pub n: Uint64String,
    pub o: i64,
    pub start_moment: Option<Uint64String>,
    pub b: Uint64String,
    pub min_value: Option<Uint64String>,
    pub max_value: Option<Uint64String>,
}
