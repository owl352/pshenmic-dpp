pub mod chain;
pub mod instant;
pub mod outpoint;
mod tx_out;

use crate::chain::ChainAssetLockProofWASM;
use crate::instant::InstantAssetLockProofWASM;
use dpp::identity::state_transition::asset_lock_proof::InstantAssetLockProof;

use crate::outpoint::OutPointWASM;
use dpp::prelude::AssetLockProof;
use pshenmic_dpp_enums::lock_types::AssetLockProofTypeWASM;
use pshenmic_dpp_utils::WithJsError;
use serde::Serialize;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

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
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "AssetLockProofWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "AssetLockProofWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(js_asset_lock_proof_type: JsValue) -> Result<AssetLockProofWASM, JsValue> {
        let asset_lock_proof_type = AssetLockProofTypeWASM::try_from(js_asset_lock_proof_type)?;

        match asset_lock_proof_type {
            AssetLockProofTypeWASM::Chain => Err(JsValue::from_str(&"ChainLock unavailable")),
            AssetLockProofTypeWASM::Instant => {
                Ok(InstantAssetLockProofWASM::from(InstantAssetLockProof::default()).into())
            }
        }
    }

    #[wasm_bindgen(js_name = "createInstantAssetLockProof")]
    pub fn new_instant_asset_lock_proof(
        instant_lock: Vec<u8>,
        transaction: Vec<u8>,
        output_index: u32,
    ) -> Result<AssetLockProofWASM, JsValue> {
        Ok(InstantAssetLockProofWASM::new(instant_lock, transaction, output_index)?.into())
    }

    #[wasm_bindgen(js_name = "createChainAssetLockProof")]
    pub fn new_chain_asset_lock_proof(
        core_chain_locked_height: u32,
        out_point: &OutPointWASM,
    ) -> Result<AssetLockProofWASM, JsValue> {
        Ok(ChainAssetLockProofWASM::new(core_chain_locked_height, out_point)?.into())
    }

    #[wasm_bindgen(js_name = "getLockType")]
    pub fn get_lock_type(&self) -> String {
        match self.0 {
            AssetLockProof::Chain(_) => AssetLockProofTypeWASM::Chain.into(),
            AssetLockProof::Instant(_) => AssetLockProofTypeWASM::Instant.into(),
        }
    }

    #[wasm_bindgen(js_name = "getInstantLockProof")]
    pub fn get_instant_lock(&self) -> InstantAssetLockProofWASM {
        self.clone().0.into()
    }

    #[wasm_bindgen(js_name = "getChainLockProof")]
    pub fn get_chain_lock(&self) -> ChainAssetLockProofWASM {
        self.clone().0.into()
    }

    #[wasm_bindgen(js_name = "getOutPoint")]
    pub fn get_out_point(&self) -> Option<OutPointWASM> {
        match self.0.out_point() {
            Some(out_point) => Some(OutPointWASM::from(out_point)),
            None => None,
        }
    }

    #[wasm_bindgen(js_name = "toObject")]
    pub fn to_object(&self) -> Result<JsValue, JsValue> {
        let json_value = self.0.to_raw_object().with_js_error()?;

        Ok(json_value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())?)
    }

    #[wasm_bindgen(js_name = "hex")]
    pub fn to_string(&self) -> Result<String, JsValue> {
        Ok(hex::encode(
            serde_json::to_string(&self.0).map_err(|err| JsValue::from(err.to_string()))?,
        ))
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(asset_lock_proof: String) -> Result<AssetLockProofWASM, JsValue> {
        let asset_lock_proof_bytes = hex::decode(&asset_lock_proof)
            .map_err(|e| JsValue::from_str(&format!("Invalid asset lock proof hex: {}", e)))?;

        let json_str = String::from_utf8(asset_lock_proof_bytes)
            .map_err(|e| JsValue::from_str(&format!("Invalid UTF-8 in asset lock proof: {}", e)))?;

        let asset_lock_proof = serde_json::from_str(&json_str).map_err(|e| {
            JsValue::from_str(&format!("Failed to parse asset lock proof JSON: {}", e))
        })?;

        Ok(AssetLockProofWASM(asset_lock_proof))
    }
}
