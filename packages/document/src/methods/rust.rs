use crate::DocumentWASM;
use dpp::identifier::Identifier;
use dpp::platform_value::Value;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::prelude::Revision;
use dpp::util::entropy_generator;
use dpp::util::entropy_generator::EntropyGenerator;
use std::collections::BTreeMap;

impl DocumentWASM {
    pub fn new(
        document: BTreeMap<String, Value>,
        document_type_name: &str,
        revision: u64,
        data_contract_id: &str,
        owner_id: &str,
    ) -> Self {
        let owner_id = Identifier::from_string(owner_id, Base58).unwrap();
        let data_contract_id = Identifier::from_string(data_contract_id, Base58).unwrap();
        let revision = Revision::from(revision);

        let entropy = entropy_generator::DefaultEntropyGenerator
            .generate()
            .unwrap();

        let document_id = pshenmic_dpp_utils::generate_document_id_v0(
            &data_contract_id,
            &owner_id,
            document_type_name,
            &entropy,
        );

        DocumentWASM {
            owner_id,
            entropy: Some(entropy),
            id: document_id,
            document_type_name: document_type_name.to_string(),
            data_contract_id,
            properties: document,
            revision: Some(revision),
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

    pub fn get_id(&self) -> Identifier {
        self.id
    }

    pub fn get_entropy(&self) -> Option<[u8; 32]> {
        self.entropy
    }

    pub fn get_data_contract_id(&self) -> Identifier {
        self.data_contract_id
    }

    pub fn get_owner_id(&self) -> Identifier {
        self.owner_id
    }

    pub fn get_properties(&self) -> BTreeMap<String, Value> {
        self.properties.clone()
    }

    pub fn set_id(&mut self, id: Identifier) {
        self.id = id
    }

    pub fn set_entropy(&mut self, entropy: Option<[u8; 32]>) {
        self.entropy = entropy;
    }

    pub fn set_data_contract_id(&mut self, data_contract_id: Identifier) {
        self.data_contract_id = data_contract_id
    }

    pub fn set_owner_id(&mut self, id: Identifier) {
        self.owner_id = id
    }

    pub fn set_properties(&mut self, properties: BTreeMap<String, Value>) {
        self.properties = properties
    }
}
