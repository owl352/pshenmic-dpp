mod methods;

use std::collections::BTreeMap;
use dpp::document::{Document, DocumentV0Getters};
use dpp::identifier::Identifier;
use dpp::identity::TimestampMillis;
use dpp::platform_value::Value;
use dpp::prelude::{BlockHeight, CoreBlockHeight, Revision};
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name = DocumentWASM)]
pub struct DocumentWASM {
  id: Identifier,
  owner_id: Identifier,
  revision: Option<Revision>,
  data_contract_id: Identifier,
  document_type_name: String,
  properties: BTreeMap<String, Value>,
  created_at: Option<TimestampMillis>,
  updated_at: Option<TimestampMillis>,
  transferred_at: Option<TimestampMillis>,
  created_at_block_height: Option<BlockHeight>,
  updated_at_block_height: Option<BlockHeight>,
  transferred_at_block_height: Option<BlockHeight>,
  created_at_core_block_height: Option<CoreBlockHeight>,
  updated_at_core_block_height: Option<CoreBlockHeight>,
  transferred_at_core_block_height: Option<CoreBlockHeight>,
  entropy: Option<[u8; 32]>,
}

impl DocumentWASM {
  pub fn from_batch(document: Document, data_contract_id: Identifier, document_type_name: String, entropy: Option<[u8; 32]>) -> Self {
    DocumentWASM {
      id: document.id(),
      owner_id: document.owner_id(),
      revision: document.revision(),
      data_contract_id,
      document_type_name,
      properties: document.properties().clone(),
      created_at: document.created_at(),
      updated_at: document.updated_at(),
      transferred_at: document.transferred_at(),
      created_at_block_height: document.created_at_block_height(),
      updated_at_block_height: document.updated_at_block_height(),
      transferred_at_block_height: document.transferred_at_block_height(),
      created_at_core_block_height: document.created_at_core_block_height(),
      updated_at_core_block_height: document.updated_at_core_block_height(),
      transferred_at_core_block_height: document.transferred_at_core_block_height(),
      entropy
    }
  }
}