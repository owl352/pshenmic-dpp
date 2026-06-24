use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{dynamic_value::DynamicValue, enums::platform_version::PlatformVersionNAPI};

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
) -> Result<VerifiedShieldedAnchorsNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, anchors) = Drive::verify_shielded_anchors(
        &proof.to_vec(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedAnchorsNAPI {
        root_hash: root_hash.into(),
        anchors,
    })
}
