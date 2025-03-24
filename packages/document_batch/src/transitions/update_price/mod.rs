use dpp::fee::Credits;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::document_transition::document_update_price_transition::v0::v0_methods::DocumentUpdatePriceTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentUpdatePriceTransition;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_utils::identifier_from_js_value;
use crate::document_base_transition::DocumentBaseTransitionWASM;
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
        document: DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        js_data_contract_id: JsValue,
        price: Credits,
    ) -> Result<DocumentUpdatePriceTransitionWASM, JsValue> {
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        let rs_document_update_price_transition = generate_update_price_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
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
}
