use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    identity::IdentityNAPI,
};

#[napi(js_name = "VerifiedIdentityByIdentifierNAPI")]
pub struct VerifiedIdentityByIdentifierNAPI {
    pub root_hash: Uint8Array,
    identity: Option<IdentityNAPI>,
}

#[napi]
impl VerifiedIdentityByIdentifierNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> Option<IdentityNAPI> {
        self.identity.clone()
    }

    #[napi(setter, js_name = "identity")]
    pub fn set_identity(&mut self, identity: Option<&IdentityNAPI>) {
        self.identity = identity.map(|i| i.clone());
    }
}

#[napi(js_name = "verifyIdentityByIdentifierProof")]
pub fn verify_identity_by_identifier(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    is_proof_subset: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityByIdentifierNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, identity) = Drive::verify_full_identity_by_identity_id(
        &proof.to_vec(),
        is_proof_subset,
        identity_id.to_slice(),
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityByIdentifierNAPI {
        root_hash: root_hash.into(),
        identity: identity.map(IdentityNAPI::from),
    })
}
