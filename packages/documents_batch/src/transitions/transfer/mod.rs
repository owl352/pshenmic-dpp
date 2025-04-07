use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::document_transition::document_transfer_transition::v0::v0_methods::DocumentTransferTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::{DocumentTransferTransition, DocumentTransition};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_utils::identifier_from_js_value;
use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_transfer_transition;

#[wasm_bindgen(js_name = "DocumentTransferTransitionWASM")]
pub struct DocumentTransferTransitionWASM(DocumentTransferTransition);

impl From<DocumentTransferTransition> for DocumentTransferTransitionWASM {
    fn from(transition: DocumentTransferTransition) -> Self {
        DocumentTransferTransitionWASM(transition)
    }
}

impl From<DocumentTransferTransitionWASM> for DocumentTransferTransition {
    fn from(transition: DocumentTransferTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl DocumentTransferTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        js_recipient_owner_id: JsValue,
    ) -> Result<DocumentTransferTransitionWASM, JsValue> {
        let recipient_owner_id = identifier_from_js_value(&js_recipient_owner_id)?;

        let rs_transfer_transition = generate_transfer_transition(
            document.clone(),
            identity_contract_nonce,
            document_type_name,
            recipient_owner_id,
        );

        Ok(DocumentTransferTransitionWASM(rs_transfer_transition))
    }

    #[wasm_bindgen(js_name = "getBase")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(js_name = "getRecipientOwnerId")]
    pub fn get_recipient_owner_id(&self) -> Vec<u8> {
        self.0.recipient_owner_id().to_vec()
    }

    #[wasm_bindgen(js_name = "setBase")]
    pub fn set_base(&mut self, base: DocumentBaseTransitionWASM) {
        self.0.set_base(base.into())
    }

    #[wasm_bindgen(js_name = "setRecipientOwnerId")]
    pub fn set_recipient_owner_id(
        &mut self,
        js_recipient_owner_id: JsValue,
    ) -> Result<(), JsValue> {
        let recipient_owner_id = identifier_from_js_value(&js_recipient_owner_id)?;

        Ok(self.0.set_recipient_owner_id(recipient_owner_id))
    }

    #[wasm_bindgen(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionWASM {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionWASM::from(rs_transition)
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: DocumentTransitionWASM,
    ) -> Result<DocumentTransferTransitionWASM, JsValue> {
        js_transition.get_transfer_transition()
    }
}
