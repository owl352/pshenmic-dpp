use dpp::fee::Credits;
use dpp::prelude::{IdentityNonce, Revision};
use dpp::state_transition::batch_transition::batched_transition::document_purchase_transition::v0::v0_methods::DocumentPurchaseTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::DocumentPurchaseTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
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
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "DocumentPurchaseTransitionWASM".to_string()
    }

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

    #[wasm_bindgen(getter = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(getter = "price")]
    pub fn get_price(&self) -> Credits {
        self.0.price()
    }

    #[wasm_bindgen(getter = "revision")]
    pub fn get_revision(&self) -> Revision {
        self.0.revision()
    }

    #[wasm_bindgen(setter = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionWASM) {
        self.0.set_base(base.clone().into())
    }

    #[wasm_bindgen(setter = "price")]
    pub fn set_price(&mut self, price: Credits) {
        match self.0 {
            DocumentPurchaseTransition::V0(ref mut v0) => v0.price = price,
        }
    }

    #[wasm_bindgen(setter = "revision")]
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
