use dpp::version::PlatformVersion;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    identity::IdentityNAPI,
};

#[napi(js_name = "VerifiedFullIdentityByNonUniquePublicKeyHashNAPI")]
pub struct VerifiedFullIdentityByNonUniquePublicKeyHashNAPI {
    pub root_hash: Uint8Array,
    identity: Option<IdentityNAPI>,
}

#[napi]
impl VerifiedFullIdentityByNonUniquePublicKeyHashNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> Option<IdentityNAPI> {
        self.identity.clone()
    }

    #[napi(setter, js_name = "identity")]
    pub fn set_identity(&mut self, identity: Option<&IdentityNAPI>) {
        self.identity = identity.cloned();
    }
}

/// Verifies the single proof a v5 node returns for `getIdentityByNonUniquePublicKeyHash`
/// (`prove_full_identity_by_non_unique_public_key_hash`): the first identity id after
/// `after` holding the key hash, together with that full identity.
///
/// `query_platform_version` is the version the node built the query with (the response's
/// protocol version); `platform_version` selects the verification rules.
#[napi(js_name = "verifyFullIdentityByNonUniquePublicKeyHashProof")]
pub fn verify_full_identity_by_non_unique_public_key_hash(
    proof: Uint8Array,
    js_public_key_hash: Uint8Array,
    js_after: Option<IdentifierLikeNAPI>,
    js_query_platform_version: &DynamicValue,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedFullIdentityByNonUniquePublicKeyHashNAPI, napi::Error> {
    let public_key_hash: [u8; 20] = js_public_key_hash.to_vec().try_into().map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "Invalid public_key_hash length. Expected 20 bytes.",
        )
    })?;
    let after = js_after
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    let query_platform_version: PlatformVersion =
        PlatformVersionNAPI::try_from(js_query_platform_version)?.into();
    let platform_version: PlatformVersion =
        PlatformVersionNAPI::try_from(js_platform_version)?.into();

    let (root_hash, identity) = Drive::verify_full_identity_by_non_unique_public_key_hash(
        &proof,
        public_key_hash,
        after,
        &query_platform_version,
        &platform_version,
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedFullIdentityByNonUniquePublicKeyHashNAPI {
        root_hash: root_hash.into(),
        identity: identity.map(IdentityNAPI::from),
    })
}

/// Verifies the two proofs a v5 node returns for `getIdentityByNonUniquePublicKeyHash` V0:
/// `index_proof` proves the first identity id after `after` holding the key hash (or its
/// absence), `identity_proof` proves that full identity at the same root. `identity_proof`
/// is absent when nothing was found.
///
/// `query_platform_version` is the version the node built the query with (the response's
/// protocol version); `platform_version` selects the verification rules.
#[napi(js_name = "verifyFullIdentityByNonUniquePublicKeyHashTwoProofs")]
pub fn verify_full_identity_by_non_unique_public_key_hash_two_proofs(
    index_proof: Uint8Array,
    identity_proof: Option<Uint8Array>,
    js_public_key_hash: Uint8Array,
    js_after: Option<IdentifierLikeNAPI>,
    js_query_platform_version: &DynamicValue,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedFullIdentityByNonUniquePublicKeyHashNAPI, napi::Error> {
    let public_key_hash: [u8; 20] = js_public_key_hash.to_vec().try_into().map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "Invalid public_key_hash length. Expected 20 bytes.",
        )
    })?;
    let after = js_after
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    let query_platform_version: PlatformVersion =
        PlatformVersionNAPI::try_from(js_query_platform_version)?.into();
    let platform_version: PlatformVersion =
        PlatformVersionNAPI::try_from(js_platform_version)?.into();

    let (root_hash, identity) =
        Drive::verify_full_identity_by_non_unique_public_key_hash_two_proofs(
            &index_proof,
            identity_proof.as_deref(),
            public_key_hash,
            after,
            &query_platform_version,
            &platform_version,
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedFullIdentityByNonUniquePublicKeyHashNAPI {
        root_hash: root_hash.into(),
        identity: identity.map(IdentityNAPI::from),
    })
}
