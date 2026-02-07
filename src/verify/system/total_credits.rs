use dpp::prelude::CoreBlockHeight;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
};

#[napi(js_name = "VerifiedTotalCreditsNAPI")]
pub struct VerifiedTotalCreditsWASM {
    pub root_hash: Uint8Array,
    pub total_credits: BigIntString,
}

#[napi(js_name = "verifyTotalCreditsProof")]
pub fn verify_total_credits(
    proof: Uint8Array,
    core_subsidy_halving_interval: u32,
    activation_core_height: u32,
    current_core_height: u32,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTotalCreditsWASM, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let request_activation_core_height =
        || -> Result<CoreBlockHeight, drive::error::Error> { Ok(activation_core_height) };

    let (root_hash, total_credits) = Drive::verify_total_credits_in_system(
        &proof.to_vec(),
        core_subsidy_halving_interval,
        request_activation_core_height,
        current_core_height,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedTotalCreditsWASM {
        root_hash: Uint8Array::from(root_hash),
        total_credits: BigIntString::from_u64(total_credits),
    })
}
