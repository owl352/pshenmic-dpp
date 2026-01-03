use dpp::dashcore::consensus::{deserialize, serialize};
use dpp::dashcore::{InstantLock, Transaction};
use dpp::identity::state_transition::asset_lock_proof::InstantAssetLockProof;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::outpoint::OutPointNAPI;
use crate::asset_lock_proof::tx_out::TxOutNAPI;
use crate::identifier::IdentifierNAPI;
use crate::instant_lock::InstantLockNAPI;
use crate::utils::WithJsError;

#[napi(object, js_name = "InstantAssetLockProofRAW")]
pub struct InstantAssetLockProofRAW {
    #[napi(js_name = "instantLock")]
    pub instant_lock: Uint8Array,
    #[napi(js_name = "transaction")]
    pub transaction: Uint8Array,
    #[napi(js_name = "outputIndex")]
    pub output_index: u32,
}

#[derive(Clone)]
#[napi(js_name = "InstantAssetLockProofNAPI")]
pub struct InstantAssetLockProofNAPI(InstantAssetLockProof);

impl From<InstantAssetLockProofNAPI> for InstantAssetLockProof {
    fn from(proof: InstantAssetLockProofNAPI) -> Self {
        proof.0
    }
}

impl From<InstantAssetLockProof> for InstantAssetLockProofNAPI {
    fn from(proof: InstantAssetLockProof) -> Self {
        InstantAssetLockProofNAPI(proof)
    }
}

#[napi]
impl InstantAssetLockProofNAPI {
    #[napi(constructor)]
    pub fn new(
        instant_lock: Uint8Array,
        transaction: Uint8Array,
        output_index: u32,
    ) -> Result<InstantAssetLockProofNAPI, napi::Error> {
        let instant_lock_bytes = instant_lock.to_vec();
        let transaction_bytes = transaction.to_vec();

        let instant_lock: InstantLock = deserialize(instant_lock_bytes.as_slice())
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;
        let transaction: Transaction = deserialize(transaction_bytes.as_slice())
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Ok(InstantAssetLockProofNAPI(InstantAssetLockProof {
            instant_lock,
            transaction,
            output_index,
        }))
    }

    #[napi(js_name = "fromRawObject ")]
    pub fn from_object(
        value: InstantAssetLockProofRAW,
    ) -> Result<InstantAssetLockProofNAPI, napi::Error> {
        InstantAssetLockProofNAPI::new(value.instant_lock, value.transaction, value.output_index)
    }

    #[napi(js_name = "getOutput")]
    pub fn get_output(&self) -> Option<TxOutNAPI> {
        match self.0.output() {
            Some(output) => Some(output.clone().into()),
            None => None,
        }
    }

    #[napi(js_name = "getOutPoint")]
    pub fn get_out_point(&self) -> Option<OutPointNAPI> {
        match self.0.out_point() {
            Some(output) => Some(output.clone().into()),
            None => None,
        }
    }

    #[napi(getter, js_name = "outputIndex")]
    pub fn get_output_index(&self) -> u32 {
        self.0.output_index()
    }

    #[napi(getter, js_name = "instantLock")]
    pub fn get_instant_lock(&self) -> InstantLockNAPI {
        self.0.instant_lock.clone().into()
    }

    #[napi(setter, js_name = "outputIndex")]
    pub fn set_output_index(&mut self, output_index: u32) {
        self.0.output_index = output_index;
    }

    #[napi(setter, js_name = "instantLock")]
    pub fn set_instant_lock(&mut self, instant_lock: &InstantLockNAPI) {
        self.0.instant_lock = instant_lock.clone().into();
    }

    #[napi(js_name=getTransaction)]
    pub fn get_transaction(&self) -> Uint8Array {
        let transaction = self.0.transaction();
        serialize(transaction).into()
    }

    #[napi(js_name=getInstantLockBytes)]
    pub fn get_instant_lock_bytes(&self) -> Uint8Array {
        let instant_lock = self.0.instant_lock();
        serialize(instant_lock).into()
    }

    #[napi(js_name = "createIdentityId")]
    pub fn create_identifier(&self) -> Result<IdentifierNAPI, napi::Error> {
        let identifier = self.0.create_identifier().with_js_error()?;

        Ok(identifier.into())
    }
}
