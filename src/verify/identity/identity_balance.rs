use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedIdentityBalanceRootHashNAPI")]
pub struct VerifiedIdentityBalanceRootHashNAPI {
    pub root_hash: Uint8Array,
    pub balance: Option<BigIntString>,
}

#[napi(js_name = "verifyIdentityBalanceProof")]
pub fn verify_identity_balance(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentityBalanceRootHashNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, balance) = Drive::verify_identity_balance_for_identity_id(
        &proof.to_vec(),
        identity_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentityBalanceRootHashNAPI {
        root_hash: root_hash.into(),
        balance: balance.map(BigIntString::from_u64),
    })
}
