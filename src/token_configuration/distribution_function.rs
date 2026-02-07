use dpp::balances::credits::TokenAmount;
use dpp::data_contract::associated_token::token_perpetual_distribution::distribution_function::DistributionFunction;
use napi::bindgen_prelude::Either9;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::{
    dynamic_value::{BigIntString, TryToU64},
    token_configuration::distribution_structs::{
        DistributionExponentialNAPI, DistributionFixedAmountNAPI,
        DistributionInvertedLogarithmicNAPI, DistributionLinearNAPI, DistributionLogarithmicNAPI,
        DistributionPolynomialNAPI, DistributionRandomNAPI, DistributionStepDecreasingAmountNAPI,
    },
};

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "DistributionFunctionNAPI")]
pub struct DistributionFunctionNAPI(DistributionFunction);

impl From<DistributionFunctionNAPI> for DistributionFunction {
    fn from(distribution_function: DistributionFunctionNAPI) -> Self {
        distribution_function.0
    }
}

impl From<DistributionFunction> for DistributionFunctionNAPI {
    fn from(distribution_function: DistributionFunction) -> Self {
        Self(distribution_function)
    }
}

#[napi]
impl DistributionFunctionNAPI {
    #[napi(js_name = "FixedAmountDistribution")]
    pub fn fixed_amount_distribution(
        amount: BigIntString,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(
            DistributionFunction::FixedAmount {
                amount: amount.try_to_u64()?,
            },
        ))
    }

    #[napi(js_name = "Random")]
    pub fn random(min: BigIntString, max: BigIntString) -> Result<Self, napi::Error> {
        Ok(DistributionFunctionNAPI(DistributionFunction::Random {
            min: min.try_to_u64()?,
            max: max.try_to_u64()?,
        }))
    }

    #[napi(js_name = "StepDecreasingAmount")]
    pub fn step_decreasing_amount(
        step_count: u32,
        decrease_per_interval_numerator: u16,
        decrease_per_interval_denominator: u16,
        start_decreasing_offset: Option<BigIntString>,
        max_interval_count: Option<u16>,
        distribution_start_amount: BigIntString,
        trailing_distribution_interval_amount: BigIntString,
        min_value: Option<BigIntString>,
    ) -> Result<Self, napi::Error> {
        Ok(DistributionFunctionNAPI(
            DistributionFunction::StepDecreasingAmount {
                step_count,
                decrease_per_interval_numerator,
                decrease_per_interval_denominator,
                start_decreasing_offset: start_decreasing_offset
                    .map(|s| s.try_to_u64())
                    .transpose()?,
                max_interval_count,
                distribution_start_amount: distribution_start_amount.try_to_u64()?,
                trailing_distribution_interval_amount: trailing_distribution_interval_amount
                    .try_to_u64()?,
                min_value: min_value.map(|s| s.try_to_u64()).transpose()?,
            },
        ))
    }

    #[napi(js_name = "Stepwise")]
    pub fn stepwise(
        js_steps_with_amount: Vec<(BigIntString, BigIntString)>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        let steps_with_amount: BTreeMap<u64, TokenAmount> = js_steps_with_amount
            .iter()
            .map(|(js_interval, js_amount)| {
                Ok::<(u64, u64), napi::Error>((js_interval.try_to_u64()?, js_amount.try_to_u64()?))
            })
            .collect::<Result<BTreeMap<u64, TokenAmount>, napi::Error>>()?;

        Ok(DistributionFunctionNAPI(DistributionFunction::Stepwise(
            steps_with_amount,
        )))
    }

    #[napi(js_name = "Linear")]
    pub fn linear(
        a: i64,
        d: BigIntString,
        start_step: Option<BigIntString>,
        starting_amount: BigIntString,
        min_value: Option<BigIntString>,
        max_value: Option<BigIntString>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(DistributionFunction::Linear {
            a,
            d: d.try_to_u64()?,
            start_step: start_step.map(|s| s.try_to_u64()).transpose()?,
            starting_amount: starting_amount.try_to_u64()?,
            min_value: min_value.map(|m| m.try_to_u64()).transpose()?,
            max_value: max_value.map(|m| m.try_to_u64()).transpose()?,
        }))
    }

    #[napi(js_name = "Polynomial")]
    pub fn polynomial(
        a: i64,
        d: BigIntString,
        m: i64,
        n: BigIntString,
        o: i64,
        start_moment: Option<BigIntString>,
        b: BigIntString,
        min_value: Option<BigIntString>,
        max_value: Option<BigIntString>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(DistributionFunction::Polynomial {
            a,
            d: d.try_to_u64()?,
            m,
            n: n.try_to_u64()?,
            o,
            start_moment: start_moment.map(|s| s.try_to_u64()).transpose()?,
            b: b.try_to_u64()?,
            min_value: min_value.map(|m| m.try_to_u64()).transpose()?,
            max_value: max_value.map(|m| m.try_to_u64()).transpose()?,
        }))
    }

    #[napi(js_name = "Exponential")]
    pub fn exponential(
        a: BigIntString,
        d: BigIntString,
        m: i64,
        n: BigIntString,
        o: i64,
        start_moment: Option<BigIntString>,
        b: BigIntString,
        min_value: Option<BigIntString>,
        max_value: Option<BigIntString>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(
            DistributionFunction::Exponential {
                a: a.try_to_u64()?,
                d: d.try_to_u64()?,
                m,
                n: n.try_to_u64()?,
                o,
                start_moment: start_moment.map(|s| s.try_to_u64()).transpose()?,
                b: b.try_to_u64()?,
                min_value: min_value.map(|m| m.try_to_u64()).transpose()?,
                max_value: max_value.map(|m| m.try_to_u64()).transpose()?,
            },
        ))
    }

    #[napi(js_name = "Logarithmic")]
    pub fn logarithmic(
        a: i64,
        d: BigIntString,
        m: BigIntString,
        n: BigIntString,
        o: i64,
        start_moment: Option<BigIntString>,
        b: BigIntString,
        min_value: Option<BigIntString>,
        max_value: Option<BigIntString>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(
            DistributionFunction::Logarithmic {
                a,
                d: d.try_to_u64()?,
                m: m.try_to_u64()?,
                n: n.try_to_u64()?,
                o,
                start_moment: start_moment.map(|s| s.try_to_u64()).transpose()?,
                b: b.try_to_u64()?,
                min_value: min_value.map(|m| m.try_to_u64()).transpose()?,
                max_value: max_value.map(|m| m.try_to_u64()).transpose()?,
            },
        ))
    }

    #[napi(js_name = "InvertedLogarithmic")]
    pub fn inverted_logarithmic(
        a: i64,
        d: BigIntString,
        m: BigIntString,
        n: BigIntString,
        o: i64,
        start_moment: Option<BigIntString>,
        b: BigIntString,
        min_value: Option<BigIntString>,
        max_value: Option<BigIntString>,
    ) -> Result<DistributionFunctionNAPI, napi::Error> {
        Ok(DistributionFunctionNAPI(
            DistributionFunction::InvertedLogarithmic {
                a,
                d: d.try_to_u64()?,
                m: m.try_to_u64()?,
                n: n.try_to_u64()?,
                o,
                start_moment: start_moment.map(|s| s.try_to_u64()).transpose()?,
                b: b.try_to_u64()?,
                min_value: min_value.map(|m| m.try_to_u64()).transpose()?,
                max_value: max_value.map(|m| m.try_to_u64()).transpose()?,
            },
        ))
    }

    #[napi(js_name = "getFunctionName")]
    pub fn get_function_name(&self) -> String {
        match self.0 {
            DistributionFunction::FixedAmount { .. } => String::from("FixedAmount"),
            DistributionFunction::Random { .. } => String::from("Random"),
            DistributionFunction::StepDecreasingAmount { .. } => {
                String::from("StepDecreasingAmount")
            }
            DistributionFunction::Stepwise(_) => String::from("Stepwise"),
            DistributionFunction::Linear { .. } => String::from("Linear"),
            DistributionFunction::Polynomial { .. } => String::from("Polynomial"),
            DistributionFunction::Exponential { .. } => String::from("Exponential"),
            DistributionFunction::Logarithmic { .. } => String::from("Logarithmic"),
            DistributionFunction::InvertedLogarithmic { .. } => String::from("InvertedLogarithmic"),
        }
    }

    #[napi(js_name = "getFunctionValue")]
    pub fn get_function_values(
        &self,
    ) -> Either9<
        DistributionFixedAmountNAPI,
        DistributionRandomNAPI,
        DistributionStepDecreasingAmountNAPI,
        Vec<(BigIntString, BigIntString)>,
        DistributionLinearNAPI,
        DistributionPolynomialNAPI,
        DistributionExponentialNAPI,
        DistributionLogarithmicNAPI,
        DistributionInvertedLogarithmicNAPI,
    > {
        match self.0.clone() {
            DistributionFunction::FixedAmount { amount } => {
                Either9::A(DistributionFixedAmountNAPI {
                    amount: BigIntString::from_u64(amount),
                })
            }
            DistributionFunction::Random { min, max } => Either9::B(DistributionRandomNAPI {
                min: BigIntString::from_u64(min),
                max: BigIntString::from_u64(max),
            }),
            DistributionFunction::StepDecreasingAmount {
                step_count,
                decrease_per_interval_numerator,
                decrease_per_interval_denominator,
                start_decreasing_offset,
                max_interval_count,
                distribution_start_amount,
                trailing_distribution_interval_amount,
                min_value,
            } => Either9::C(DistributionStepDecreasingAmountNAPI {
                step_count,
                decrease_per_interval_numerator,
                decrease_per_interval_denominator,
                start_decreasing_offset: start_decreasing_offset
                    .map(|offset| BigIntString::from_u64(offset)),
                max_interval_count,
                distribution_start_amount: BigIntString::from_u64(distribution_start_amount),
                trailing_distribution_interval_amount: BigIntString::from_u64(
                    trailing_distribution_interval_amount,
                ),
                min_value: min_value.map(BigIntString::from_u64),
            }),
            DistributionFunction::Stepwise(steps) => Either9::D(
                steps
                    .iter()
                    .map(|(a, b)| {
                        (
                            BigIntString::from_u64(a.clone()),
                            BigIntString::from_u64(b.clone()),
                        )
                    })
                    .collect(),
            ),
            DistributionFunction::Linear {
                a,
                d,
                start_step,
                starting_amount,
                min_value,
                max_value,
            } => Either9::E(DistributionLinearNAPI {
                a,
                d: BigIntString::from_u64(d),
                start_step: start_step.map(BigIntString::from_u64),
                starting_amount: BigIntString::from_u64(starting_amount),
                min_value: min_value.map(BigIntString::from_u64),
                max_value: max_value.map(BigIntString::from_u64),
            }),
            DistributionFunction::Polynomial {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            } => Either9::F(DistributionPolynomialNAPI {
                a,
                d: BigIntString::from_u64(d),
                m,
                n: BigIntString::from_u64(n),
                o,
                start_moment: start_moment.map(BigIntString::from_u64),
                b: BigIntString::from_u64(b),
                min_value: min_value.map(BigIntString::from_u64),
                max_value: max_value.map(BigIntString::from_u64),
            }),
            DistributionFunction::Exponential {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            } => Either9::G(DistributionExponentialNAPI {
                a: BigIntString::from_u64(a),
                d: BigIntString::from_u64(d),
                m,
                n: BigIntString::from_u64(n),
                o,
                start_moment: start_moment.map(BigIntString::from_u64),
                b: BigIntString::from_u64(b),
                min_value: min_value.map(BigIntString::from_u64),
                max_value: max_value.map(BigIntString::from_u64),
            }),
            DistributionFunction::Logarithmic {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            } => Either9::H(DistributionLogarithmicNAPI {
                a,
                d: BigIntString::from_u64(d),
                m: BigIntString::from_u64(m),
                n: BigIntString::from_u64(n),
                o,
                start_moment: start_moment.map(BigIntString::from_u64),
                b: BigIntString::from_u64(b),
                min_value: min_value.map(BigIntString::from_u64),
                max_value: max_value.map(BigIntString::from_u64),
            }),
            DistributionFunction::InvertedLogarithmic {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            } => Either9::I(DistributionInvertedLogarithmicNAPI {
                a,
                d: BigIntString::from_u64(d),
                m: BigIntString::from_u64(m),
                n: BigIntString::from_u64(n),
                o,
                start_moment: start_moment.map(BigIntString::from_u64),
                b: BigIntString::from_u64(b),
                min_value: min_value.map(BigIntString::from_u64),
                max_value: max_value.map(BigIntString::from_u64),
            }),
        }
    }
}
