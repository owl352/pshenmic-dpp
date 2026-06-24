use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{dynamic_value::DynamicValue, enums::platform_version::PlatformVersionNAPI};

#[napi(js_name = "VerifiedMostRecentShieldedAnchorNAPI")]
pub struct VerifiedMostRecentShieldedAnchorNAPI {
    pub root_hash: Uint8Array,
    pub anchor: Option<Uint8Array>,
}

#[napi(js_name = "verifyMostRecentShieldedAnchorProof")]
pub fn verify_most_recent_shielded_anchor(
    proof: Uint8Array,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedMostRecentShieldedAnchorNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, anchor) = Drive::verify_most_recent_shielded_anchor(
        &proof.to_vec(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedMostRecentShieldedAnchorNAPI {
        root_hash: root_hash.into(),
        anchor: anchor.map(|a| a.to_vec().into()),
    })
}
