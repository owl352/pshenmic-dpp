use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedShieldedAnchorsNAPI")]
pub struct VerifiedShieldedAnchorsNAPI {
    pub root_hash: Uint8Array,
    pub(crate) anchors: Vec<[u8; 32]>,
}

#[napi]
impl VerifiedShieldedAnchorsNAPI {
    #[napi(getter, js_name = "anchors")]
    pub fn anchors(&self) -> Vec<Uint8Array> {
        self.anchors
            .iter()
            .map(|a| Uint8Array::from(a.to_vec()))
            .collect()
    }
}

#[napi(js_name = "verifyShieldedAnchorsProof")]
pub fn verify_shielded_anchors(
    proof: Uint8Array,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
    js_token_id: Option<IdentifierLikeNAPI>,
) -> Result<VerifiedShieldedAnchorsNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let token_id = js_token_id
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    // `tokenId` selects that token's shielded pool; without it the credits pool.
    let (root_hash, anchors) = match token_id {
        Some(token_id) => Drive::verify_token_shielded_pool_anchors(
            &proof,
            token_id,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
        None => {
            Drive::verify_shielded_anchors(&proof, verify_subset_of_proof, &platform_version.into())
        }
    }
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedAnchorsNAPI {
        root_hash: root_hash.into(),
        anchors,
    })
}
