use crate::create::DocumentCreateTransitionWASM;
use dpp::prelude::{Identifier, IdentityNonce, Revision};
use dpp::state_transition::documents_batch_transition::document_transition::action_type::{
    DocumentTransitionActionType, TransitionActionTypeGetter,
};
use dpp::state_transition::documents_batch_transition::document_transition::{
    DocumentTransition, DocumentTransitionV0Methods,
};
use pshenmic_dpp_enums::batch::batch_enum::BatchTypeWASM;
use pshenmic_dpp_utils::identifier_from_js_value;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "DocumentTransitionsWASM")]
pub struct DocumentTransitionWASM(DocumentTransition);

impl From<DocumentTransition> for DocumentTransitionWASM {
    fn from(transition: DocumentTransition) -> Self {
        DocumentTransitionWASM(transition)
    }
}

impl From<DocumentTransitionWASM> for DocumentTransition {
    fn from(transition: DocumentTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl DocumentTransitionWASM {
    #[wasm_bindgen(js_name = "getActionType")]
    pub fn get_action_type(&self) -> BatchTypeWASM {
        self.0.action_type().into()
    }

    #[wasm_bindgen(js_name = "getDataContractId")]
    pub fn get_data_contract_id(&self) -> Vec<u8> {
        self.0.data_contract_id().to_vec()
    }

    #[wasm_bindgen(js_name = "getId")]
    pub fn get_id(&self) -> Vec<u8> {
        self.0.get_id().to_vec()
    }

    #[wasm_bindgen(js_name = "getDocumentTypeName")]
    pub fn get_document_type_name(&self) -> String {
        self.0.document_type_name().clone()
    }

    #[wasm_bindgen(js_name = "getIdentityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> IdentityNonce {
        self.0.identity_contract_nonce()
    }

    #[wasm_bindgen(js_name = "getRevision")]
    pub fn get_revision(&self) -> Option<Revision> {
        self.0.revision()
    }

    pub fn get_entropy(&self) -> Option<Vec<u8>> {
        self.0.entropy()
    }

    #[wasm_bindgen(js_name = "getCreateTransition")]
    pub fn get_create_transition(&self) -> Result<DocumentCreateTransitionWASM, JsValue> {
        match self.0.action_type() {
            DocumentTransitionActionType::Create => self.get_create_transition(),
            _ => Err(JsValue::null()),
        }
    }

    #[wasm_bindgen(js_name = "setDataContractId")]
    pub fn set_data_contract_id(&mut self, js_data_contract_id: JsValue) -> Result<(), JsValue> {
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        Ok(self.0.set_data_contract_id(data_contract_id))
    }

    #[wasm_bindgen(js_name = "setRevision")]
    pub fn set_revision(&mut self, revision: Revision) {
        self.0.set_revision(revision)
    }

    #[wasm_bindgen(js_name = "setIdentityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, identity_contract_nonce: IdentityNonce) {
        self.0.set_identity_contract_nonce(identity_contract_nonce)
    }
}

impl DocumentTransitionWASM {
    pub fn rs_get_data_contract_id(&self) -> Identifier {
        self.0.data_contract_id()
    }

    pub fn rs_get_id(&self) -> Identifier {
        self.0.get_id()
    }

    pub fn rs_get_entropy(&self) -> Option<Vec<u8>> {
        self.0.entropy()
    }

    pub fn rs_get_revision(&self) -> Option<Revision> {
        self.0.revision()
    }

    pub fn rs_get_identity_contract_nonce(&self) -> IdentityNonce {
        self.0.identity_contract_nonce()
    }
}
