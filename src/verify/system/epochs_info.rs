use dpp::block::extended_epoch_info::ExtendedEpochInfo;
use dpp::block::extended_epoch_info::v0::ExtendedEpochInfoV0Getters;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{DynamicValue, TryToU64, Uint64String},
    enums::platform_version::PlatformVersionNAPI,
};

#[derive(Clone)]
#[napi(js_name = "ExtendedEpochInfoNAPI")]
pub struct ExtendedEpochInfoNAPI {
    pub index: u16,
    pub first_block_time: Uint64String,
    pub first_block_height: Uint64String,
    pub first_core_block_height: u32,
    pub fee_multiplier_permille: Uint64String,
    pub protocol_version: u32,
}

impl From<ExtendedEpochInfo> for ExtendedEpochInfoNAPI {
    fn from(info: ExtendedEpochInfo) -> ExtendedEpochInfoNAPI {
        ExtendedEpochInfoNAPI {
            index: info.index(),
            first_block_time: Uint64String::from_u64(info.first_block_time()),
            first_block_height: Uint64String::from_u64(info.first_block_height()),
            first_core_block_height: info.first_core_block_height(),
            fee_multiplier_permille: Uint64String::from_u64(info.fee_multiplier_permille()),
            protocol_version: info.protocol_version(),
        }
    }
}

#[napi(js_name = "VerifiedEpochsInfoNAPI")]
pub struct VerifiedEpochsInfoNAPI {
    pub root_hash: Uint8Array,
    epochs_info: Vec<ExtendedEpochInfoNAPI>,
}

#[napi]
impl VerifiedEpochsInfoNAPI {
    #[napi(getter, js_name = "epochsInfo")]
    pub fn epochs_info(&self) -> Vec<ExtendedEpochInfoNAPI> {
        self.epochs_info.clone()
    }

    #[napi(setter, js_name = "epochsInfo")]
    pub fn set_epochs_info(&mut self, info: Vec<&ExtendedEpochInfoNAPI>) {
        self.epochs_info = info.into_iter().map(|info| info.clone()).collect();
    }
}

#[napi(js_name = "verifyEpochsInfoProof")]
pub fn verify_epochs_info(
    proof: Uint8Array,
    current_epoch: u16,
    start_epoch: Option<u16>,
    count: u16,
    ascending: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedEpochsInfoNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, epochs_info) = Drive::verify_epoch_infos(
        &proof.to_vec(),
        current_epoch,
        start_epoch,
        count,
        ascending,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedEpochsInfoNAPI {
        root_hash: Uint8Array::from(root_hash),
        epochs_info: epochs_info
            .iter()
            .map(|epoch| ExtendedEpochInfoNAPI::from(epoch.clone()))
            .collect(),
    })
}
