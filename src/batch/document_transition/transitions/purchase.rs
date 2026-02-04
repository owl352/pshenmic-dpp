use dpp::state_transition::batch_transition::batched_transition::document_purchase_transition::v0::v0_methods::DocumentPurchaseTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::DocumentPurchaseTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_purchase_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{TryToU64, Uint64String};

#[napi(js_name = "DocumentPurchaseTransitionNAPI")]
pub struct DocumentPurchaseTransitionNAPI(DocumentPurchaseTransition);

impl From<DocumentPurchaseTransitionNAPI> for DocumentPurchaseTransition {
    fn from(transition: DocumentPurchaseTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<DocumentPurchaseTransition> for DocumentPurchaseTransitionNAPI {
    fn from(transition: DocumentPurchaseTransition) -> Self {
        DocumentPurchaseTransitionNAPI(transition)
    }
}

#[napi]
impl DocumentPurchaseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: Uint64String,
        amount: Uint64String,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentPurchaseTransitionNAPI, napi::Error> {
        let rs_purchase_transition = generate_purchase_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            amount.try_to_u64()?,
            token_payment_info,
        );

        Ok(DocumentPurchaseTransitionNAPI(rs_purchase_transition))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "price")]
    pub fn get_price(&self) -> Uint64String {
        Uint64String::from_u64(self.0.price())
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> Uint64String {
        Uint64String::from_u64(self.0.revision())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "price")]
    pub fn set_price(&mut self, price: Uint64String) -> Result<(), napi::Error> {
        match self.0 {
            DocumentPurchaseTransition::V0(ref mut v0) => v0.price = price.try_to_u64()?,
        }
        Ok(())
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: Uint64String) -> Result<(), napi::Error> {
        self.0.set_revision(revision.try_to_u64()?);
        Ok(())
    }

    #[napi(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionNAPI {
        DocumentTransition::from(self.0.clone()).into()
    }

    #[napi(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: &DocumentTransitionNAPI,
    ) -> Result<DocumentPurchaseTransitionNAPI, napi::Error> {
        js_transition.get_purchase_transition()
    }
}
