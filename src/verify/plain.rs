//! Shared plumbing for the verify functions whose results have no dedicated class: the
//! proven value crosses into JS as a plain object (see `serde_to_js`)

use std::fmt::Display;

use dpp::version::PlatformVersion;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::utils::serde_to_js;

#[napi(js_name = "VerifiedProofNAPI")]
pub struct VerifiedProofNAPI {
    pub root_hash: Uint8Array,
    pub(crate) value: DynamicValue,
}

#[napi]
impl VerifiedProofNAPI {
    #[napi(getter, js_name = "value")]
    pub fn value(&self) -> DynamicValue {
        self.value.clone()
    }
}

pub fn verified<T: serde::Serialize>(
    root_hash: [u8; 32],
    value: &T,
) -> Result<VerifiedProofNAPI, napi::Error> {
    Ok(VerifiedProofNAPI {
        root_hash: root_hash.to_vec().into(),
        value: serde_to_js(value)?,
    })
}

pub fn verify_error<E: Display>(err: E) -> napi::Error {
    napi::Error::new(napi::Status::GenericFailure, err.to_string())
}

pub fn platform_version_from_js(
    js_platform_version: &DynamicValue,
) -> Result<PlatformVersion, napi::Error> {
    Ok(match js_platform_version.is_undefined_or_null() {
        true => PlatformVersionNAPI::default(),
        false => PlatformVersionNAPI::try_from(js_platform_version)?,
    }
    .into())
}

pub fn identifier_from_js(
    js_identifier: IdentifierLikeNAPI,
) -> Result<dpp::prelude::Identifier, napi::Error> {
    Ok(IdentifierNAPI::try_from(js_identifier)?.into())
}
