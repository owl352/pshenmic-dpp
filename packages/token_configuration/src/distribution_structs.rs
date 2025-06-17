use dpp::balances::credits::TokenAmount;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "DistributionFixedAmountWASM")]
pub struct DistributionFixedAmountWASM {
    pub amount: TokenAmount,
}

#[wasm_bindgen(js_name = "DistributionRandomWASM")]
pub struct DistributionRandomWASM {
    pub min: TokenAmount,
    pub max: TokenAmount,
}

#[wasm_bindgen(js_name = "DistributionStepDecreasingAmountWASM")]
pub struct DistributionStepDecreasingAmountWASM {
    pub step_count: u32,
    pub decrease_per_interval_numerator: u16,
    pub decrease_per_interval_denominator: u16,
    pub start_decreasing_offset: Option<u64>,
    pub max_interval_count: Option<u16>,
    pub distribution_start_amount: TokenAmount,
    pub trailing_distribution_interval_amount: TokenAmount,
    pub min_value: Option<u64>,
}

#[wasm_bindgen(js_name = "DistributionLinearWASM")]
pub struct DistributionLinearWASM {
    pub a: i64,
    pub d: u64,
    pub start_step: Option<u64>,
    pub starting_amount: TokenAmount,
    pub min_value: Option<u64>,
    pub max_value: Option<u64>,
}

#[wasm_bindgen(js_name = "DistributionPolynomialWASM")]
pub struct DistributionPolynomialWASM {
    pub a: i64,
    pub d: u64,
    pub m: i64,
    pub n: u64,
    pub o: i64,
    pub start_moment: Option<u64>,
    pub b: TokenAmount,
    pub min_value: Option<u64>,
    pub max_value: Option<u64>,
}

#[wasm_bindgen(js_name = "DistributionExponentialWASM")]
pub struct DistributionExponentialWASM {
    pub a: u64,
    pub d: u64,
    pub m: i64,
    pub n: u64,
    pub o: i64,
    pub start_moment: Option<u64>,
    pub b: TokenAmount,
    pub min_value: Option<u64>,
    pub max_value: Option<u64>,
}

#[wasm_bindgen(js_name = "DistributionLogarithmicWASM")]
pub struct DistributionLogarithmicWASM {
    pub a: i64,
    pub d: u64,
    pub m: u64,
    pub n: u64,
    pub o: i64,
    pub start_moment: Option<u64>,
    pub b: TokenAmount,
    pub min_value: Option<u64>,
    pub max_value: Option<u64>,
}

#[wasm_bindgen(js_name = "DistributionInvertedLogarithmicWASM")]
pub struct DistributionInvertedLogarithmicWASM {
    pub a: i64,
    pub d: u64,
    pub m: u64,
    pub n: u64,
    pub o: i64,
    pub start_moment: Option<u64>,
    pub b: TokenAmount,
    pub min_value: Option<u64>,
    pub max_value: Option<u64>,
}
