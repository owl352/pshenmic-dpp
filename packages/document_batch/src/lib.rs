use crate::document_transition::DocumentTransitionWASM;
use dpp::identity::KeyID;
use dpp::platform_value::BinaryData;
use dpp::prelude::UserFeeIncrease;
use dpp::serialization::PlatformSerializable;
use dpp::state_transition::documents_batch_transition::document_transition::DocumentTransition;
use dpp::state_transition::documents_batch_transition::{
    DocumentsBatchTransition, DocumentsBatchTransitionV0,
};
use dpp::state_transition::{StateTransition, StateTransitionLike};
use pshenmic_dpp_enums::batch::batch_enum::BatchTypeWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::{WithJsError, identifier_from_js_value};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

mod document_base_transition;
mod document_transition;
mod generators;
mod prefunded_voting_balance;
mod transitions;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=DocumentBatchWASM)]
pub struct DocumentBatchWASM(DocumentsBatchTransition);

#[wasm_bindgen]
impl DocumentBatchWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        document_transitions: Vec<DocumentTransitionWASM>,
        js_owner_id: JsValue,
        user_fee_increase: UserFeeIncrease,
        signature_public_key_id: KeyID,
        signature: Vec<u8>,
    ) -> Result<DocumentBatchWASM, JsValue> {
        let owner_id = identifier_from_js_value(&js_owner_id)?;

        let transitions: Vec<DocumentTransition> = document_transitions
            .iter()
            .map(
                |document_transition| match document_transition.get_action_type() {
                    BatchTypeWASM::Create => {
                        let create_transition =
                            document_transition.get_create_transition().unwrap();

                        DocumentTransition::Create(create_transition.into())
                    }
                    BatchTypeWASM::Replace => panic!("not implemented"),
                    BatchTypeWASM::Delete => panic!("not implemented"),
                    BatchTypeWASM::Transfer => panic!("not implemented"),
                    BatchTypeWASM::Purchase => panic!("not implemented"),
                    BatchTypeWASM::UpdatePrice => panic!("not implemented"),
                    BatchTypeWASM::IgnoreWhileBumpingRevision => panic!("not implemented"),
                },
            )
            .collect();

        Ok(DocumentBatchWASM(DocumentsBatchTransition::V0(
            DocumentsBatchTransitionV0 {
                owner_id,
                transitions,
                user_fee_increase,
                signature_public_key_id,
                signature: BinaryData::from(signature),
            },
        )))
    }

    #[wasm_bindgen(js_name = "setSignature")]
    pub fn set_signature(&mut self, js_signature: Vec<u8>) {
        self.0.set_signature(BinaryData::from(js_signature))
    }

    #[wasm_bindgen(js_name=toStateTransition)]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        let st = StateTransition::from(self.0.clone());

        StateTransitionWASM::from(st)
    }

    #[wasm_bindgen(js_name=toBytes)]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.0.serialize_to_bytes().with_js_error();

        match bytes {
            Ok(bytes) => Ok(JsValue::from(bytes.clone())),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name=getSignature)]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(js_name=fromStateTransition)]
    pub fn from_state_transition(
        state_transition: StateTransitionWASM,
    ) -> Result<DocumentBatchWASM, JsValue> {
        let rs_transition: StateTransition = state_transition.into();

        match rs_transition {
            StateTransition::DocumentsBatch(batch) => Ok(DocumentBatchWASM(batch)),
            _ => Err(JsValue::from("invalid state document_transition content")),
        }
    }
}
