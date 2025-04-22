use crate::document_base_transition::DocumentBaseTransitionWASM;
use crate::document_transition::DocumentTransitionWASM;
use crate::generators::generate_create_transition;
use crate::prefunded_voting_balance::PrefundedVotingBalanceWASM;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::DocumentCreateTransition;
use dpp::state_transition::documents_batch_transition::document_create_transition::v0::v0_methods::DocumentCreateTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentTransition;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_utils::ToSerdeJSONExt;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "DocumentCreateTransitionWASM")]
#[derive(Clone)]
pub struct DocumentCreateTransitionWASM(DocumentCreateTransition);

impl From<DocumentCreateTransitionWASM> for DocumentCreateTransition {
    fn from(transition: DocumentCreateTransitionWASM) -> Self {
        transition.0
    }
}

impl From<DocumentCreateTransition> for DocumentCreateTransitionWASM {
    fn from(transition: DocumentCreateTransition) -> Self {
        DocumentCreateTransitionWASM(transition)
    }
}

#[wasm_bindgen]
impl DocumentCreateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document: &DocumentWASM,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
    ) -> Result<DocumentCreateTransitionWASM, JsValue> {
        let rs_create_transition = generate_create_transition(
            document.clone(),
            identity_contract_nonce,
            document_type_name.to_string(),
        );

        Ok(DocumentCreateTransitionWASM(rs_create_transition))
    }

    #[wasm_bindgen(getter = "data")]
    pub fn get_data(&self) -> Result<JsValue, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0.data().serialize(&serializer).map_err(JsValue::from)
    }

    #[wasm_bindgen(getter = "base")]
    pub fn get_base(&self) -> DocumentBaseTransitionWASM {
        self.0.base().clone().into()
    }

    #[wasm_bindgen(getter = "entropy")]
    pub fn get_entropy(&self) -> Vec<u8> {
        self.0.entropy().to_vec()
    }

    #[wasm_bindgen(setter = "data")]
    pub fn set_data(&mut self, js_data: JsValue) -> Result<(), JsValue> {
        let data = js_data.with_serde_to_platform_value_map()?;

        Ok(self.0.set_data(data))
    }

    #[wasm_bindgen(setter = "base")]
    pub fn set_base(&mut self, base: &DocumentBaseTransitionWASM) {
        self.0.set_base(base.clone().into())
    }

    #[wasm_bindgen(setter = "entropy")]
    pub fn set_entropy(&mut self, js_entropy: Vec<u8>) -> Result<(), JsValue> {
        let mut entropy = [0u8; 32];
        let bytes = js_entropy.as_slice();
        let len = bytes.len().min(32);
        entropy[..len].copy_from_slice(&bytes[..len]);

        Ok(self.0.set_entropy(entropy))
    }

    #[wasm_bindgen(getter = "prefundedVotingBalance")]
    pub fn get_prefunded_voting_balance(&self) -> Option<PrefundedVotingBalanceWASM> {
        let rs_balance = self.0.prefunded_voting_balance();

        match rs_balance {
            Some(balance) => Some(balance.clone().into()),
            None => None,
        }
    }

    #[wasm_bindgen(setter = "prefundedVotingBalance")]
    pub fn set_prefunded_voting_balance(
        &mut self,
        prefunded_voting_balance: &PrefundedVotingBalanceWASM,
    ) {
        self.0.set_prefunded_voting_balance(
            prefunded_voting_balance.index_name(),
            prefunded_voting_balance.credits(),
        )
    }

    #[wasm_bindgen(js_name = "clearPrefundedVotingBalance")]
    pub fn clear_prefunded_voting_balance(&mut self) {
        self.0.clear_prefunded_voting_balance()
    }

    #[wasm_bindgen(js_name = "toDocumentTransition")]
    pub fn to_document_transition(&self) -> DocumentTransitionWASM {
        let rs_transition = DocumentTransition::from(self.0.clone());

        DocumentTransitionWASM::from(rs_transition)
    }

    #[wasm_bindgen(js_name = "fromDocumentTransition")]
    pub fn from_document_transition(
        js_transition: DocumentTransitionWASM,
    ) -> Result<DocumentCreateTransitionWASM, JsValue> {
        js_transition.get_create_transition()
    }
}
