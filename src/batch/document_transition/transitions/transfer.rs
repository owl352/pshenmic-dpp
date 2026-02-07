use dpp::state_transition::batch_transition::batched_transition::document_transfer_transition::v0::v0_methods::DocumentTransferTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::batched_transition::DocumentTransferTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_transfer_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;

#[napi(js_name = "DocumentTransferTransitionNAPI")]
pub struct DocumentTransferTransitionNAPI(DocumentTransferTransition);

impl From<DocumentTransferTransition> for DocumentTransferTransitionNAPI {
    fn from(transition: DocumentTransferTransition) -> Self {
        DocumentTransferTransitionNAPI(transition)
    }
}

impl From<DocumentTransferTransitionNAPI> for DocumentTransferTransition {
    fn from(transition: DocumentTransferTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl DocumentTransferTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: BigIntString,
        js_recipient_owner_id: IdentifierLikeNAPI,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentTransferTransitionNAPI, napi::Error> {
        let rs_transfer_transition = generate_transfer_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            IdentifierNAPI::try_from(js_recipient_owner_id)?.into(),
            token_payment_info,
        );

        Ok(DocumentTransferTransitionNAPI(rs_transfer_transition))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "recipientId")]
    pub fn get_recipient_owner_id(&self) -> IdentifierNAPI {
        self.0.recipient_owner_id().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "recipientId")]
    pub fn set_recipient_owner_id(
        &mut self,
        js_recipient_owner_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_recipient_owner_id(IdentifierNAPI::try_from(js_recipient_owner_id)?.into());
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
    ) -> Result<DocumentTransferTransitionNAPI, napi::Error> {
        js_transition.get_transfer_transition()
    }
}
