use dpp::{address_funds::PlatformAddress, fee::Credits, prelude::AddressNonce};
use drive::{drive::Drive, verify::RootHash};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, PlatformAddressLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    platform_address::PlatformAddressNAPI,
    verify::state_transition::entities::PlatformAddressInfoNAPI,
};

#[napi(js_name = "VerifiedPlatformAddressesInfosNAPI")]
pub struct VerifiedPlatformAddressesInfosNAPI {
    pub root_hash: Uint8Array,
    pub(crate) infos: Vec<PlatformAddressInfoNAPI>,
}

#[napi]
impl VerifiedPlatformAddressesInfosNAPI {
    #[napi(getter, js_name = "infos")]
    pub fn infos(&self) -> Vec<PlatformAddressInfoNAPI> {
        self.infos.clone()
    }
}

#[napi(js_name = "verifyAddressesInfos")]
pub fn verify_addresses_infos(
    proof: Uint8Array,
    js_platform_addresses: Vec<PlatformAddressLikeNAPI>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedPlatformAddressesInfosNAPI, napi::Error> {
    let platform_address: Vec<PlatformAddressNAPI> = js_platform_addresses
        .iter()
        .map(|addr| PlatformAddressNAPI::try_from(addr.clone()))
        .collect::<Result<Vec<PlatformAddressNAPI>, napi::Error>>()?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let rs_platform_addresses: Vec<PlatformAddress> = platform_address
        .clone()
        .iter()
        .map(|address| PlatformAddress::from(address.clone()))
        .collect();

    let (root_hash, infos): (
        RootHash,
        Vec<(PlatformAddress, Option<(AddressNonce, Credits)>)>,
    ) = Drive::verify_addresses_infos(
        proof.to_vec().as_slice(),
        &rs_platform_addresses,
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedPlatformAddressesInfosNAPI {
        root_hash: root_hash.into(),
        infos: infos
            .iter()
            .map(|(addr, info)| PlatformAddressInfoNAPI {
                address: addr.clone().into(),
                nonce: info.map(|i| i.0),
                balance: info.map(|i| BigIntString::from_u64(i.1)),
            })
            .collect(),
    })
}
