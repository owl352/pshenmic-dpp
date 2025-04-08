use dpp::fee::Credits;
use dpp::prelude::{IdentityNonce, Revision};
use dpp::state_transition::documents_batch_transition::document_transition::document_purchase_transition::v0::v0_methods::DocumentPurchaseTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::{DocumentPurchaseTransition, DocumentTransition};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_purchase_transition;

#[wasm_bindgen(js_name = "DocumentPurchaseTransitionWASM")]
pub struct DocumentPurchaseTransitionWASM(DocumentPurchaseTransition);

impl From<DocumentPurchaseTransitionWASM> for DocumentPurchaseTransition {
    fn from(transition: DocumentPurchaseTransitionWASM) -> Self {
        transition.0
    }
}

impl From<DocumentPurchaseTransition> for DocumentPurchaseTransitionWASM {
    fn from(transition: DocumentPurchaseTransition) -> Self {
        DocumentPurchaseTransitionWASM(transition)
    }
}

#[wasm_bindgen]
impl DocumentPurchaseTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        amount: Credits,
    ) -> Result<DocumentPurchaseTransitionWASM, JsValue> {
        let rs_purchase_transition = generate_purchase_transition(
            document.clone(),
            identity_contract_nonce,
            document_type_name,
            amount,
        );

        Ok(DocumentPurchaseTransitionWASM(rs_purchase_transition))
    }

    #[wasm_bindgen(js_name = "getBase")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(js_name = "getPrice")]
    pub fn get_price(&self) -> Credits {
        self.0.price()
    }

    #[wasm_bindgen(js_name = "setBase")]
    pub fn set_base(&mut self, base: DocumentBaseTransitionWASM) { 
        self.0.set_base(base.into())
    }

    #[wasm_bindgen(js_name = "setRevision")]
    pub fn set_revision(&mut self, revision: Revision) {
        self.0.set_revision(revision);
    }

    #[wasm_bindgen(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionWASM {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionWASM::from(rs_transition)
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: DocumentTransitionWASM,
    ) -> Result<DocumentPurchaseTransitionWASM, JsValue> {
        js_transition.get_purchase_transition()
    }
}
