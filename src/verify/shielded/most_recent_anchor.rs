use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

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
    js_token_id: Option<IdentifierLikeNAPI>,
) -> Result<VerifiedMostRecentShieldedAnchorNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let token_id = js_token_id
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    // `tokenId` selects that token's shielded pool; without it the credits pool.
    let (root_hash, anchor) = match token_id {
        Some(token_id) => Drive::verify_most_recent_token_shielded_pool_anchor(
            &proof,
            token_id,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
        None => Drive::verify_most_recent_shielded_anchor(
            &proof,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
    }
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedMostRecentShieldedAnchorNAPI {
        root_hash: root_hash.into(),
        anchor: anchor.map(|a| a.to_vec().into()),
    })
}
