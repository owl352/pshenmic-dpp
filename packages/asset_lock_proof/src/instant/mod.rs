mod instant_lock;

use crate::instant::instant_lock::InstantLockWASM;
use crate::outpoint::OutPointWASM;
use crate::tx_out::TxOutWASM;
use dpp::identity::state_transition::asset_lock_proof::{
    InstantAssetLockProof, RawInstantLockProof,
};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "InstantAssetLockProofWASM")]
pub struct InstantAssetLockProofWASM(InstantAssetLockProof);

impl From<InstantAssetLockProofWASM> for InstantAssetLockProof {
    fn from(proof: InstantAssetLockProofWASM) -> Self {
        proof.0
    }
}

impl From<InstantAssetLockProof> for InstantAssetLockProofWASM {
    fn from(proof: InstantAssetLockProof) -> Self {
        InstantAssetLockProofWASM(proof)
    }
}

#[wasm_bindgen]
impl InstantAssetLockProofWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(raw_parameters: JsValue) -> Result<InstantAssetLockProofWASM, JsValue> {
        let raw_instant_lock: RawInstantLockProof = serde_wasm_bindgen::from_value(raw_parameters)
            .map_err(|_| JsError::new("invalid raw instant lock proof"))?;

        let instant_asset_lock_proof: InstantAssetLockProof = raw_instant_lock
            .try_into()
            .map_err(|_| JsError::new("object passed is not a raw Instant Lock"))?;

        Ok(InstantAssetLockProofWASM(instant_asset_lock_proof))
    }

    #[wasm_bindgen(js_name = "getOutput")]
    pub fn get_output(&self) -> Option<TxOutWASM> {
        match self.0.output() {
            Some(output) => Some(output.clone().into()),
            None => None,
        }
    }

    #[wasm_bindgen(js_name = "getOutPoint")]
    pub fn get_out_point(&self) -> Option<OutPointWASM> {
        match self.0.out_point() {
            Some(output) => Some(output.clone().into()),
            None => None,
        }
    }

    #[wasm_bindgen(getter = "outputIndex")]
    pub fn get_output_index(&self) -> u32 {
        self.0.output_index()
    }

    #[wasm_bindgen(getter = "instantLock")]
    pub fn get_instant_lock(&self) -> InstantLockWASM {
        self.0.instant_lock.clone().into()
    }

    #[wasm_bindgen(setter = "outputIndex")]
    pub fn set_output_index(&mut self, output_index: u32) {
        self.0.output_index = output_index;
    }

    #[wasm_bindgen(setter = "instantLock")]
    pub fn set_instant_lock(&mut self, instant_lock: InstantLockWASM) {
        self.0.instant_lock = instant_lock.into();
    }
}
