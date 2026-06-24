use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
};

#[napi(js_name = "VerifiedShieldedPoolStateNAPI")]
pub struct VerifiedShieldedPoolStateNAPI {
    pub root_hash: Uint8Array,
    pub total_balance: Option<BigIntString>,
}

#[napi(js_name = "verifyShieldedPoolStateProof")]
pub fn verify_shielded_pool_state(
    proof: Uint8Array,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedShieldedPoolStateNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, total_balance) = Drive::verify_shielded_pool_state(
        &proof.to_vec(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedPoolStateNAPI {
        root_hash: root_hash.into(),
        total_balance: total_balance.map(BigIntString::from_u64),
    })
}
