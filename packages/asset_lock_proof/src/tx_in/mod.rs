use crate::outpoint::OutPointWASM;
use crate::witness::WitnessWASM;
use dpp::dashcore::{ScriptBuf, TxIn};
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "TxInWASM")]
pub struct TxInWASM(TxIn);

impl From<TxIn> for TxInWASM {
    fn from(tx_in: TxIn) -> Self {
        Self(tx_in)
    }
}

impl From<TxInWASM> for TxIn {
    fn from(tx_in: TxInWASM) -> Self {
        tx_in.0
    }
}

#[wasm_bindgen]
impl TxInWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TxInWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "TxInWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        previous_output: &OutPointWASM,
        script_sig: Vec<u8>,
        sequence: u32,
        witness: &WitnessWASM,
    ) -> Self {
        TxInWASM(TxIn {
            previous_output: previous_output.clone().into(),
            script_sig: ScriptBuf(script_sig),
            sequence,
            witness: witness.clone().into(),
        })
    }

    #[wasm_bindgen(getter = "previousOutput")]
    pub fn previous_output(&self) -> OutPointWASM {
        self.0.previous_output.clone().into()
    }

    #[wasm_bindgen(getter = "scriptSig")]
    pub fn script_sig(&self) -> Vec<u8> {
        self.0.script_sig.clone().to_bytes()
    }

    #[wasm_bindgen(getter = "sequence")]
    pub fn sequence(&self) -> u32 {
        self.0.sequence
    }

    #[wasm_bindgen(getter = "witnesses")]
    pub fn witness(&self) -> WitnessWASM {
        self.0.witness.clone().into()
    }

    #[wasm_bindgen(setter = "previousOutput")]
    pub fn set_previous_output(&mut self, previous_output: &OutPointWASM) {
        self.0.previous_output = previous_output.clone().into();
    }

    #[wasm_bindgen(setter = "scriptSig")]
    pub fn set_script_sig(&mut self, script_sig: Vec<u8>) {
        self.0.script_sig = ScriptBuf(script_sig)
    }

    #[wasm_bindgen(setter = "sequence")]
    pub fn set_sequence(&mut self, sequence: u32) {
        self.0.sequence = sequence
    }

    #[wasm_bindgen(setter = "witnesses")]
    pub fn set_witness(&mut self, witness: &WitnessWASM) {
        self.0.witness = witness.clone().into()
    }
}
