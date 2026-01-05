use dpp::identity::state_transition::asset_lock_proof::chain::ChainAssetLockProof;
use napi::{Status, bindgen_prelude::Uint8Array};
use napi_derive::napi;

use crate::{asset_lock_proof::outpoint::OutPointNAPI, identifier::IdentifierNAPI};

#[napi(object, js_name = "ChainAssetLockProofParams")]
pub struct ChainAssetLockProofParams {
    #[napi(js_name = "coreChainLockedHeight")]
    pub core_chain_locked_height: u32,
    #[napi(js_name = "outPoint")]
    pub out_point: Uint8Array,
}

#[napi(js_name = "ChainAssetLockProofNAPI")]
#[derive(Clone)]
pub struct ChainAssetLockProofNAPI(ChainAssetLockProof);

impl From<ChainAssetLockProofNAPI> for ChainAssetLockProof {
    fn from(chain_lock: ChainAssetLockProofNAPI) -> Self {
        chain_lock.0
    }
}

impl From<ChainAssetLockProof> for ChainAssetLockProofNAPI {
    fn from(chain_lock: ChainAssetLockProof) -> Self {
        ChainAssetLockProofNAPI(chain_lock)
    }
}

#[napi]
impl ChainAssetLockProofNAPI {
    #[napi(constructor)]
    pub fn new(core_chain_locked_height: u32, out_point: &OutPointNAPI) -> ChainAssetLockProofNAPI {
        ChainAssetLockProofNAPI(ChainAssetLockProof {
            core_chain_locked_height,
            out_point: out_point.clone().into(),
        })
    }

    #[napi(js_name = "fromRawObject")]
    pub fn from_raw_value(
        raw_asset_lock_proof: ChainAssetLockProofParams,
    ) -> Result<ChainAssetLockProofNAPI, napi::Error> {
        let vec_outpoint = raw_asset_lock_proof.out_point.to_vec();

        let out_point: [u8; 36] = vec_outpoint.try_into().map_err(|_| {
            napi::Error::new(Status::GenericFailure, "outPoint must be a 36 byte array")
        })?;

        let rs_proof =
            ChainAssetLockProof::new(raw_asset_lock_proof.core_chain_locked_height, out_point);

        Ok(ChainAssetLockProofNAPI(rs_proof))
    }

    #[napi(setter, js_name = "coreChainLockedHeight")]
    pub fn set_core_chain_locked_height(&mut self, core_chain_locked_height: u32) {
        self.0.core_chain_locked_height = core_chain_locked_height;
    }

    #[napi(setter, js_name = "outPoint")]
    pub fn set_out_point(&mut self, outpoint: &OutPointNAPI) {
        self.0.out_point = outpoint.clone().into();
    }

    #[napi(getter, js_name = "coreChainLockedHeight")]
    pub fn get_core_chain_locked_height(&self) -> u32 {
        self.0.core_chain_locked_height
    }

    #[napi(getter, js_name = "outPoint")]
    pub fn get_out_point(&self) -> OutPointNAPI {
        self.0.out_point.into()
    }

    #[napi(js_name = "createIdentityId")]
    pub fn create_identifier(&self) -> IdentifierNAPI {
        let identifier = self.0.create_identifier();

        identifier.into()
    }
}
