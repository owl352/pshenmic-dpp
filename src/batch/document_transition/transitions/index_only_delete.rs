use dpp::platform_value::Value;
use dpp::state_transition::batch_transition::batched_transition::document_index_only_delete_transition::v0::v0_methods::DocumentIndexOnlyDeleteTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::DocumentIndexOnlyDeleteTransition;
use napi_derive::napi;

use crate::batch::action_fee_agreement::DocumentActionFeeAgreementNAPI;
use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_index_only_delete_transition;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::utils::with_serde_to_platform_value_map;

#[napi(js_name = "DocumentIndexOnlyDeleteTransitionNAPI")]
pub struct DocumentIndexOnlyDeleteTransitionNAPI(DocumentIndexOnlyDeleteTransition);

impl From<DocumentIndexOnlyDeleteTransition> for DocumentIndexOnlyDeleteTransitionNAPI {
    fn from(transition: DocumentIndexOnlyDeleteTransition) -> Self {
        DocumentIndexOnlyDeleteTransitionNAPI(transition)
    }
}

impl From<DocumentIndexOnlyDeleteTransitionNAPI> for DocumentIndexOnlyDeleteTransition {
    fn from(transition: DocumentIndexOnlyDeleteTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl DocumentIndexOnlyDeleteTransitionNAPI {
    /// The document properties identify the indexOnly document being deleted
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: BigIntString,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
        action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
    ) -> Result<DocumentIndexOnlyDeleteTransitionNAPI, napi::Error> {
        let rs_transition = generate_index_only_delete_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            token_payment_info,
            action_fee_agreement,
        );

        Ok(DocumentIndexOnlyDeleteTransitionNAPI(rs_transition))
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

    #[napi(setter, js_name = "data")]
    pub fn set_data(&mut self, js_data: &DynamicValue) -> Result<(), napi::Error> {
        let data = with_serde_to_platform_value_map(js_data)?;

        Ok(self.0.set_data(data))
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
        DocumentTransitionNAPI::from(DocumentTransition::from(self.0.clone()))
    }

    #[napi(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: &DocumentTransitionNAPI,
    ) -> Result<DocumentIndexOnlyDeleteTransitionNAPI, napi::Error> {
        js_transition.get_index_only_delete_transition()
    }
}
