use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedShieldedPoolStateNAPI")]
pub struct VerifiedShieldedPoolStateNAPI {
    pub root_hash: Uint8Array,
    pub total_balance: Option<BigIntString>,
}

#[napi(js_name = "verifyShieldedPoolStateProof")]
pub fn verify_shielded_pool_state(
    proof: Uint8Array,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
    js_token_id: Option<IdentifierLikeNAPI>,
) -> Result<VerifiedShieldedPoolStateNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let token_id = js_token_id
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    // `tokenId` selects that token's shielded pool; without it the credits pool.
    let (root_hash, total_balance) = match token_id {
        Some(token_id) => Drive::verify_token_shielded_pool_state(
            &proof,
            token_id,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
        None => Drive::verify_shielded_pool_state(
            &proof,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
    }
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedPoolStateNAPI {
        root_hash: root_hash.into(),
        total_balance: total_balance.map(BigIntString::from_u64),
    })
}
