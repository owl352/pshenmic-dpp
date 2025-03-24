use dpp::fee::Credits;
use dpp::state_transition::documents_batch_transition::{
    DocumentsBatchTransition, DocumentsBatchTransitionV0,
};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "PrefundedVotingBalanceWASM")]
#[derive(Clone)]
pub struct PrefundedVotingBalanceWasm {
    index_name: String,
    credits: Credits,
}

impl From<(String, Credits)> for PrefundedVotingBalanceWasm {
    fn from((index_name, credits): (String, Credits)) -> Self {
        PrefundedVotingBalanceWasm {
            index_name,
            credits,
        }
    }
}

impl From<PrefundedVotingBalanceWasm> for (String, Credits) {
    fn from(value: PrefundedVotingBalanceWasm) -> Self {
        (value.index_name, value.credits)
    }
}

#[wasm_bindgen]
impl PrefundedVotingBalanceWasm {
    #[wasm_bindgen(constructor)]
    pub fn new(index_name: String, credits: Credits) -> PrefundedVotingBalanceWasm {
        PrefundedVotingBalanceWasm {
            index_name,
            credits,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn index_name(&self) -> String {
        self.index_name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn credits(&self) -> Credits {
        self.credits.clone()
    }
}
