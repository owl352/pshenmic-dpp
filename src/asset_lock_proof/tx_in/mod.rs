use crate::asset_lock_proof::{outpoint::OutPointNAPI, witness::WitnessNAPI};
use dpp::dashcore::{ScriptBuf, TxIn};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "TxInNAPI")]
pub struct TxInNAPI(TxIn);

impl From<TxIn> for TxInNAPI {
    fn from(tx_in: TxIn) -> Self {
        Self(tx_in)
    }
}

impl From<TxInNAPI> for TxIn {
    fn from(tx_in: TxInNAPI) -> Self {
        tx_in.0
    }
}

#[napi]
impl TxInNAPI {
    #[napi(constructor)]
    pub fn new(
        previous_output: &OutPointNAPI,
        script_sig: Uint8Array,
        sequence: u32,
        witness: &WitnessNAPI,
    ) -> Self {
        TxInNAPI(TxIn {
            previous_output: previous_output.clone().into(),
            script_sig: ScriptBuf(script_sig.to_vec()),
            sequence,
            witness: witness.clone().into(),
        })
    }

    #[napi(getter, js_name = "previousOutput")]
    pub fn previous_output(&self) -> OutPointNAPI {
        self.0.previous_output.clone().into()
    }

    #[napi(getter, js_name = "scriptSig")]
    pub fn script_sig(&self) -> Uint8Array {
        self.0.script_sig.clone().to_bytes().into()
    }

    #[napi(getter, js_name = "sequence")]
    pub fn sequence(&self) -> u32 {
        self.0.sequence
    }

    #[napi(getter, js_name = "witnesses")]
    pub fn witness(&self) -> WitnessNAPI {
        self.0.witness.clone().into()
    }

    #[napi(setter, js_name = "previousOutput")]
    pub fn set_previous_output(&mut self, previous_output: &OutPointNAPI) {
        self.0.previous_output = previous_output.clone().into();
    }

    #[napi(setter, js_name = "scriptSig")]
    pub fn set_script_sig(&mut self, script_sig: Uint8Array) {
        self.0.script_sig = ScriptBuf(script_sig.to_vec())
    }

    #[napi(setter, js_name = "sequence")]
    pub fn set_sequence(&mut self, sequence: u32) {
        self.0.sequence = sequence
    }

    #[napi(setter, js_name = "witnesses")]
    pub fn set_witness(&mut self, witness: &WitnessNAPI) {
        self.0.witness = witness.clone().into()
    }
}
