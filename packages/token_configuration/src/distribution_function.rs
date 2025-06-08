use crate::distribution_structs::{
    DistributionExponentialWASM, DistributionFixedAmountWASM, DistributionInvertedLogarithmicWASM,
    DistributionLinearWASM, DistributionLogarithmicWASM, DistributionPolynomialWASM,
    DistributionRandomWASM, DistributionStepDecreasingAmountWASM,
};
use dpp::balances::credits::TokenAmount;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::associated_token::token_perpetual_distribution::distribution_function::DistributionFunction;
use pshenmic_dpp_utils::ToSerdeJSONExt;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone, Debug, PartialEq)]
#[wasm_bindgen(js_name = "DistributionFunctionWASM")]
pub struct DistributionFunctionWASM(DistributionFunction);

impl From<DistributionFunctionWASM> for DistributionFunction {
    fn from(function: DistributionFunctionWASM) -> Self {
        function.0
    }
}

impl From<DistributionFunction> for DistributionFunctionWASM {
    fn from(function: DistributionFunction) -> Self {
        Self(function)
    }
}

#[wasm_bindgen]
impl DistributionFunctionWASM {
    #[wasm_bindgen(js_name = "FixedAmountDistribution")]
    pub fn fixed_amount_distribution(amount: TokenAmount) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::FixedAmount { amount })
    }

    #[wasm_bindgen(js_name = "Random")]
    pub fn random(min: TokenAmount, max: TokenAmount) -> Self {
        DistributionFunctionWASM(DistributionFunction::Random { min, max })
    }

    #[wasm_bindgen(js_name = "StepDecreasingAmount")]
    pub fn step_decreasing_amount(
        step_count: u32,
        decrease_per_interval_numerator: u16,
        decrease_per_interval_denominator: u16,
        start_decreasing_offset: Option<u64>,
        max_interval_count: Option<u16>,
        distribution_start_amount: TokenAmount,
        trailing_distribution_interval_amount: TokenAmount,
        min_value: Option<u64>,
    ) -> Self {
        DistributionFunctionWASM(DistributionFunction::StepDecreasingAmount {
            step_count,
            decrease_per_interval_numerator,
            decrease_per_interval_denominator,
            start_decreasing_offset,
            max_interval_count,
            distribution_start_amount,
            trailing_distribution_interval_amount,
            min_value,
        })
    }

    #[wasm_bindgen(js_name = "Stepwise")]
    pub fn stepwise(js_steps_with_amount: JsValue) -> Result<DistributionFunctionWASM, JsValue> {
        let steps_with_amount = js_steps_with_amount
            .with_serde_to_platform_value_map()?
            .iter()
            .map(|(key, value)| {
                (
                    key.clone().parse::<u64>().unwrap(),
                    value.clone().as_integer::<u64>().unwrap(),
                )
            })
            .collect();

        Ok(DistributionFunctionWASM(DistributionFunction::Stepwise(
            steps_with_amount,
        )))
    }

    #[wasm_bindgen(js_name = "Linear")]
    pub fn linear(
        a: i64,
        d: u64,
        start_step: Option<u64>,
        starting_amount: TokenAmount,
        min_value: Option<u64>,
        max_value: Option<u64>,
    ) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::Linear {
            a,
            d,
            start_step,
            starting_amount,
            min_value,
            max_value,
        })
    }

    #[wasm_bindgen(js_name = "Polynomial")]
    pub fn polynomial(
        a: i64,
        d: u64,
        m: i64,
        n: u64,
        o: i64,
        start_moment: Option<u64>,
        b: TokenAmount,
        min_value: Option<u64>,
        max_value: Option<u64>,
    ) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::Polynomial {
            a,
            d,
            m,
            n,
            o,
            start_moment,
            b,
            min_value,
            max_value,
        })
    }

    #[wasm_bindgen(js_name = "Exponential")]
    pub fn exponential(
        a: u64,
        d: u64,
        m: i64,
        n: u64,
        o: i64,
        start_moment: Option<u64>,
        b: TokenAmount,
        min_value: Option<u64>,
        max_value: Option<u64>,
    ) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::Exponential {
            a,
            d,
            m,
            n,
            o,
            start_moment,
            b,
            min_value,
            max_value,
        })
    }

    #[wasm_bindgen(js_name = "Logarithmic")]
    pub fn logarithmic(
        a: i64,
        d: u64,
        m: u64,
        n: u64,
        o: i64,
        start_moment: Option<u64>,
        b: TokenAmount,
        min_value: Option<u64>,
        max_value: Option<u64>,
    ) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::Logarithmic {
            a,
            d,
            m,
            n,
            o,
            start_moment,
            b,
            min_value,
            max_value,
        })
    }

    #[wasm_bindgen(js_name = "InvertedLogarithmic")]
    pub fn inverted_logarithmic(
        a: i64,
        d: u64,
        m: u64,
        n: u64,
        o: i64,
        start_moment: Option<u64>,
        b: TokenAmount,
        min_value: Option<u64>,
        max_value: Option<u64>,
    ) -> DistributionFunctionWASM {
        DistributionFunctionWASM(DistributionFunction::InvertedLogarithmic {
            a,
            d,
            m,
            n,
            o,
            start_moment,
            b,
            min_value,
            max_value,
        })
    }

    #[wasm_bindgen(js_name = "getFunctionName")]
    pub fn get_function_values(&self) -> Result<JsValue, JsValue> {
        match self.0.clone() {
            DistributionFunction::FixedAmount { amount } => {
                Ok(JsValue::from(DistributionFixedAmountWASM { amount }))
            }
            DistributionFunction::Random { min, max } => {
                Ok(JsValue::from(DistributionRandomWASM { min, max }))
            }
            DistributionFunction::StepDecreasingAmount {
                step_count,
                decrease_per_interval_numerator,
                decrease_per_interval_denominator,
                start_decreasing_offset,
                max_interval_count,
                distribution_start_amount,
                trailing_distribution_interval_amount,
                min_value,
            } => Ok(JsValue::from(DistributionStepDecreasingAmountWASM {
                step_count,
                decrease_per_interval_numerator,
                decrease_per_interval_denominator,
                start_decreasing_offset,
                max_interval_count,
                distribution_start_amount,
                trailing_distribution_interval_amount,
                min_value,
            })),
            DistributionFunction::Stepwise(map) => {
                let serializer = serde_wasm_bindgen::Serializer::json_compatible();

                map.serialize(&serializer).map_err(JsValue::from)
            }
            DistributionFunction::Linear {
                a,
                d,
                start_step,
                starting_amount,
                min_value,
                max_value,
            } => Ok(JsValue::from(DistributionLinearWASM {
                a,
                d,
                start_step,
                starting_amount,
                min_value,
                max_value,
            })),
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
            } => Ok(JsValue::from(DistributionPolynomialWASM {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            })),
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
            } => Ok(JsValue::from(DistributionExponentialWASM {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            })),
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
            } => Ok(JsValue::from(DistributionLogarithmicWASM {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            })),
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
            } => Ok(JsValue::from(DistributionInvertedLogarithmicWASM {
                a,
                d,
                m,
                n,
                o,
                start_moment,
                b,
                min_value,
                max_value,
            })),
        }
    }
}
