use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedShieldedNullifierNAPI")]
pub struct VerifiedShieldedNullifierNAPI {
    pub nullifier: Uint8Array,
    pub is_spent: bool,
}

#[napi(js_name = "VerifiedShieldedNullifiersNAPI")]
pub struct VerifiedShieldedNullifiersNAPI {
    pub root_hash: Uint8Array,
    pub(crate) nullifiers: Vec<(Vec<u8>, bool)>,
}

#[napi]
impl VerifiedShieldedNullifiersNAPI {
    #[napi(getter, js_name = "nullifiers")]
    pub fn nullifiers(&self) -> Vec<VerifiedShieldedNullifierNAPI> {
        self.nullifiers
            .iter()
            .map(|(nullifier, is_spent)| VerifiedShieldedNullifierNAPI {
                nullifier: Uint8Array::from(nullifier.clone()),
                is_spent: *is_spent,
            })
            .collect()
    }
}

#[napi(js_name = "verifyShieldedNullifiersProof")]
pub fn verify_shielded_nullifiers(
    proof: Uint8Array,
    nullifiers: Vec<Uint8Array>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
    js_token_id: Option<IdentifierLikeNAPI>,
) -> Result<VerifiedShieldedNullifiersNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let rs_nullifiers: Vec<Vec<u8>> = nullifiers.iter().map(|n| n.to_vec()).collect();

    let token_id = js_token_id
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    // `tokenId` selects that token's shielded pool; without it the credits pool.
    let (root_hash, nullifiers) = match token_id {
        Some(token_id) => Drive::verify_token_shielded_pool_nullifiers(
            &proof,
            token_id,
            &rs_nullifiers,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
        None => Drive::verify_shielded_nullifiers(
            &proof,
            &rs_nullifiers,
            verify_subset_of_proof,
            &platform_version.into(),
        ),
    }
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedNullifiersNAPI {
        root_hash: root_hash.into(),
        nullifiers,
    })
}
