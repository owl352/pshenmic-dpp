use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
};

#[napi(js_name = "VerifiedShieldedNotesCountNAPI")]
pub struct VerifiedShieldedNotesCountNAPI {
    pub root_hash: Uint8Array,
    pub count: Option<BigIntString>,
}

#[napi(js_name = "verifyShieldedNotesCountProof")]
pub fn verify_shielded_notes_count(
    proof: Uint8Array,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedShieldedNotesCountNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, count) = Drive::verify_shielded_notes_count(
        &proof.to_vec(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedNotesCountNAPI {
        root_hash: root_hash.into(),
        count: count.map(BigIntString::from_u64),
    })
}
