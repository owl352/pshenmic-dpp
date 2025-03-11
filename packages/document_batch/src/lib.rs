use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_enums::batch::batch_enum::BatchType;
use crate::generators::{
    generate_create_transition, generate_delete_transition, generate_replace_transition,
};
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use pshenmic_dpp_mock_bls::MockBLS;
use pshenmic_dpp_private_key::PrivateKeyWASM;
use pshenmic_dpp_utils::WithJsError;
use dpp::document::{Document, DocumentV0};
use dpp::prelude::IdentityNonce;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::documents_batch_transition::accessors::DocumentsBatchTransitionAccessorsV0;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::v0_methods::DocumentBaseTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_create_transition::v0::v0_methods::DocumentCreateTransitionV0Methods;
use dpp::state_transition::documents_batch_transition::document_transition::{
    DocumentTransition, DocumentTransitionV0Methods,
};
use dpp::state_transition::documents_batch_transition::{
    DocumentCreateTransition, DocumentDeleteTransition, DocumentReplaceTransition,
    DocumentsBatchTransition, DocumentsBatchTransitionV0,
};
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use std::collections::BTreeMap;
use dpp::identity::KeyType;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use pshenmic_dpp_enums::keys::key_type::KeyTypeWASM;

mod generators;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=DocumentBatchWASM)]
pub struct DocumentBatchWASM {
    batch: DocumentsBatchTransition,
    document: DocumentWASM,
}

#[wasm_bindgen]
impl DocumentBatchWASM {
    #[wasm_bindgen(js_name=new)]
    pub fn new(
        batch_type: BatchType,
        document: DocumentWASM,
        identity_contract_nonce: IdentityNonce,
    ) -> Result<DocumentBatchWASM, JsValue> {
        let data_contract_id = document.get_data_contract_id();
        let document_type_name = document.get_document_type_name();

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
                            owner_id: document.get_owner_id(),
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
                            owner_id: document.get_owner_id(),
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
                            owner_id: document.get_owner_id(),
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
    #[wasm_bindgen(js_name=sign)]
    pub fn sign(
        &mut self,
        private_key: PrivateKeyWASM,
        public_key: IdentityPublicKeyWASM,
    ) -> Result<JsValue, JsValue> {
        let mut st = StateTransition::from(self.batch.clone());

        let sig = st.sign(
            &public_key.get_key(),
            private_key.get_key().to_bytes().as_slice(),
            &MockBLS {},
        );

        let bytes = match sig {
            Ok(_sig) => {
                self.batch.set_signature(st.signature().clone());
                self.batch.set_signature_public_key_id(st.signature_public_key_id().unwrap());
                st.serialize_to_bytes()
            },
            Err(e) => wasm_bindgen::throw_str(&e.to_string()),
        };

        match bytes {
            Ok(bytes) => Ok(JsValue::from(bytes.clone())),
            Err(e) => Ok(JsValue::from_str(&format!("{}", e))),
        }
    }

    #[wasm_bindgen(js_name=signByPrivateKey)]
    pub fn sign_by_private_key(
        &mut self,
        private_key: PrivateKeyWASM,
        key_type: KeyTypeWASM
    ) -> JsValue {
        let mut st = StateTransition::from(self.batch.clone());

        let _sig = st.sign_by_private_key(
            &private_key.get_key().to_bytes().as_slice(),
            KeyType::from(key_type),
            &MockBLS {},
        ).with_js_error();

        self.batch.set_signature(st.signature().clone());
        self.batch.set_signature_public_key_id(st.signature_public_key_id().unwrap());

        let bytes = st
          .serialize_to_bytes()
          .with_js_error();

        match bytes {
            Ok(bytes) => JsValue::from(bytes.clone()),
            Err(err) => err
        }
    }

    #[wasm_bindgen(js_name=toBuffer)]
    pub fn to_buffer(&self) -> Result<JsValue, JsValue> {
        let bytes = &StateTransition::from(self.batch.clone())
          .serialize_to_bytes()
          .expect("Serialization failed");

        Ok(JsValue::from(bytes.clone()))
    }

    #[wasm_bindgen(js_name=fromBuffer)]
    pub fn from_buffer(bytes: Vec<u8>) -> Result<DocumentBatchWASM, JsValue> {
        let batch = &StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        match batch {
            StateTransition::DocumentsBatch(batch) => {
                let transition = batch.transitions().first();

                match transition {
                    None => Err(JsValue::from_str("No transition")),
                    Some(document_transition) => {
                        let data_contract_id = document_transition.base().data_contract_id();
                        let document_type_name = document_transition.base().document_type_name();
                        let entropy = document_transition.entropy();

                        let document: DocumentV0 = match document_transition {
                            DocumentTransition::Create(create_transition) => DocumentV0 {
                                id: document_transition.get_id(),
                                owner_id: batch.owner_id(),
                                properties: create_transition.data().clone(),
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
                            },
                            DocumentTransition::Replace(_replace_transition) => DocumentV0 {
                                id: document_transition.get_id(),
                                owner_id: batch.owner_id(),
                                properties: BTreeMap::new(),
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
                            },
                            DocumentTransition::Delete(_delete_transition) => DocumentV0 {
                                id: document_transition.get_id(),
                                owner_id: batch.owner_id(),
                                properties: BTreeMap::new(),
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
                            },
                            DocumentTransition::Transfer(_transfer_transition) => DocumentV0 {
                                id: document_transition.get_id(),
                                owner_id: batch.owner_id(),
                                properties: BTreeMap::new(),
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
                            },
                            DocumentTransition::UpdatePrice(_update_price_transition) => {
                                DocumentV0 {
                                    id: document_transition.get_id(),
                                    owner_id: batch.owner_id(),
                                    properties: BTreeMap::new(),
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
                                }
                            }
                            DocumentTransition::Purchase(_purchase_transition) => DocumentV0 {
                                id: document_transition.get_id(),
                                owner_id: batch.owner_id(),
                                properties: BTreeMap::new(),
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
                            },
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

                        Ok(DocumentBatchWASM {
                            batch: batch.clone(),
                            document: DocumentWASM::from_batch(
                                Document::V0(document),
                                data_contract_id,
                                document_type_name.to_string(),
                                normal_entropy,
                            ),
                        })
                    }
                }
            }
            _ => Err(JsValue::from_str("incorrect batch type")),
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
