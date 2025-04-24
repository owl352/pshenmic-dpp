pub mod chain;
pub mod instant;
pub mod outpoint;
mod tx_out;

use crate::chain::ChainAssetLockProofWASM;
use crate::instant::InstantAssetLockProofWASM;

use dpp::prelude::AssetLockProof;
use pshenmic_dpp_enums::lock_types::AssetLockProofTypeWASM;
use pshenmic_dpp_utils::WithJsError;
use serde::Serialize;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "AssetLockProofWASM")]
#[derive(Clone)]
pub struct AssetLockProofWASM(AssetLockProof);

impl From<AssetLockProofWASM> for AssetLockProof {
    fn from(proof: AssetLockProofWASM) -> Self {
        proof.0
    }
}

impl From<AssetLockProof> for AssetLockProofWASM {
    fn from(proof: AssetLockProof) -> Self {
        AssetLockProofWASM(proof)
    }
}

impl From<ChainAssetLockProofWASM> for AssetLockProofWASM {
    fn from(proof: ChainAssetLockProofWASM) -> Self {
        AssetLockProofWASM(AssetLockProof::Chain(proof.into()))
    }
}

impl From<InstantAssetLockProofWASM> for AssetLockProofWASM {
    fn from(proof: InstantAssetLockProofWASM) -> Self {
        AssetLockProofWASM(AssetLockProof::Instant(proof.into()))
    }
}

impl From<AssetLockProof> for ChainAssetLockProofWASM {
    fn from(proof: AssetLockProof) -> ChainAssetLockProofWASM {
        match proof {
            AssetLockProof::Chain(chain) => ChainAssetLockProofWASM::from(chain),
            _ => panic!("invalid asset lock proof. must contains chain lock"),
        }
    }
}

impl From<AssetLockProof> for InstantAssetLockProofWASM {
    fn from(proof: AssetLockProof) -> InstantAssetLockProofWASM {
        match proof {
            AssetLockProof::Instant(instant) => InstantAssetLockProofWASM::from(instant),
            _ => panic!("invalid asset lock proof. must contains chain lock"),
        }
    }
}

#[wasm_bindgen]
impl AssetLockProofWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(raw_asset_lock_proof: JsValue) -> Result<AssetLockProofWASM, JsValue> {
        let lock_type = get_type_from_raw_asset_lock_proof(&raw_asset_lock_proof)?;

        match lock_type {
            AssetLockProofTypeWASM::Instant => {
                Ok(InstantAssetLockProofWASM::new(raw_asset_lock_proof)?.into())
            }
            AssetLockProofTypeWASM::Chain => {
                Ok(ChainAssetLockProofWASM::new(raw_asset_lock_proof)?.into())
            }
        }
    }

    #[wasm_bindgen(js_name = "getLockType")]
    pub fn get_lock_type(&self) -> String {
        match self.0 {
            AssetLockProof::Chain(_) => AssetLockProofTypeWASM::Chain.into(),
            AssetLockProof::Instant(_) => AssetLockProofTypeWASM::Instant.into(),
        }
    }

    #[wasm_bindgen(js_name = "toObject")]
    pub fn to_object(&self) -> Result<JsValue, JsValue> {
        let json_value = self.0.to_raw_object().with_js_error()?;

        Ok(json_value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())?)
    }
}

fn get_type_from_raw_asset_lock_proof(
    raw_asset_lock_proof: &JsValue,
) -> Result<AssetLockProofTypeWASM, JsError> {
    let proof_type = js_sys::Reflect::get(raw_asset_lock_proof, &JsValue::from_str("type"))
        .map_err(|_| JsError::new("error getting type from raw asset lock"))?
        .as_f64()
        .ok_or_else(|| JsError::new("asset lock type must be a number"))?;

    (proof_type as u64)
        .try_into()
        .map_err(|_| JsError::new("unrecognized asset lock proof type"))
}
