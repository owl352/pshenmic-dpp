use dpp::fee::Credits;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::document_transition::document_update_price_transition::v0::v0_methods::DocumentUpdatePriceTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::{DocumentTransition, DocumentUpdatePriceTransition};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_update_price_transition;

#[wasm_bindgen(js_name = DocumentUpdatePriceTransitionWASM)]
pub struct DocumentUpdatePriceTransitionWASM(DocumentUpdatePriceTransition);

impl From<DocumentUpdatePriceTransition> for DocumentUpdatePriceTransitionWASM {
    fn from(document_update_price_transition: DocumentUpdatePriceTransition) -> Self {
        DocumentUpdatePriceTransitionWASM(document_update_price_transition)
    }
}

#[wasm_bindgen]
impl DocumentUpdatePriceTransitionWASM {
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        price: Credits,
    ) -> Result<DocumentUpdatePriceTransitionWASM, JsValue> {
        let rs_document_update_price_transition = generate_update_price_transition(
            document.clone(),
            identity_contract_nonce,
            document_type_name,
            price,
        );

        Ok(DocumentUpdatePriceTransitionWASM(
            rs_document_update_price_transition,
        ))
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

    #[wasm_bindgen(js_name = "setPrice")]
    pub fn set_price(&mut self, price: Credits) {
        self.0.set_price(price)
    }

    #[wasm_bindgen(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionWASM {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionWASM::from(rs_transition)
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: DocumentTransitionWASM,
    ) -> Result<DocumentUpdatePriceTransitionWASM, JsValue> {
        js_transition.get_update_price_transition()
    }
}
