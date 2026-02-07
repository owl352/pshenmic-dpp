use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::DynamicValue, enums::platform_version::PlatformVersionNAPI,
    identity::IdentityNAPI,
};

#[napi(js_name = "VerifiedIdentityByUniqueKeyHashNAPI")]
pub struct VerifiedIdentityByUniqueKeyHashNAPI {
    pub root_hash: Uint8Array,
    identity: Option<IdentityNAPI>,
}

#[napi]
impl VerifiedIdentityByUniqueKeyHashNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> Option<IdentityNAPI> {
        self.identity.clone()
    }

    #[napi(setter, js_name = "identity")]
    pub fn set_identity(&mut self, identity: Option<&IdentityNAPI>) {
        self.identity = identity.map(|identity| identity.clone());
    }
}

#[napi(js_name = "verifyIdentityByUniqueKeyHashProof")]
pub fn verify_identity_by_unique_public_key_hash(
    proof: Uint8Array,
    js_public_key_hash: Uint8Array,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityByUniqueKeyHashNAPI, napi::Error> {
    let public_key_hash: [u8; 20] = js_public_key_hash.to_vec().try_into().map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "Invalid public_key_hash length. Expected 20 bytes.",
        )
    })?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, identity) = Drive::verify_full_identity_by_unique_public_key_hash(
        &proof.to_vec(),
        public_key_hash,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityByUniqueKeyHashNAPI {
        root_hash: root_hash.into(),
        identity: identity.map(IdentityNAPI::from),
    })
}
