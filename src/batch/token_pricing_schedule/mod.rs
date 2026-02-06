use dpp::fee::Credits;
use dpp::tokens::token_pricing_schedule::TokenPricingSchedule;
use dpp::{balances::credits::TokenAmount, platform_value::Value};
use napi::Either;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::{
    dynamic_value::{DynamicValue, TryToU64, Uint64String},
    utils::with_serde_to_platform_value_map,
};

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "TokenPricingScheduleNAPI")]
pub struct TokenPricingScheduleNAPI(TokenPricingSchedule);

impl From<TokenPricingScheduleNAPI> for TokenPricingSchedule {
    fn from(schedule: TokenPricingScheduleNAPI) -> Self {
        schedule.0
    }
}

impl From<TokenPricingSchedule> for TokenPricingScheduleNAPI {
    fn from(schedule: TokenPricingSchedule) -> Self {
        TokenPricingScheduleNAPI(schedule)
    }
}

#[napi]
impl TokenPricingScheduleNAPI {
    #[napi(js_name = "SinglePrice")]
    pub fn single_price(credits: Uint64String) -> Result<Self, napi::Error> {
        Ok(Self(TokenPricingSchedule::SinglePrice(
            credits.try_to_u64()?,
        )))
    }

    #[napi(js_name = "SetPrices")]
    pub fn set_prices(js_prices: &DynamicValue) -> Result<TokenPricingScheduleNAPI, napi::Error> {
        let prices: BTreeMap<TokenAmount, Credits> = with_serde_to_platform_value_map(js_prices)?
            .iter()
            .map(|(k, v)| {
                let amount: TokenAmount = k.try_to_u64()?;
                let option_credits: Option<&str> = v.as_text();

                match option_credits {
                    Some(credits) => Ok((amount, Uint64String::from(credits).try_to_u64()?)),
                    None => Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Cannot parse credits count",
                    )),
                }
            })
            .collect::<Result<BTreeMap<TokenAmount, Credits>, napi::Error>>()?;

        Ok(Self(TokenPricingSchedule::SetPrices(prices)))
    }

    #[napi(js_name = "getScheduleType")]
    pub fn get_scheduled_type(&self) -> String {
        match &self.0 {
            TokenPricingSchedule::SinglePrice(_) => String::from("SinglePrice"),
            TokenPricingSchedule::SetPrices(_) => String::from("SetPrices"),
        }
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> Result<Either<Uint64String, DynamicValue>, napi::Error> {
        Ok(match &self.0 {
            TokenPricingSchedule::SinglePrice(credits) => {
                Either::A(Uint64String::from_u64(credits.clone()))
            }
            TokenPricingSchedule::SetPrices(prices) => Either::B(
                Value::Map(
                    prices
                        .iter()
                        .map(|(k, v)| (Value::U64(k.clone().into()), Value::U64(v.clone().into())))
                        .collect(),
                )
                .try_into()?,
            ),
        })
    }
}
