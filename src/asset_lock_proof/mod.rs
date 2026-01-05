pub mod chain_lock;
pub mod instant_lock;
pub mod outpoint;
pub mod transaction;
pub mod tx_in;
pub mod tx_out;
pub mod witness;

use crate::{
    asset_lock_proof::{
        chain_lock::ChainAssetLockProofNAPI, instant_lock::InstantAssetLockProofNAPI,
        outpoint::OutPointNAPI,
    },
    enums::lock_types::AssetLockProofTypeNAPI,
    identifier::IdentifierNAPI,
    utils::WithJsError,
};
use dpp::prelude::AssetLockProof;
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;

#[napi(js_name = "AssetLockProofNAPI")]
#[derive(Clone)]
pub struct AssetLockProofNAPI(AssetLockProof);

impl From<AssetLockProofNAPI> for AssetLockProof {
    fn from(proof: AssetLockProofNAPI) -> Self {
        proof.0
    }
}

impl From<AssetLockProof> for AssetLockProofNAPI {
    fn from(proof: AssetLockProof) -> Self {
        AssetLockProofNAPI(proof)
    }
}

impl From<ChainAssetLockProofNAPI> for AssetLockProofNAPI {
    fn from(proof: ChainAssetLockProofNAPI) -> Self {
        AssetLockProofNAPI(AssetLockProof::Chain(proof.into()))
    }
}

impl From<InstantAssetLockProofNAPI> for AssetLockProofNAPI {
    fn from(proof: InstantAssetLockProofNAPI) -> Self {
        AssetLockProofNAPI(AssetLockProof::Instant(proof.into()))
    }
}

impl From<AssetLockProof> for ChainAssetLockProofNAPI {
    fn from(proof: AssetLockProof) -> ChainAssetLockProofNAPI {
        match proof {
            AssetLockProof::Chain(chain) => ChainAssetLockProofNAPI::from(chain),
            _ => panic!("invalid asset lock proof. must contains chain lock"),
        }
    }
}

impl From<AssetLockProof> for InstantAssetLockProofNAPI {
    fn from(proof: AssetLockProof) -> InstantAssetLockProofNAPI {
        match proof {
            AssetLockProof::Instant(instant) => InstantAssetLockProofNAPI::from(instant),
            _ => panic!("invalid asset lock proof. must contains chain lock"),
        }
    }
}

#[napi]
impl AssetLockProofNAPI {
    #[napi(constructor)]
    pub fn new(
        js_asset_lock_proof: Either<&ChainAssetLockProofNAPI, &InstantAssetLockProofNAPI>,
    ) -> AssetLockProofNAPI {
        match js_asset_lock_proof {
            Either::A(chain_lock) => AssetLockProofNAPI::from(chain_lock.clone()),
            Either::B(instant_lock) => AssetLockProofNAPI::from(instant_lock.clone()),
        }
    }

    #[napi(js_name = "createInstantAssetLockProof")]
    pub fn new_instant_asset_lock_proof(
        instant_lock: Uint8Array,
        transaction: Uint8Array,
        output_index: u32,
    ) -> Result<AssetLockProofNAPI, napi::Error> {
        Ok(InstantAssetLockProofNAPI::new(instant_lock, transaction, output_index)?.into())
    }

    #[napi(js_name = "createChainAssetLockProof")]
    pub fn new_chain_asset_lock_proof(
        core_chain_locked_height: u32,
        out_point: &OutPointNAPI,
    ) -> AssetLockProofNAPI {
        ChainAssetLockProofNAPI::new(core_chain_locked_height, out_point).into()
    }

    #[napi(js_name = "getLockType")]
    pub fn get_lock_type(&self) -> String {
        match self.0 {
            AssetLockProof::Chain(_) => AssetLockProofTypeNAPI::Chain.into(),
            AssetLockProof::Instant(_) => AssetLockProofTypeNAPI::Instant.into(),
        }
    }

    #[napi(js_name = "getInstantLockProof")]
    pub fn get_instant_lock(&self) -> InstantAssetLockProofNAPI {
        self.clone().0.into()
    }

    #[napi(js_name = "getChainLockProof")]
    pub fn get_chain_lock(&self) -> ChainAssetLockProofNAPI {
        self.clone().0.into()
    }

    #[napi(js_name = "getOutPoint")]
    pub fn get_out_point(&self) -> Option<OutPointNAPI> {
        match self.0.out_point() {
            Some(out_point) => Some(OutPointNAPI::from(out_point)),
            None => None,
        }
    }

    #[napi(js_name = "createIdentityId")]
    pub fn create_identifier(&self) -> Result<IdentifierNAPI, napi::Error> {
        let identifier = self.0.create_identifier().with_js_error()?;

        Ok(identifier.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_string(&self) -> Result<String, napi::Error> {
        Ok(hex::encode(serde_json::to_string(&self.0).map_err(
            |err| napi::Error::new(napi::Status::GenericFailure, err.to_string()),
        )?))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(asset_lock_proof: String) -> Result<AssetLockProofNAPI, napi::Error> {
        let asset_lock_proof_bytes = hex::decode(&asset_lock_proof).map_err(|e| {
            napi::Error::new(
                napi::Status::GenericFailure,
                format!("Invalid asset lock proof hex: {}", e),
            )
        })?;

        let json_str = String::from_utf8(asset_lock_proof_bytes).map_err(|e| {
            napi::Error::new(
                napi::Status::GenericFailure,
                format!("Invalid UTF-8 in asset lock proof: {}", e),
            )
        })?;

        let asset_lock_proof = serde_json::from_str(&json_str).map_err(|e| {
            napi::Error::new(
                napi::Status::GenericFailure,
                format!("Failed to parse asset lock proof JSON: {}", e),
            )
        })?;

        Ok(AssetLockProofNAPI(asset_lock_proof))
    }
}
