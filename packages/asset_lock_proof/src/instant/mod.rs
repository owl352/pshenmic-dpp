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
}
