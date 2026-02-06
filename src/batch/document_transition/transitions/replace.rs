use dpp::platform_value::Value;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::document_replace_transition::v0::v0_methods::DocumentReplaceTransitionV0Methods;
use dpp::state_transition::batch_transition::DocumentReplaceTransition;
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_replace_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{DynamicValue, TryToU64, Uint64String};
use crate::utils::with_serde_to_platform_value_map;

#[napi(js_name = "DocumentReplaceTransitionNAPI")]
pub struct DocumentReplaceTransitionNAPI(DocumentReplaceTransition);

impl From<DocumentReplaceTransition> for DocumentReplaceTransitionNAPI {
    fn from(document_replace: DocumentReplaceTransition) -> Self {
        DocumentReplaceTransitionNAPI(document_replace)
    }
}

impl From<DocumentReplaceTransitionNAPI> for DocumentReplaceTransition {
    fn from(document_replace: DocumentReplaceTransitionNAPI) -> Self {
        document_replace.0
    }
}

#[napi]
impl DocumentReplaceTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: Uint64String,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentReplaceTransitionNAPI, napi::Error> {
        let rs_update_transition = generate_replace_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            token_payment_info,
        );

        Ok(DocumentReplaceTransitionNAPI(rs_update_transition))
    }

    #[napi(getter, js_name = "data")]
    pub fn get_data(&self) -> Result<DynamicValue, napi::Error> {
        let rs_data = Value::Map(
            self.0
                .data()
                .iter()
                .map(|(k, v)| (Value::Text(k.clone()), v.clone()))
                .collect(),
        );

        rs_data.try_into()
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> Uint64String {
        Uint64String::from_u64(self.0.revision())
    }

    #[napi(setter, js_name = "data")]
    pub fn set_data(&mut self, js_data: &DynamicValue) -> Result<(), napi::Error> {
        let data = with_serde_to_platform_value_map(js_data)?;

        Ok(self.0.set_data(data))
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: Uint64String) -> Result<(), napi::Error> {
        self.0.set_revision(revision.try_to_u64()?);
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
    ) -> Result<DocumentReplaceTransitionNAPI, napi::Error> {
        js_transition.get_replace_transition()
    }
}
