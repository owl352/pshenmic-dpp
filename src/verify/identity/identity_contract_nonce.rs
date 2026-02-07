use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedIdentityContractNonceNAPI")]
pub struct VerifiedIdentityContractNonceNAPI {
    pub root_hash: Uint8Array,
    pub contract_nonce: Option<BigIntString>,
}

#[napi(js_name = "verifyIdentityContractNonceProof")]
pub fn verify_identity_contract_nonce(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    js_contract_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityContractNonceNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let contract_id = IdentifierNAPI::try_from(js_contract_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, contract_nonce) = Drive::verify_identity_contract_nonce(
        &proof.to_vec(),
        identity_id.to_slice(),
        contract_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityContractNonceNAPI {
        root_hash: Uint8Array::from(root_hash),
        contract_nonce: contract_nonce.map(BigIntString::from_u64),
    })
}
