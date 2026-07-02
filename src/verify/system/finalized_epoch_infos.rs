use dpp::block::finalized_epoch_info::{
    FinalizedEpochInfo, v0::getters::FinalizedEpochInfoGettersV0,
};
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[derive(Clone)]
#[napi(js_name = "FinalizedEpochInfoNAPI")]
pub struct FinalizedEpochInfoNAPI(FinalizedEpochInfo);

impl From<FinalizedEpochInfo> for FinalizedEpochInfoNAPI {
    fn from(value: FinalizedEpochInfo) -> Self {
        Self(value)
    }
}

#[napi]
impl FinalizedEpochInfoNAPI {
    #[napi(getter, js_name = "firstBlockTime")]
    pub fn first_block_time(&self) -> BigIntString {
        BigIntString::from_u64(self.0.first_block_time())
    }

    #[napi(getter, js_name = "firstBlockHeight")]
    pub fn first_block_height(&self) -> BigIntString {
        BigIntString::from_u64(self.0.first_block_height())
    }

    #[napi(getter, js_name = "totalBlocksInEpoch")]
    pub fn total_blocks_in_epoch(&self) -> BigIntString {
        BigIntString::from_u64(self.0.total_blocks_in_epoch())
    }

    #[napi(getter, js_name = "firstCoreBlockHeight")]
    pub fn first_core_block_height(&self) -> u32 {
        self.0.first_core_block_height()
    }

    #[napi(getter, js_name = "nextEpochStartCoreBlockHeight")]
    pub fn next_epoch_start_core_block_height(&self) -> u32 {
        self.0.next_epoch_start_core_block_height()
    }

    #[napi(getter, js_name = "totalProcessingFees")]
    pub fn total_processing_fees(&self) -> BigIntString {
        BigIntString::from_u64(self.0.total_processing_fees())
    }

    #[napi(getter, js_name = "totalDistributedStorageFees")]
    pub fn total_distributed_storage_fees(&self) -> BigIntString {
        BigIntString::from_u64(self.0.total_distributed_storage_fees())
    }

    #[napi(getter, js_name = "totalCreatedStorageFees")]
    pub fn total_created_storage_fees(&self) -> BigIntString {
        BigIntString::from_u64(self.0.total_created_storage_fees())
    }

    #[napi(getter, js_name = "coreBlockRewards")]
    pub fn core_block_rewards(&self) -> BigIntString {
        BigIntString::from_u64(self.0.core_block_rewards())
    }

    #[napi(getter, js_name = "blockProposers")]
    pub fn block_proposers(&self) -> Vec<(IdentifierNAPI, BigIntString)> {
        self.0
            .block_proposers()
            .iter()
            .map(|(k, v)| (k.clone().into(), BigIntString::from_u64(v.clone())))
            .collect()
    }

    #[napi(getter, js_name = "feeMultiplierPermille")]
    pub fn fee_multiplier_permille(&self) -> BigIntString {
        BigIntString::from_u64(self.0.fee_multiplier_permille())
    }

    #[napi(getter, js_name = "protocolVersion")]
    pub fn protocol_version(&self) -> u32 {
        self.0.protocol_version()
    }
}

#[napi(js_name = "VerifiedFinlizedEpochInfosNAPI")]
pub struct VerifiedFinlizedEpochInfosNAPI {
    pub root_hash: Uint8Array,
    epoch_info: Vec<(u16, FinalizedEpochInfoNAPI)>,
}

#[napi]
impl VerifiedFinlizedEpochInfosNAPI {
    #[napi(getter, js_name = "epochInfos")]
    pub fn get_epoch_infos(&self) -> Vec<(u16, FinalizedEpochInfoNAPI)> {
        self.epoch_info.clone()
    }
}

#[napi(js_name = "verifyFinalizedEpochInfosProof")]
pub fn verify_finalized_epoch_infos(
    proof: Uint8Array,
    start_epoch_index: u16,
    start_epoch_index_included: bool,
    end_epoch_index: u16,
    end_epoch_index_included: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedFinlizedEpochInfosNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, epoch_infos) = Drive::verify_finalized_epoch_infos(
        &proof.to_vec(),
        start_epoch_index,
        start_epoch_index_included,
        end_epoch_index,
        end_epoch_index_included,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedFinlizedEpochInfosNAPI {
        root_hash: root_hash.to_vec().into(),
        epoch_info: epoch_infos
            .iter()
            .map(|(k, v)| (k.clone(), v.clone().into()))
            .collect(),
    })
}
