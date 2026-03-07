use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, PlatformAddressLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    platform_address::PlatformAddressNAPI,
};

#[napi(js_name = "VerifiedAddressInfoNAPI")]
pub struct VerifiedAddressInfoNAPI {
    pub root_hash: Uint8Array,
    pub(crate) address: PlatformAddressNAPI,
    pub nonce: Option<u32>,
    pub balance: Option<BigIntString>,
}

#[napi]
impl VerifiedAddressInfoNAPI {
    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }
}

#[napi(js_name = "verifyAddressInfo")]
pub fn verify_address_info(
    proof: Uint8Array,
    js_platform_address: PlatformAddressLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedAddressInfoNAPI, napi::Error> {
    let platform_address = PlatformAddressNAPI::try_from(js_platform_address)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, info) = Drive::verify_address_info(
        proof.to_vec().as_slice(),
        &platform_address.clone().into(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedAddressInfoNAPI {
        root_hash: root_hash.into(),
        address: platform_address,
        nonce: info.map(|i| i.0),
        balance: info.map(|i| BigIntString::from_u64(i.1)),
    })
}
