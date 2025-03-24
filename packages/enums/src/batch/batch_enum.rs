use dpp::state_transition::documents_batch_transition::document_transition::action_type::DocumentTransitionActionType;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "BatchType")]
pub enum BatchTypeWASM {
    Create,
    Replace,
    Delete,
    Transfer,
    Purchase,
    UpdatePrice,
    IgnoreWhileBumpingRevision,
}

impl From<DocumentTransitionActionType> for BatchTypeWASM {
    fn from(action_type: DocumentTransitionActionType) -> Self {
        match action_type {
            DocumentTransitionActionType::Create => BatchTypeWASM::Create,
            DocumentTransitionActionType::Replace => BatchTypeWASM::Replace,
            DocumentTransitionActionType::Delete => BatchTypeWASM::Delete,
            DocumentTransitionActionType::Transfer => BatchTypeWASM::Transfer,
            DocumentTransitionActionType::Purchase => BatchTypeWASM::Purchase,
            DocumentTransitionActionType::UpdatePrice => BatchTypeWASM::UpdatePrice,
            DocumentTransitionActionType::IgnoreWhileBumpingRevision => {
                BatchTypeWASM::IgnoreWhileBumpingRevision
            }
        }
    }
}
