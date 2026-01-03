use dpp::dashcore::bls_sig_utils::BLSSignature;
use dpp::dashcore::hash_types::CycleHash;
use dpp::dashcore::hashes::hex::FromHex;
use dpp::dashcore::secp256k1::hashes::hex::Case::Lower;
use dpp::dashcore::secp256k1::hashes::hex::DisplayHex;
use dpp::dashcore::{InstantLock, Txid};
use napi::Status;
use napi_derive::napi;
use std::str::FromStr;

use crate::asset_lock_proof::outpoint::OutPointNAPI;

#[napi(js_name = "InstantLockNAPI")]
#[derive(Clone)]
pub struct InstantLockNAPI(InstantLock);

impl From<InstantLockNAPI> for InstantLock {
    fn from(value: InstantLockNAPI) -> Self {
        value.0
    }
}

impl From<InstantLock> for InstantLockNAPI {
    fn from(value: InstantLock) -> Self {
        InstantLockNAPI(value)
    }
}

#[napi]
impl InstantLockNAPI {
    #[napi(constructor)]
    pub fn new(
        version: u8,
        js_inputs: Vec<&OutPointNAPI>,
        txid: String,
        cycle_hash: String,
        bls_signature: String,
    ) -> Result<InstantLockNAPI, napi::Error> {
        Ok(InstantLockNAPI(InstantLock {
            version,
            inputs: js_inputs
                .into_iter()
                .map(|input| input.clone().into())
                .collect(),
            txid: Txid::from_hex(&txid)
                .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?,
            cyclehash: CycleHash::from_str(&cycle_hash)
                .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?,
            signature: BLSSignature::from_hex(&bls_signature)
                .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?,
        }))
    }

    #[napi(getter, js_name = "version")]
    pub fn get_version(&self) -> u8 {
        self.0.version
    }

    #[napi(getter, js_name = "inputs")]
    pub fn get_inputs(&self) -> Vec<OutPointNAPI> {
        self.0
            .inputs
            .iter()
            .map(|input| input.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "txid")]
    pub fn get_txid(&self) -> String {
        self.0.txid.to_hex()
    }

    #[napi(getter, js_name = "cyclehash")]
    pub fn get_cycle_hash(&self) -> String {
        self.0.cyclehash.to_string()
    }

    #[napi(getter, js_name = "blsSignature")]
    pub fn get_bls_signature(&self) -> String {
        self.0.signature.to_bytes().to_hex_string(Lower)
    }

    #[napi(setter, js_name = "version")]
    pub fn set_version(&mut self, v: u8) {
        self.0.version = v;
    }

    #[napi(setter, js_name = "inputs")]
    pub fn set_inputs(&mut self, inputs: Vec<&OutPointNAPI>) {
        self.0.inputs = inputs
            .into_iter()
            .map(|input| input.clone().into())
            .collect();
    }

    #[napi(setter, js_name = "txid")]
    pub fn set_txid(&mut self, txid: String) -> Result<(), napi::Error> {
        self.0.txid = Txid::from_hex(&txid)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;
        Ok(())
    }

    #[napi(setter, js_name = "cyclehash")]
    pub fn set_cycle_hash(&mut self, cycle_hash: String) -> Result<(), napi::Error> {
        self.0.cyclehash = CycleHash::from_str(&cycle_hash)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;
        Ok(())
    }

    #[napi(setter, js_name = "blsSignature")]
    pub fn set_bls_signature(&mut self, bls_signature: String) -> Result<(), napi::Error> {
        self.0.signature = BLSSignature::from_hex(&bls_signature)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;
        Ok(())
    }
}
