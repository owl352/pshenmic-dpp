use dpp::fee::Credits;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::document_update_price_transition::v0::v0_methods::DocumentUpdatePriceTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::DocumentUpdatePriceTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_document::DocumentWASM;
use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_update_price_transition;

#[wasm_bindgen(js_name = "DocumentUpdatePriceTransitionWASM")]
pub struct DocumentUpdatePriceTransitionWASM(DocumentUpdatePriceTransition);

impl From<DocumentUpdatePriceTransition> for DocumentUpdatePriceTransitionWASM {
    fn from(document_update_price_transition: DocumentUpdatePriceTransition) -> Self {
        DocumentUpdatePriceTransitionWASM(document_update_price_transition)
    }
}

#[wasm_bindgen]
impl DocumentUpdatePriceTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "DocumentUpdatePriceTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "DocumentUpdatePriceTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        price: Credits,
    ) -> Result<DocumentUpdatePriceTransitionWASM, JsValue> {
        let rs_document_update_price_transition = generate_update_price_transition(
            document.clone(),
            identity_contract_nonce,
            document.get_document_type_name().to_string(),
            price,
        );

        Ok(DocumentUpdatePriceTransitionWASM(
            rs_document_update_price_transition,
        ))
    }

    #[wasm_bindgen(getter = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(getter = "price")]
    pub fn get_price(&self) -> Credits {
        self.0.price()
    }

    #[wasm_bindgen(setter = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionWASM) {
        self.0.set_base(base.clone().into())
    }

    #[wasm_bindgen(setter = "price")]
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
