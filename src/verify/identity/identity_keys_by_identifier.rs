use drive::drive::Drive;
use drive::drive::identity::key::fetch::{IdentityKeysRequest, KeyRequestType};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::partial_identity::PartialIdentityNAPI;

#[napi(js_name = "VerifiedIdentityKeysByIdentifierNAPI")]
pub struct VerifiedIdentityKeysByIdentifierNAPI {
    pub root_hash: Uint8Array,
    identity: Option<PartialIdentityNAPI>,
}

#[napi]
impl VerifiedIdentityKeysByIdentifierNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> Option<PartialIdentityNAPI> {
        self.identity.clone()
    }

    #[napi(setter, js_name = "identity")]
    pub fn set_identity(&mut self, identity: Option<&PartialIdentityNAPI>) {
        self.identity = identity.map(PartialIdentityNAPI::clone);
    }
}
#[napi(js_name = "verifyIdentityKeysByIdentifierProof")]
pub fn verify_identity_keys_by_identifier(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    specific_key_ids: Option<Vec<u32>>,
    with_revision: bool,
    with_balance: bool,
    is_proof_subset: bool,
    limit: Option<u16>,
    offset: Option<u16>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityKeysByIdentifierNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let request_type = match specific_key_ids {
        None => KeyRequestType::AllKeys,
        Some(keys) => KeyRequestType::SpecificKeys(keys),
    };

    let key_request = IdentityKeysRequest {
        identity_id: identity_id.to_slice(),
        request_type,
        limit,
        offset,
    };

    let (root_hash, identity) = Drive::verify_identity_keys_by_identity_id(
        &proof.to_vec(),
        key_request,
        with_revision,
        with_balance,
        is_proof_subset,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityKeysByIdentifierNAPI {
        root_hash: root_hash.into(),
        identity: identity.map(PartialIdentityNAPI::from),
    })
}
