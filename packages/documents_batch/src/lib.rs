use crate::document_transition::DocumentTransitionWASM;
use dpp::fee::Credits;
use dpp::identity::KeyID;
use dpp::platform_value::BinaryData;
use dpp::prelude::{IdentityNonce, UserFeeIncrease};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::documents_batch_transition::accessors::DocumentsBatchTransitionAccessorsV0;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentTransition;
use dpp::state_transition::documents_batch_transition::methods::v0::DocumentsBatchTransitionMethodsV0;
use dpp::state_transition::documents_batch_transition::{
    DocumentsBatchTransition, DocumentsBatchTransitionV0,
};
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::{IntoWasm, WithJsError, identifier_from_js_value};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

pub mod document_base_transition;
pub mod document_transition;
pub mod generators;
pub mod prefunded_voting_balance;
pub mod transitions;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=DocumentsBatchWASM)]
pub struct DocumentsBatchWASM(DocumentsBatchTransition);

impl From<DocumentsBatchTransition> for DocumentsBatchWASM {
    fn from(transition: DocumentsBatchTransition) -> Self {
        DocumentsBatchWASM(transition)
    }
}

impl From<DocumentsBatchWASM> for DocumentsBatchTransition {
    fn from(wrapper: DocumentsBatchWASM) -> Self {
        wrapper.0
    }
}

#[wasm_bindgen]
impl DocumentsBatchWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document_transitions: js_sys::Array,
        js_owner_id: JsValue,
        user_fee_increase: Option<UserFeeIncrease>,
        signature_public_key_id: Option<KeyID>,
        signature: Option<Vec<u8>>,
    ) -> Result<DocumentsBatchWASM, JsValue> {
        let owner_id = identifier_from_js_value(&js_owner_id)?;

        let transitions: Vec<DocumentTransition> = document_transitions
            .iter()
            .map(|js_document_transition| {
                let document_transition: DocumentTransitionWASM = js_document_transition
                    .to_wasm::<DocumentTransitionWASM>("DocumentTransitionWASM")
                    .unwrap()
                    .clone();

                DocumentTransition::from(document_transition.clone().clone())
            })
            .collect();

        Ok(DocumentsBatchWASM(DocumentsBatchTransition::V0(
            DocumentsBatchTransitionV0 {
                owner_id,
                transitions,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: signature_public_key_id.unwrap_or(0),
                signature: BinaryData::from(signature.unwrap_or(Vec::new())),
            },
        )))
    }

    #[wasm_bindgen(getter = "transitions")]
    pub fn get_transitions(&self) -> Vec<DocumentTransitionWASM> {
        let rs_transitions = self.0.transitions();

        rs_transitions
            .iter()
            .map(|transition| DocumentTransitionWASM::from(transition.clone()))
            .collect()
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(getter = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> KeyID {
        self.0.signature_public_key_id()
    }

    #[wasm_bindgen(getter = "allPurchasesAmount")]
    pub fn get_all_purchases_amount(&self) -> Result<Option<Credits>, JsValue> {
        self.0.all_purchases_amount().with_js_error()
    }

    #[wasm_bindgen(getter = "ownerId")]
    pub fn get_owner_id(&self) -> Vec<u8> {
        self.0.owner_id().to_vec()
    }

    #[wasm_bindgen(getter = "modifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Result<JsValue, JsValue> {
        let vec_of_ids: Vec<Vec<u8>> = self
            .0
            .modified_data_ids()
            .iter()
            .map(|id| id.to_vec())
            .collect();

        serde_wasm_bindgen::to_value(&vec_of_ids).map_err(JsValue::from)
    }

    #[wasm_bindgen(getter = "allConflictingIndexCollateralVotingFunds")]
    pub fn get_all_conflicting_index_collateral_voting_funds(
        &self,
    ) -> Result<Option<Credits>, JsValue> {
        self.0
            .all_conflicting_index_collateral_voting_funds()
            .with_js_error()
    }

    #[wasm_bindgen(setter = "transitions")]
    pub fn set_transitions(&mut self, transitions: Vec<DocumentTransitionWASM>) {
        let rs_transitions = transitions
            .iter()
            .map(|transition| DocumentTransition::from(transition.clone().clone()))
            .collect();

        self.0.set_transitions(rs_transitions);
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, js_signature: Vec<u8>) {
        self.0.set_signature(BinaryData::from(js_signature))
    }

    #[wasm_bindgen(setter = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: KeyID) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[wasm_bindgen(js_name = "setIdentityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: IdentityNonce) {
        self.0.set_identity_contract_nonce(nonce)
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        let st = StateTransition::from(self.0.clone());

        StateTransitionWASM::from(st)
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        state_transition: &StateTransitionWASM,
    ) -> Result<DocumentsBatchWASM, JsValue> {
        let rs_transition: StateTransition = StateTransition::from(state_transition.clone());

        match rs_transition {
            StateTransition::DocumentsBatch(batch) => Ok(DocumentsBatchWASM(batch)),
            _ => Err(JsValue::from("invalid state document_transition content")),
        }
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error();

        match bytes {
            Ok(bytes) => Ok(JsValue::from(bytes.clone())),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<DocumentsBatchWASM, JsValue> {
        let rs_batch =
            DocumentsBatchTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(DocumentsBatchWASM::from(rs_batch))
    }
}
