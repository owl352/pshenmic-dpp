use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedIdentityNonceNAPI")]
pub struct VerifiedIdentityNonceNAPI {
    pub root_hash: Uint8Array,
    pub nonce: Option<BigIntString>,
}

#[napi(js_name = "verifyIdentityNonceProof")]
pub fn verify_identity_nonce(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityNonceNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, nonce) = Drive::verify_identity_nonce(
        &proof.to_vec(),
        identity_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityNonceNAPI {
        root_hash: root_hash.into(),
        nonce: nonce.map(BigIntString::from_u64),
    })
}
