use dpp::balances::credits::TokenAmount;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::fee::Credits;
use dpp::tokens::token_pricing_schedule::TokenPricingSchedule;
use pshenmic_dpp_utils::ToSerdeJSONExt;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone, Debug, PartialEq)]
#[wasm_bindgen(js_name = "TokenPricingScheduleWASM")]
pub struct TokenPricingScheduleWASM(TokenPricingSchedule);

impl From<TokenPricingScheduleWASM> for TokenPricingSchedule {
    fn from(schedule: TokenPricingScheduleWASM) -> Self {
        schedule.0
    }
}

impl From<TokenPricingSchedule> for TokenPricingScheduleWASM {
    fn from(schedule: TokenPricingSchedule) -> Self {
        TokenPricingScheduleWASM(schedule)
    }
}

#[wasm_bindgen]
impl TokenPricingScheduleWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenPricingScheduleWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "TokenPricingScheduleWASM".to_string()
    }

    #[wasm_bindgen(js_name = "SinglePrice")]
    pub fn single_price(credits: Credits) -> Self {
        Self(TokenPricingSchedule::SinglePrice(credits))
    }

    #[wasm_bindgen(js_name = "SetPrices")]
    pub fn set_prices(js_prices: &JsValue) -> Result<TokenPricingScheduleWASM, JsValue> {
        let prices: BTreeMap<TokenAmount, Credits> = js_prices
            .with_serde_to_platform_value_map()?
            .iter()
            .map(|(k, v)| (k.clone().parse().unwrap(), v.clone().as_integer().unwrap()))
            .collect();

        Ok(Self(TokenPricingSchedule::SetPrices(prices)))
    }

    #[wasm_bindgen(js_name = "getScheduleType")]
    pub fn get_scheduled_type(&self) -> String {
        match &self.0 {
            TokenPricingSchedule::SinglePrice(_) => String::from("SinglePrice"),
            TokenPricingSchedule::SetPrices(_) => String::from("SetPrices"),
        }
    }

    #[wasm_bindgen(js_name = "getValue")]
    pub fn get_value(&self) -> Result<JsValue, JsValue> {
        match &self.0 {
            TokenPricingSchedule::SinglePrice(credits) => {
                Ok(JsValue::bigint_from_str(&credits.to_string()))
            }
            TokenPricingSchedule::SetPrices(prices) => {
                let serializer = serde_wasm_bindgen::Serializer::json_compatible();

                prices.serialize(&serializer).map_err(JsValue::from)
            }
        }
    }
}
