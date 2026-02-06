use dpp::platform_value::Value;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::document_base_transition::document_base_transition_trait::DocumentBaseTransitionAccessors;
use dpp::state_transition::batch_transition::document_create_transition::v0::v0_methods::DocumentCreateTransitionV0Methods;
use dpp::state_transition::batch_transition::DocumentCreateTransition;
use napi::bindgen_prelude::{Uint8Array};
use napi_derive::napi;

use crate::batch::document_base_transition::DocumentBaseTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::batch::generators::generate_create_transition;
use crate::batch::prefunded_voting_balance::PrefundedVotingBalanceNAPI;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{DynamicValue, TryToU64, Uint64String};
use crate::utils::with_serde_to_platform_value_map;

#[napi(js_name = "DocumentCreateTransitionNAPI")]
#[derive(Clone)]
pub struct DocumentCreateTransitionNAPI(DocumentCreateTransition);

impl From<DocumentCreateTransitionNAPI> for DocumentCreateTransition {
    fn from(transition: DocumentCreateTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<DocumentCreateTransition> for DocumentCreateTransitionNAPI {
    fn from(transition: DocumentCreateTransition) -> Self {
        DocumentCreateTransitionNAPI(transition)
    }
}

#[napi]
impl DocumentCreateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        document: &DocumentNAPI,
        identity_contract_nonce: Uint64String,
        prefunded_voting_balance: Option<&PrefundedVotingBalanceNAPI>,
        token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentCreateTransitionNAPI, napi::Error> {
        let rs_create_transition = generate_create_transition(
            document,
            identity_contract_nonce.try_to_u64()?,
            document.get_document_type_name().to_string(),
            prefunded_voting_balance,
            token_payment_info,
        );

        Ok(DocumentCreateTransitionNAPI(rs_create_transition))
    }

    #[napi(getter, js_name = "data", ts_return_type = "object")]
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

    #[napi(getter, js_name = "entropy")]
    pub fn get_entropy(&self) -> Uint8Array {
        self.0.entropy().to_vec().into()
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

    #[napi(setter, js_name = "entropy")]
    pub fn set_entropy(&mut self, js_entropy: Uint8Array) {
        let js_entropy_bytes = js_entropy.to_vec();
        let mut entropy = [0u8; 32];
        let bytes = js_entropy_bytes.as_slice();
        let len = bytes.len().min(32);
        entropy[..len].copy_from_slice(&bytes[..len]);

        self.0.set_entropy(entropy)
    }

    #[napi(getter, js_name = "prefundedVotingBalance")]
    pub fn get_prefunded_voting_balance(&self) -> Option<PrefundedVotingBalanceNAPI> {
        let rs_balance = self.0.prefunded_voting_balance();

        rs_balance.clone().map(Into::into)
    }

    #[napi(setter, js_name = "prefundedVotingBalance")]
    pub fn set_prefunded_voting_balance(
        &mut self,
        prefunded_voting_balance: &PrefundedVotingBalanceNAPI,
    ) -> Result<(), napi::Error> {
        self.0.set_prefunded_voting_balance(
            prefunded_voting_balance.index_name(),
            prefunded_voting_balance.credits().try_to_u64()?,
        );
        Ok(())
    }

    #[napi(js_name = "clearPrefundedVotingBalance")]
    pub fn clear_prefunded_voting_balance(&mut self) {
        self.0.clear_prefunded_voting_balance()
    }

    #[napi(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionNAPI {
        DocumentTransition::from(self.0.clone()).into()
    }

    #[napi(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: &DocumentTransitionNAPI,
    ) -> Result<DocumentCreateTransitionNAPI, napi::Error> {
        js_transition.get_create_transition()
    }
}
