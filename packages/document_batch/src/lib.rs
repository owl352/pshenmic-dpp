use crate::generators::{
    generate_create_transition, generate_delete_transition, generate_replace_transition,
};
use dpp::document::{Document, DocumentV0};
use dpp::prelude::IdentityNonce;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::documents_batch_transition::accessors::DocumentsBatchTransitionAccessorsV0;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::v0_methods::DocumentBaseTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::{
    DocumentTransition, DocumentTransitionV0Methods,
};
use dpp::state_transition::documents_batch_transition::{
    DocumentCreateTransition, DocumentDeleteTransition, DocumentReplaceTransition,
    DocumentsBatchTransition, DocumentsBatchTransitionV0,
};
use dpp::state_transition::{StateTransition, StateTransitionLike};
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_enums::batch::batch_enum::BatchType;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

mod generators;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=DocumentBatchWASM)]
pub struct DocumentBatchWASM {
    batch: DocumentsBatchTransition,
    document: DocumentWASM,
}

impl From<(DocumentTransition, DocumentsBatchTransition)> for DocumentBatchWASM {
    fn from(
        (document_transition, batch): (DocumentTransition, DocumentsBatchTransition),
    ) -> DocumentBatchWASM {
        let data_contract_id = document_transition.base().data_contract_id();
        let document_type_name = document_transition.base().document_type_name();
        let entropy = document_transition.entropy();

        let default = BTreeMap::new();
        let properties = document_transition.data().unwrap_or(&default);

        let document = DocumentV0 {
            id: document_transition.get_id(),
            owner_id: batch.owner_id(),
            properties: properties.clone(),
            revision: document_transition.revision(),
            created_at: None,
            updated_at: None,
            transferred_at: None,
            created_at_block_height: None,
            updated_at_block_height: None,
            transferred_at_block_height: None,
            created_at_core_block_height: None,
            updated_at_core_block_height: None,
            transferred_at_core_block_height: None,
        };

        let normal_entropy = match entropy {
            Some(entropy) => {
                let mut entropy_sized = [0u8; 32];
                let bytes = entropy.as_slice();
                let len = bytes.len().min(32);
                entropy_sized[..len].copy_from_slice(&bytes[..len]);
                Some(entropy_sized)
            }
            None => None,
        };

        DocumentBatchWASM {
            batch: batch.clone(),
            document: DocumentWASM::from_batch(
                Document::V0(document),
                data_contract_id,
                document_type_name.to_string(),
                normal_entropy,
            ),
        }
    }
}

#[wasm_bindgen]
impl DocumentBatchWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        batch_type: BatchType,
        document: DocumentWASM,
        identity_contract_nonce: IdentityNonce,
    ) -> Result<DocumentBatchWASM, JsValue> {
        let data_contract_id = document.rs_get_data_contract_id();
        let document_type_name = document.get_document_type_name();
        let owner_id = document.rs_get_owner_id();

        match document.get_entropy() {
            Some(_entropy) => Ok(match batch_type {
                BatchType::CREATE => {
                    let create_transition: DocumentCreateTransition = generate_create_transition(
                        document.clone(),
                        identity_contract_nonce,
                        document_type_name.to_string(),
                        data_contract_id,
                    );

                    DocumentBatchWASM {
                        batch: DocumentsBatchTransition::V0(DocumentsBatchTransitionV0 {
                            owner_id,
                            transitions: [DocumentTransition::Create(create_transition)].to_vec(),
                            user_fee_increase: 0,
                            signature_public_key_id: 0,
                            signature: Default::default(),
                        }),
                        document,
                    }
                }
                BatchType::DELETE => {
                    let delete_transition: DocumentDeleteTransition = generate_delete_transition(
                        document.clone(),
                        identity_contract_nonce,
                        document_type_name.to_string(),
                        data_contract_id,
                    );

                    DocumentBatchWASM {
                        batch: DocumentsBatchTransition::V0(DocumentsBatchTransitionV0 {
                            owner_id,
                            transitions: [DocumentTransition::Delete(delete_transition)].to_vec(),
                            user_fee_increase: 0,
                            signature_public_key_id: 0,
                            signature: Default::default(),
                        }),
                        document,
                    }
                }
                BatchType::REPLACE => {
                    let replace_transition: DocumentReplaceTransition = generate_replace_transition(
                        document.clone(),
                        identity_contract_nonce,
                        document_type_name.to_string(),
                        data_contract_id,
                    );

                    DocumentBatchWASM {
                        batch: DocumentsBatchTransition::V0(DocumentsBatchTransitionV0 {
                            owner_id,
                            transitions: [DocumentTransition::Replace(replace_transition)].to_vec(),
                            user_fee_increase: 0,
                            signature_public_key_id: 0,
                            signature: Default::default(),
                        }),
                        document,
                    }
                }
            }),
            None => wasm_bindgen::throw_str("Entropy is empty"),
        }
    }

    #[wasm_bindgen(js_name=toStateTransition)]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        let st = StateTransition::from(self.batch.clone());

        StateTransitionWASM::from(st)
    }

    #[wasm_bindgen(js_name=toBytes)]
    pub fn to_bytes(&self) -> Result<JsValue, JsValue> {
        let bytes = self.batch.serialize_to_bytes().with_js_error();

        match bytes {
            Ok(bytes) => Ok(JsValue::from(bytes.clone())),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name=fromStateTransition)]
    pub fn from_state_transition(
        state_transition: StateTransitionWASM,
    ) -> Result<DocumentBatchWASM, JsValue> {
        let rs_st = StateTransition::from(state_transition);

        match rs_st {
            StateTransition::DocumentsBatch(batch) => {
                let transition = batch.transitions().first();

                match transition {
                    None => Err(JsValue::from_str("No transition")),
                    Some(document_transition) => Ok(DocumentBatchWASM::from((
                        document_transition.clone(),
                        batch,
                    ))),
                }
            }
            _ => Err(JsValue::from_str("Invalid state transition")),
        }
    }

    #[wasm_bindgen(js_name=fromBytes)]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<DocumentBatchWASM, JsValue> {
        let batch_transition =
            DocumentsBatchTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error();

        match batch_transition {
            Ok(batch) => {
                let transition = batch.transitions().first();

                match transition {
                    None => Err(JsValue::from_str("No transition")),
                    Some(document_transition) => Ok(DocumentBatchWASM::from((
                        document_transition.clone(),
                        batch,
                    ))),
                }
            }
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name=getDocument)]
    pub fn get_document(&self) -> DocumentWASM {
        self.document.clone()
    }

    #[wasm_bindgen(js_name=getSignature)]
    pub fn get_signature(&self) -> Vec<u8> {
        self.batch.signature().to_vec()
    }
}
