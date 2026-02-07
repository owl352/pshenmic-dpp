use dpp::state_transition::batch_transition::batched_transition::BatchedTransition;
use dpp::state_transition::batch_transition::batched_transition::document_transition::{
    DocumentTransition, DocumentTransitionV0Methods,
};
use dpp::state_transition::batch_transition::batched_transition::token_transition::{
    TokenTransition, TokenTransitionV0Methods,
};
use napi::Either;
use napi_derive::napi;

use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::token_transition::TokenTransitionNAPI;
use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "BatchedTransitionNAPI")]
pub struct BatchedTransitionNAPI(BatchedTransition);

impl From<BatchedTransition> for BatchedTransitionNAPI {
    fn from(v: BatchedTransition) -> Self {
        BatchedTransitionNAPI(v)
    }
}

impl From<BatchedTransitionNAPI> for BatchedTransition {
    fn from(v: BatchedTransitionNAPI) -> Self {
        v.0
    }
}

#[napi]
impl BatchedTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_transition: Either<&DocumentTransitionNAPI, &TokenTransitionNAPI>,
    ) -> BatchedTransitionNAPI {
        match js_transition {
            Either::A(doc_transition) => BatchedTransitionNAPI::from(BatchedTransition::from(
                DocumentTransition::from(doc_transition.clone()),
            )),
            Either::B(token_transition) => BatchedTransitionNAPI::from(BatchedTransition::from(
                TokenTransition::from(token_transition.clone()),
            )),
        }
    }

    #[napi(js_name = "toTransition")]
    pub fn to_transition(&self) -> Either<DocumentTransitionNAPI, TokenTransitionNAPI> {
        match &self.0 {
            BatchedTransition::Document(document_transition) => {
                Either::A(DocumentTransitionNAPI::from(document_transition.clone()).into())
            }
            BatchedTransition::Token(token_transition) => {
                Either::B(TokenTransitionNAPI::from(token_transition.clone()).into())
            }
        }
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn data_contract_id(&self) -> IdentifierNAPI {
        match self.0.clone() {
            BatchedTransition::Document(document_transition) => {
                document_transition.data_contract_id().into()
            }
            BatchedTransition::Token(token_transition) => {
                token_transition.data_contract_id().into()
            }
        }
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let contract_id = IdentifierNAPI::try_from(js_contract_id)?;

        self.0 = match self.0.clone() {
            BatchedTransition::Document(mut document_transition) => {
                document_transition.set_data_contract_id(contract_id.into());

                BatchedTransition::Document(document_transition)
            }
            BatchedTransition::Token(mut token_transition) => {
                token_transition.set_data_contract_id(contract_id.into());

                BatchedTransition::Token(token_transition)
            }
        };

        Ok(())
    }
}
