use dpp::fee::Credits;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::document_transition::document_purchase_transition::v0::v0_methods::DocumentPurchaseTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentPurchaseTransition;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_utils::identifier_from_js_value;
use crate::document_base_transition::DocumentBaseTransitionWASM;
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
        document: DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        js_data_contract_id: JsValue,
        amount: Credits,
    ) -> Result<DocumentPurchaseTransitionWASM, JsValue> {
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        let rs_purchase_transition = generate_purchase_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
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
}
