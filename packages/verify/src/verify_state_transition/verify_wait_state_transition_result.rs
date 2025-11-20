use crate::verify_system::verify_epochs_info::VerifiedEpochsInfoWASM;
use dpp::block::block_info::BlockInfo;
use dpp::block::epoch::{Epoch, EpochIndex};
use dpp::prelude::{BlockHeight, CoreBlockHeight, DataContract, Identifier, TimestampMillis};
use drive::drive::Drive;
use drive::query::ContractLookupFn;
use js_sys::{Array, Uint8Array};
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::{IntoWasm, WithJsError};
use std::collections::BTreeMap;
use std::sync::Arc;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "BlockInfoWASM")]
pub struct BlockInfoWASM(BlockInfo);

impl From<BlockInfo> for BlockInfoWASM {
    fn from(info: BlockInfo) -> Self {
        Self(info)
    }
}

impl From<BlockInfoWASM> for BlockInfo {
    fn from(info: BlockInfoWASM) -> Self {
        info.0
    }
}

#[wasm_bindgen]
impl BlockInfoWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        timestamp: TimestampMillis,
        height: BlockHeight,
        core_block_height: CoreBlockHeight,
        js_epoch_index: Option<EpochIndex>,
    ) -> Result<Self, JsValue> {
        let epoch = match js_epoch_index {
            Some(epoch_index) => Epoch::new(epoch_index).with_js_error()?,
            None => Epoch::default(),
        };

        Ok(BlockInfoWASM(BlockInfo {
            time_ms: timestamp,
            height,
            core_height: core_block_height,
            epoch,
        }))
    }

    #[wasm_bindgen(getter = "timeMs")]
    pub fn time_ms(&self) -> TimestampMillis {
        self.0.time_ms
    }

    #[wasm_bindgen(setter = "timeMs")]
    pub fn set_time_ms(&mut self, time_ms: TimestampMillis) {
        self.0.time_ms = time_ms
    }

    #[wasm_bindgen(getter = "height")]
    pub fn height(&self) -> BlockHeight {
        self.0.height
    }

    #[wasm_bindgen(setter = "height")]
    pub fn set_height(&mut self, height: BlockHeight) {
        self.0.height = height
    }

    #[wasm_bindgen(getter = "coreHeight")]
    pub fn core_height(&self) -> CoreBlockHeight {
        self.0.core_height
    }

    #[wasm_bindgen(setter = "coreHeight")]
    pub fn set_core_height(&mut self, core_height: CoreBlockHeight) {
        self.0.core_height = core_height
    }

    #[wasm_bindgen(getter = "epochIndex")]
    pub fn epoch_index(&self) -> EpochIndex {
        self.0.epoch.index
    }

    #[wasm_bindgen(setter = "epochIndex")]
    pub fn set_epoch_index(&mut self, epoch_index: EpochIndex) {
        self.0.epoch.index = epoch_index
    }

    #[wasm_bindgen(getter = "epochKey")]
    pub fn epoch_key(&self) -> Vec<u8> {
        self.0.epoch.key.to_vec()
    }

    #[wasm_bindgen(setter = "epochKey")]
    pub fn set_epoch_key(&mut self, epoch_key: Vec<u8>) -> Result<(), JsValue> {
        self.0.epoch.key = epoch_key
            .as_slice()
            .try_into()
            .map_err(|_| JsValue::from("Cannot conver epoch key bytes to slice"))?;
        Ok(())
    }
}

#[wasm_bindgen(js_name = "verifyStateTransitionResult")]
pub fn verify_state_transition_result(
    proof: &Uint8Array,
    state_transition: &StateTransitionWASM,
    block_info: &BlockInfoWASM,
    js_known_contracts_array: &JsValue,
    js_platform_version: &JsValue,
) -> Result<VerifiedEpochsInfoWASM, JsValue> {
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;
    let known_contracts = js_known_contracts_to_rs(js_known_contracts_array)?;

    let contract_lookup_fn: Box<ContractLookupFn> =
        Box::new(move |identifier: &Identifier| Ok(known_contracts.get(identifier).cloned()));

    let (root_hash, proof_result) = Drive::verify_state_transition_was_executed_with_proof(
        &state_transition.clone().into(),
        &block_info.clone().into(),
        &proof.to_vec(),
        &contract_lookup_fn,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;
}

fn js_known_contracts_to_rs(
    js_known_contracts_array: &JsValue,
) -> Result<BTreeMap<Identifier, Arc<DataContract>>, JsValue> {
    let mut out: BTreeMap<Identifier, Arc<DataContract>> = BTreeMap::new();

    let arr = Array::from(js_known_contracts_array);

    for js_contract in arr.iter() {
        let contract: DataContractWASM = js_contract
            .to_wasm::<DataContractWASM>("DataContractWASM")?
            .clone();
        let id: IdentifierWASM = contract.get_id();

        out.insert(id.into(), Arc::new(DataContract::from(contract)));
    }

    Ok(out)
}
