use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::DocumentDeleteTransition;
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_delete_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, TryToU64};

#[napi(js_name = "DocumentDeleteTransitionNAPI")]
pub struct DocumentDeleteTransitionNAPI(DocumentDeleteTransition);

impl From<DocumentDeleteTransition> for DocumentDeleteTransitionNAPI {
    fn from(document_delete_transition: DocumentDeleteTransition) -> Self {
        DocumentDeleteTransitionNAPI(document_delete_transition)
    }
}

#[napi]
impl DocumentDeleteTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: BigIntString,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentDeleteTransitionNAPI, napi::Error> {
        let rs_delete_transition = generate_delete_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            token_payment_info,
        );

        Ok(DocumentDeleteTransitionNAPI(rs_delete_transition))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionNAPI {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionNAPI::from(rs_transition)
    }

    #[napi(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: &DocumentTransitionNAPI,
    ) -> Result<DocumentDeleteTransitionNAPI, napi::Error> {
        js_transition.get_delete_transition()
    }
}

impl From<DocumentDeleteTransitionNAPI> for DocumentDeleteTransition {
    fn from(document_delete_transition: DocumentDeleteTransitionNAPI) -> Self {
        document_delete_transition.0
    }
}
