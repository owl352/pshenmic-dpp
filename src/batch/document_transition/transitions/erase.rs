use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::DocumentEraseTransition;
use napi_derive::napi;

use crate::batch::action_fee_agreement::DocumentActionFeeAgreementNAPI;
use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_erase_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, TryToU64};

/// Purges the retained revisions of a keep-history document that has already been
/// deleted (protocol version 15). The transition carries only the document base:
/// which chunk it removes and whether it starts or continues an erasure are decided
/// from the document's committed lifecycle, not from anything the submitter signs.
#[napi(js_name = "DocumentEraseTransitionNAPI")]
pub struct DocumentEraseTransitionNAPI(DocumentEraseTransition);

impl From<DocumentEraseTransition> for DocumentEraseTransitionNAPI {
    fn from(document_erase_transition: DocumentEraseTransition) -> Self {
        DocumentEraseTransitionNAPI(document_erase_transition)
    }
}

#[napi]
impl DocumentEraseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: BigIntString,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
        action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
    ) -> Result<DocumentEraseTransitionNAPI, napi::Error> {
        let rs_erase_transition = generate_erase_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            token_payment_info,
            action_fee_agreement,
        );

        Ok(DocumentEraseTransitionNAPI(rs_erase_transition))
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
    ) -> Result<DocumentEraseTransitionNAPI, napi::Error> {
        js_transition.get_erase_transition()
    }
}

impl From<DocumentEraseTransitionNAPI> for DocumentEraseTransition {
    fn from(document_erase_transition: DocumentEraseTransitionNAPI) -> Self {
        document_erase_transition.0
    }
}
