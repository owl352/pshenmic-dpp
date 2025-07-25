use crate::outpoint::OutPointWASM;
use dpp::identity::state_transition::asset_lock_proof::chain::ChainAssetLockProof;
use serde::Deserialize;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChainAssetLockProofParams {
    core_chain_locked_height: u32,
    out_point: Vec<u8>,
}

#[wasm_bindgen(js_name = "ChainAssetLockProofWASM")]
pub struct ChainAssetLockProofWASM(ChainAssetLockProof);

impl From<ChainAssetLockProofWASM> for ChainAssetLockProof {
    fn from(chain_lock: ChainAssetLockProofWASM) -> Self {
        chain_lock.0
    }
}

impl From<ChainAssetLockProof> for ChainAssetLockProofWASM {
    fn from(chain_lock: ChainAssetLockProof) -> Self {
        ChainAssetLockProofWASM(chain_lock)
    }
}

#[wasm_bindgen]
impl ChainAssetLockProofWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "ChainAssetLockProofWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "ChainAssetLockProofWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        core_chain_locked_height: u32,
        out_point: &OutPointWASM,
    ) -> Result<ChainAssetLockProofWASM, JsValue> {
        Ok(ChainAssetLockProofWASM(ChainAssetLockProof {
            core_chain_locked_height,
            out_point: out_point.clone().into(),
        }))
    }

    #[wasm_bindgen(js_name = "fromRawObject")]
    pub fn from_raw_value(
        raw_asset_lock_proof: JsValue,
    ) -> Result<ChainAssetLockProofWASM, JsValue> {
        let parameters: ChainAssetLockProofParams =
            serde_wasm_bindgen::from_value(raw_asset_lock_proof)
                .map_err(|err| JsError::from(err))?;

        let out_point: [u8; 36] = parameters
            .out_point
            .try_into()
            .map_err(|_| JsError::new("outPoint must be a 36 byte array"))?;

        let rs_proof = ChainAssetLockProof::new(parameters.core_chain_locked_height, out_point);

        Ok(ChainAssetLockProofWASM(rs_proof))
    }

    #[wasm_bindgen(setter = "coreChainLockedHeight")]
    pub fn set_core_chain_locked_height(&mut self, core_chain_locked_height: u32) {
        self.0.core_chain_locked_height = core_chain_locked_height;
    }

    #[wasm_bindgen(setter = "outPoint")]
    pub fn set_out_point(&mut self, outpoint: &OutPointWASM) {
        self.0.out_point = outpoint.clone().into();
    }

    #[wasm_bindgen(getter = "coreChainLockedHeight")]
    pub fn get_core_chain_locked_height(self) -> u32 {
        self.0.core_chain_locked_height
    }

    #[wasm_bindgen(getter = "outPoint")]
    pub fn get_out_point(self) -> OutPointWASM {
        self.0.out_point.into()
    }
}
