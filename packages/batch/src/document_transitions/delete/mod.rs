use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_delete_transition;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::DocumentDeleteTransition;
use pshenmic_dpp_document::DocumentWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "DocumentDeleteTransitionWASM")]
pub struct DocumentDeleteTransitionWASM(DocumentDeleteTransition);

impl From<DocumentDeleteTransition> for DocumentDeleteTransitionWASM {
    fn from(document_delete_transition: DocumentDeleteTransition) -> Self {
        DocumentDeleteTransitionWASM(document_delete_transition)
    }
}

#[wasm_bindgen]
impl DocumentDeleteTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "DocumentDeleteTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "DocumentDeleteTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
    ) -> Result<DocumentDeleteTransitionWASM, JsValue> {
        let rs_delete_transition = generate_delete_transition(
            document.clone(),
            identity_contract_nonce,
            document.get_document_type_name().to_string(),
        );

        Ok(DocumentDeleteTransitionWASM(rs_delete_transition))
    }

    #[wasm_bindgen(getter = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(setter = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionWASM) {
        self.0.set_base(base.clone().into())
    }

    #[wasm_bindgen(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionWASM {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionWASM::from(rs_transition)
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: DocumentTransitionWASM,
    ) -> Result<DocumentDeleteTransitionWASM, JsValue> {
        js_transition.get_delete_transition()
    }
}

impl From<DocumentDeleteTransitionWASM> for DocumentDeleteTransition {
    fn from(document_delete_transition: DocumentDeleteTransitionWASM) -> Self {
        document_delete_transition.0
    }
}
