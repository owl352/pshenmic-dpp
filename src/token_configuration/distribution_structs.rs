use napi_derive::napi;

use crate::dynamic_value::BigIntString;

#[napi(object, js_name = "DistributionFixedAmountNAPI")]
pub struct DistributionFixedAmountNAPI {
    pub amount: BigIntString,
}

#[napi(object, js_name = "DistributionRandomNAPI")]
pub struct DistributionRandomNAPI {
    pub min: BigIntString,
    pub max: BigIntString,
}

#[napi(object, js_name = "DistributionStepDecreasingAmountNAPI")]
pub struct DistributionStepDecreasingAmountNAPI {
    pub step_count: u32,
    pub decrease_per_interval_numerator: u16,
    pub decrease_per_interval_denominator: u16,
    pub start_decreasing_offset: Option<BigIntString>,
    pub max_interval_count: Option<u16>,
    pub distribution_start_amount: BigIntString,
    pub trailing_distribution_interval_amount: BigIntString,
    pub min_value: Option<BigIntString>,
}

#[napi(object, js_name = "DistributionLinearNAPI")]
pub struct DistributionLinearNAPI {
    pub a: i64,
    pub d: BigIntString,
    pub start_step: Option<BigIntString>,
    pub starting_amount: BigIntString,
    pub min_value: Option<BigIntString>,
    pub max_value: Option<BigIntString>,
}

#[napi(object, js_name = "DistributionPolynomialNAPI")]
pub struct DistributionPolynomialNAPI {
    pub a: i64,
    pub d: BigIntString,
    pub m: i64,
    pub n: BigIntString,
    pub o: i64,
    pub start_moment: Option<BigIntString>,
    pub b: BigIntString,
    pub min_value: Option<BigIntString>,
    pub max_value: Option<BigIntString>,
}

#[napi(object, js_name = "DistributionExponentialNAPI")]
pub struct DistributionExponentialNAPI {
    pub a: BigIntString,
    pub d: BigIntString,
    pub m: i64,
    pub n: BigIntString,
    pub o: i64,
    pub start_moment: Option<BigIntString>,
    pub b: BigIntString,
    pub min_value: Option<BigIntString>,
    pub max_value: Option<BigIntString>,
}

#[napi(object, js_name = "DistributionLogarithmicNAPI")]
pub struct DistributionLogarithmicNAPI {
    pub a: i64,
    pub d: BigIntString,
    pub m: BigIntString,
    pub n: BigIntString,
    pub o: i64,
    pub start_moment: Option<BigIntString>,
    pub b: BigIntString,
    pub min_value: Option<BigIntString>,
    pub max_value: Option<BigIntString>,
}

#[napi(object, js_name = "DistributionInvertedLogarithmicNAPI")]
pub struct DistributionInvertedLogarithmicNAPI {
    pub a: i64,
    pub d: BigIntString,
    pub m: BigIntString,
    pub n: BigIntString,
    pub o: i64,
    pub start_moment: Option<BigIntString>,
    pub b: BigIntString,
    pub min_value: Option<BigIntString>,
    pub max_value: Option<BigIntString>,
}
