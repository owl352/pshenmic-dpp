use dpp::block::epoch::EpochIndex;
use dpp::block::extended_epoch_info::ExtendedEpochInfo;
use dpp::block::extended_epoch_info::v0::ExtendedEpochInfoV0Getters;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "ExtendedEpochInfoWASM")]
pub struct ExtendedEpochInfoWASM(ExtendedEpochInfo);

impl From<ExtendedEpochInfo> for ExtendedEpochInfoWASM {
    fn from(info: ExtendedEpochInfo) -> ExtendedEpochInfoWASM {
        ExtendedEpochInfoWASM(info)
    }
}

#[wasm_bindgen]
impl ExtendedEpochInfoWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "ExtendedEpochInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "ExtendedEpochInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "index")]
    pub fn index(&self) -> EpochIndex {
        self.0.index()
    }

    #[wasm_bindgen(getter = "firstBlockTime")]
    pub fn first_block_time(&self) -> u64 {
        self.0.first_block_time()
    }

    #[wasm_bindgen(getter = "firstBlockHeight")]
    pub fn first_block_height(&self) -> u64 {
        self.0.first_block_height()
    }

    #[wasm_bindgen(getter = "firstCoreBlockHeight")]
    pub fn first_core_block_height(&self) -> u32 {
        self.0.first_core_block_height()
    }

    #[wasm_bindgen(getter = "feeMultiplierPermille")]
    pub fn fee_multiplier_permille(&self) -> u64 {
        self.0.fee_multiplier_permille()
    }

    #[wasm_bindgen(getter = "protocolVersion")]
    pub fn protocol_version(&self) -> u32 {
        self.0.protocol_version()
    }
}

#[wasm_bindgen(js_name = "VerifiedEpochsInfoWASM")]
pub struct VerifiedEpochsInfoWASM {
    root_hash: RootHash,
    epochs_info: Vec<ExtendedEpochInfoWASM>,
}

#[wasm_bindgen]
impl VerifiedEpochsInfoWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedEpochsInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedEpochsInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "epochsInfo")]
    pub fn epochs_info(&self) -> Vec<ExtendedEpochInfoWASM> {
        self.epochs_info.clone()
    }
}

#[wasm_bindgen(js_name = "verifyEpochsInfo")]
pub fn verify_epochs_info(
    proof: &Uint8Array,
    current_epoch: u16,
    start_epoch: Option<u16>,
    count: u16,
    ascending: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedEpochsInfoWASM, JsValue> {
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, epochs_info) = Drive::verify_epoch_infos(
        &proof.to_vec(),
        current_epoch,
        start_epoch,
        count,
        ascending,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedEpochsInfoWASM {
        root_hash,
        epochs_info: epochs_info
            .iter()
            .map(|epoch| ExtendedEpochInfoWASM::from(epoch.clone()))
            .collect(),
    })
}
