use crate::utils::js_identities_to_rs_vec_of_slices;
use dpp::tokens::token_pricing_schedule::TokenPricingSchedule;
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::{Array, Object, Reflect, Uint8Array};
use pshenmic_dpp_batch::token_pricing_schedule::TokenPricingScheduleWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedTokenDirectPurchasePrices")]
pub struct VerifiedTokenDirectPurchasePrices {
    root_hash: RootHash,
    prices: Vec<([u8; 32], Option<TokenPricingSchedule>)>,
}

#[wasm_bindgen]
impl VerifiedTokenDirectPurchasePrices {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTokenDirectPurchasePrices".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTokenDirectPurchasePrices".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "prices")]
    pub fn prices(&self) -> Result<Option<Array>, JsValue> {
        match self.prices.len() > 0 {
            false => Ok(None),
            true => {
                let prices_array = Array::new();

                for (id, price) in self.prices.clone() {
                    let prices_obj = Object::new();

                    Reflect::set(
                        &prices_obj,
                        &"tokenId".into(),
                        &IdentifierWASM::from(id).into(),
                    )?;

                    Reflect::set(
                        &prices_obj,
                        &"price".into(),
                        &price.map(TokenPricingScheduleWASM::from).into(),
                    )?;

                    prices_array.push(&prices_obj);
                }

                Ok(Some(prices_array))
            }
        }
    }
}

#[wasm_bindgen(js_name = "verifyTokenDirectPurchasePrices")]
pub fn verify_token_direct_purchase_prices(
    proof: &Uint8Array,
    js_token_ids: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedTokenDirectPurchasePrices, JsValue> {
    let token_ids: Vec<[u8; 32]> = js_identities_to_rs_vec_of_slices(js_token_ids)?;

    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, prices): (RootHash, Vec<([u8; 32], Option<TokenPricingSchedule>)>) =
        Drive::verify_token_direct_selling_prices(
            &proof.to_vec(),
            &token_ids,
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedTokenDirectPurchasePrices { root_hash, prices })
}
