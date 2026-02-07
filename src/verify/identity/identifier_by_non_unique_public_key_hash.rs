use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[napi(js_name = "VerifiedIdentifierByNonUniquePublicKeyHashNAPI")]
pub struct VerifiedIdentifierByNonUniquePublicKeyHashNAPI {
    pub root_hash: Uint8Array,
    identifier: Option<IdentifierNAPI>,
}

#[napi]
impl VerifiedIdentifierByNonUniquePublicKeyHashNAPI {
    #[napi(getter, js_name = "identifier")]
    pub fn identifier(&self) -> Option<IdentifierNAPI> {
        self.identifier.clone()
    }

    #[napi(setter, js_name = "identifier")]
    pub fn set_identifier(
        &mut self,
        identifier: Option<IdentifierLikeNAPI>,
    ) -> Result<(), napi::Error> {
        self.identifier = identifier.map(|id| id.try_into()).transpose()?;

        Ok(())
    }
}

#[napi(js_name = "verifyIdentifierByNonUniquePublicKeyHashProof")]
pub fn verify_identifier_by_non_unique_public_key_hash(
    proof: Uint8Array,
    is_proof_subset: bool,
    js_public_key_hash: Uint8Array,
    js_after: Option<IdentifierLikeNAPI>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedIdentifierByNonUniquePublicKeyHashNAPI, napi::Error> {
    let public_key_hash: [u8; 20] = js_public_key_hash.to_vec().try_into().map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "Invalid public_key_hash length. Expected 20 bytes.",
        )
    })?;
    let after = js_after
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .transpose()?;

    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, identifier) = Drive::verify_identity_id_by_non_unique_public_key_hash(
        &proof.to_vec(),
        is_proof_subset,
        public_key_hash,
        after,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedIdentifierByNonUniquePublicKeyHashNAPI {
        root_hash: root_hash.into(),
        identifier: identifier.map(IdentifierNAPI::from),
    })
}
