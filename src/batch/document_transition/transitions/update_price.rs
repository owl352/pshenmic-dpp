use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::document_update_price_transition::v0::v0_methods::DocumentUpdatePriceTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::DocumentUpdatePriceTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_update_price_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{TryToU64, Uint64String};

#[napi(js_name = "DocumentUpdatePriceTransitionNAPI")]
pub struct DocumentUpdatePriceTransitionNAPI(DocumentUpdatePriceTransition);

impl From<DocumentUpdatePriceTransition> for DocumentUpdatePriceTransitionNAPI {
    fn from(document_update_price_transition: DocumentUpdatePriceTransition) -> Self {
        DocumentUpdatePriceTransitionNAPI(document_update_price_transition)
    }
}

#[napi]
impl DocumentUpdatePriceTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: Uint64String,
        price: Uint64String,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentUpdatePriceTransitionNAPI, napi::Error> {
        let rs_document_update_price_transition = generate_update_price_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            price.try_to_u64()?,
            token_payment_info,
        );

        Ok(DocumentUpdatePriceTransitionNAPI(
            rs_document_update_price_transition,
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "price")]
    pub fn get_price(&self) -> Uint64String {
        Uint64String::from_u64(self.0.price())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "price")]
    pub fn set_price(&mut self, price: Uint64String) -> Result<(), napi::Error> {
        self.0.set_price(price.try_to_u64()?);
        Ok(())
    }

    #[napi(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionNAPI {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionNAPI::from(rs_transition)
    }

    #[napi(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: &DocumentTransitionNAPI,
    ) -> Result<DocumentUpdatePriceTransitionNAPI, napi::Error> {
        js_transition.get_update_price_transition()
    }
}
