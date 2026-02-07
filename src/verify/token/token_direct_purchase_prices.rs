use dpp::tokens::token_pricing_schedule::TokenPricingSchedule;
use drive::{drive::Drive, verify::RootHash};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    verify::state_transition::entities::VerifiedTokenPricingScheduleNAPI,
};

#[napi(js_name = "VerifiedTokenDirectPurchasePricesNAPI")]
pub struct VerifiedTokenDirectPurchasePricesNAPI {
    pub root_hash: Uint8Array,
    prices: Vec<VerifiedTokenPricingScheduleNAPI>,
}

#[napi]
impl VerifiedTokenDirectPurchasePricesNAPI {
    #[napi(getter, js_name = "prices")]
    pub fn prices(&self) -> Vec<VerifiedTokenPricingScheduleNAPI> {
        self.prices.clone()
    }
}

#[napi(js_name = "verifyTokenDirectPurchasePrices")]
pub fn verify_token_direct_purchase_prices(
    proof: Uint8Array,
    js_token_ids: Vec<IdentifierLikeNAPI>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTokenDirectPurchasePricesNAPI, napi::Error> {
    let token_ids: Vec<[u8; 32]> = js_token_ids
        .into_iter()
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .collect::<Result<Vec<[u8; 32]>, napi::Error>>()?;

    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, prices): (RootHash, Vec<([u8; 32], Option<TokenPricingSchedule>)>) =
        Drive::verify_token_direct_selling_prices(
            &proof.to_vec(),
            &token_ids,
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    let js_prices = prices
        .into_iter()
        .map(|(id, price)| VerifiedTokenPricingScheduleNAPI {
            id: id.into(),
            pricing_sheldule: price.map(|p| p.into()),
        })
        .collect::<Vec<VerifiedTokenPricingScheduleNAPI>>();

    Ok(VerifiedTokenDirectPurchasePricesNAPI {
        root_hash: root_hash.into(),
        prices: js_prices,
    })
}
