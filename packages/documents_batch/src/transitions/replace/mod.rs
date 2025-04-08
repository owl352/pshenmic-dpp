use dpp::dashcore::hashes::serde::Serialize;
use dpp::prelude::{IdentityNonce, Revision};
use dpp::state_transition::documents_batch_transition::document_replace_transition::v0::v0_methods::DocumentReplaceTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentTransition;
use dpp::state_transition::documents_batch_transition::DocumentReplaceTransition;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_utils::ToSerdeJSONExt;
use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::generators::generate_replace_transition;
use crate::document_transition::DocumentTransitionWASM;

#[wasm_bindgen(js_name = "DocumentReplaceTransitionWASM")]
pub struct DocumentReplaceTransitionWASM(DocumentReplaceTransition);

impl From<DocumentReplaceTransition> for DocumentReplaceTransitionWASM {
    fn from(document_replace: DocumentReplaceTransition) -> Self {
        DocumentReplaceTransitionWASM(document_replace)
    }
}

impl From<DocumentReplaceTransitionWASM> for DocumentReplaceTransition {
    fn from(document_replace: DocumentReplaceTransitionWASM) -> Self {
        document_replace.0
    }
}

#[wasm_bindgen]
impl DocumentReplaceTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
    ) -> Result<DocumentReplaceTransitionWASM, JsValue> {
        let rs_update_transition = generate_replace_transition(
            document.clone(),
            identity_contract_nonce,
            document_type_name.to_string(),
        );

        Ok(DocumentReplaceTransitionWASM(rs_update_transition))
    }

    #[wasm_bindgen(getter = "data")]
    pub fn get_data(&self) -> Result<JsValue, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0.data().serialize(&serializer).map_err(JsValue::from)
    }

    #[wasm_bindgen(getter = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(getter = "revision")]
    pub fn get_revision(&self) -> Revision {
        self.0.revision()
    }

    #[wasm_bindgen(setter = "data")]
    pub fn set_data(&mut self, js_data: JsValue) -> Result<(), JsValue> {
        let data = js_data.with_serde_to_platform_value_map()?;

        Ok(self.0.set_data(data))
    }

    #[wasm_bindgen(setter = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionWASM) {
        self.0.set_base(base.clone().into())
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
    ) -> Result<DocumentReplaceTransitionWASM, JsValue> {
        js_transition.get_replace_transition()
    }
}
