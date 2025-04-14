use crate::DocumentWASM;
use dpp::ProtocolError;
use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::JsonValue;
use dpp::document::Document;
use dpp::document::serialization_traits::DocumentPlatformConversionMethodsV0;
use dpp::identifier::Identifier;
use dpp::platform_value::Value;
use dpp::platform_value::converter::serde_json::BTreeValueJsonConverter;
use dpp::prelude::Revision;
use dpp::util::entropy_generator;
use dpp::util::entropy_generator::EntropyGenerator;
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::{ToSerdeJSONExt, WithJsError};
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl DocumentWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        js_raw_document: JsValue,
        js_document_type_name: &str,
        js_revision: u64,
        js_data_contract_id: &IdentifierWASM,
        js_owner_id: &IdentifierWASM,
        js_document_id: JsValue,
    ) -> Result<DocumentWASM, JsValue> {
        let revision = Revision::from(js_revision);

        let document = js_raw_document
            .with_serde_to_platform_value_map()
            .expect("cannot convert document to platform value map");

        let revision = Revision::from(revision);

        let entropy = entropy_generator::DefaultEntropyGenerator
            .generate()
            .unwrap();

        let document_id: IdentifierWASM = match js_document_id.is_undefined() {
            true => pshenmic_dpp_utils::generate_document_id_v0(
                &js_data_contract_id.into(),
                &js_owner_id.into(),
                js_document_type_name,
                &entropy,
            )?
            .into(),
            false => js_document_id.try_into()?,
        };

        Ok(DocumentWASM {
            owner_id: js_owner_id.clone(),
            entropy: Some(entropy),
            id: document_id,
            document_type_name: js_document_type_name.to_string(),
            data_contract_id: js_data_contract_id.clone(),
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
        })
    }

    #[wasm_bindgen(js_name=getId)]
    pub fn get_id(&self) -> IdentifierWASM {
        self.id
    }

    #[wasm_bindgen(js_name=getEntropy)]
    pub fn get_entropy(&self) -> Option<Vec<u8>> {
        match self.entropy {
            Some(entropy) => Some(entropy.to_vec()),
            None => None,
        }
    }

    #[wasm_bindgen(js_name=getDataContractId)]
    pub fn get_data_contract_id(&self) -> IdentifierWASM {
        self.data_contract_id
    }

    #[wasm_bindgen(js_name=getOwnerId)]
    pub fn get_owner_id(&self) -> IdentifierWASM {
        self.owner_id
    }

    #[wasm_bindgen(js_name=getProperties)]
    pub fn get_properties(&self) -> Result<JsValue, JsValue> {
        let json_value: JsonValue = self
            .properties
            .clone()
            .to_json_value()
            .map_err(ProtocolError::ValueError)
            .with_js_error()?;

        let js_value = json_value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())?;
        Ok(js_value)
    }

    #[wasm_bindgen(js_name=getRevision)]
    pub fn get_revision(&self) -> Option<u64> {
        self.revision
    }

    #[wasm_bindgen(js_name=getCreatedAt)]
    pub fn get_created_at(&self) -> Option<u64> {
        self.created_at
    }

    #[wasm_bindgen(js_name=getUpdatedAt)]
    pub fn get_updated_at(&self) -> Option<u64> {
        self.updated_at
    }

    #[wasm_bindgen(js_name=getTransferredAt)]
    pub fn get_transferred_at(&self) -> Option<u64> {
        self.transferred_at
    }

    #[wasm_bindgen(js_name=getCreatedAtBlockHeight)]
    pub fn get_created_at_block_height(&self) -> Option<u64> {
        self.created_at_block_height
    }

    #[wasm_bindgen(js_name=getUpdatedAtBlockHeight)]
    pub fn get_updated_at_block_height(&self) -> Option<u64> {
        self.updated_at_block_height
    }

    #[wasm_bindgen(js_name=getTransferredAtBlockHeight)]
    pub fn get_transferred_at_block_height(&self) -> Option<u64> {
        self.transferred_at_block_height
    }

    #[wasm_bindgen(js_name=getCreatedAtCoreBlockHeight)]
    pub fn get_created_at_core_block_height(&self) -> Option<u32> {
        self.created_at_core_block_height
    }

    #[wasm_bindgen(js_name=getUpdatedAtCoreBlockHeight)]
    pub fn get_updated_at_core_block_height(&self) -> Option<u32> {
        self.updated_at_core_block_height
    }

    #[wasm_bindgen(js_name=getTransferredAtCoreBlockHeight)]
    pub fn get_transferred_at_core_block_height(&self) -> Option<u32> {
        self.transferred_at_core_block_height
    }

    #[wasm_bindgen(js_name=getDocumentTypeName)]
    pub fn get_document_type_name(&self) -> String {
        self.document_type_name.clone()
    }

    #[wasm_bindgen(js_name=setId)]
    pub fn set_id(&mut self, id: &IdentifierWASM) {
        self.id = id.clone()
    }

    #[wasm_bindgen(js_name=setEntropy)]
    pub fn set_entropy(&mut self, entropy: JsValue) {
        match entropy.is_undefined() {
            false => {
                let value = entropy.with_serde_to_platform_value().unwrap();

                let mut entropy = [0u8; 32];
                let bytes = value.as_bytes().unwrap();
                let len = bytes.len().min(32);
                entropy[..len].copy_from_slice(&bytes[..len]);
                self.entropy = Some(entropy);
            }
            true => self.entropy = None,
        }
    }

    #[wasm_bindgen(js_name=setOwnerId)]
    pub fn set_owner_id(&mut self, id: &IdentifierWASM) {
        self.owner_id = id.clone()
    }

    #[wasm_bindgen(js_name=setProperties)]
    pub fn set_properties(&mut self, properties: JsValue) {
        self.properties = properties.with_serde_to_platform_value_map().unwrap()
    }

    #[wasm_bindgen(js_name=setRevision)]
    pub fn set_revision(&mut self, revision: Option<u64>) {
        self.revision = revision
    }

    #[wasm_bindgen(js_name=setCreatedAt)]
    pub fn set_created_at(&mut self, created_at: Option<u64>) {
        self.created_at = created_at
    }

    #[wasm_bindgen(js_name=setUpdatedAt)]
    pub fn set_get_updated_at(&mut self, updated_at: Option<u64>) {
        self.updated_at = updated_at
    }

    #[wasm_bindgen(js_name=setTransferredAt)]
    pub fn set_transferred_at(&mut self, transferred_at: Option<u64>) {
        self.transferred_at = transferred_at
    }

    #[wasm_bindgen(js_name=setCreatedAtBlockHeight)]
    pub fn set_created_at_block_height(&mut self, created_at_block_height: Option<u64>) {
        self.created_at_block_height = created_at_block_height
    }

    #[wasm_bindgen(js_name=setUpdatedAtBlockHeight)]
    pub fn set_updated_at_block_height(&mut self, updated_at_block_height: Option<u64>) {
        self.updated_at_block_height = updated_at_block_height
    }

    #[wasm_bindgen(js_name=setTransferredAtBlockHeight)]
    pub fn set_transferred_at_block_height(&mut self, transferred_at_block_height: Option<u64>) {
        self.transferred_at_block_height = transferred_at_block_height
    }

    #[wasm_bindgen(js_name=setCreatedAtCoreBlockHeight)]
    pub fn set_created_at_core_block_height(&mut self, created_at_core_block_height: Option<u32>) {
        self.created_at_core_block_height = created_at_core_block_height
    }

    #[wasm_bindgen(js_name=setUpdatedAtCoreBlockHeight)]
    pub fn set_updated_at_core_block_height(&mut self, updated_at_core_block_height: Option<u32>) {
        self.updated_at_core_block_height = updated_at_core_block_height
    }

    #[wasm_bindgen(js_name=setTransferredAtCoreBlockHeight)]
    pub fn set_transferred_at_core_block_height(
        &mut self,
        transferred_at_core_block_height: Option<u32>,
    ) {
        self.transferred_at_core_block_height = transferred_at_core_block_height
    }

    #[wasm_bindgen(js_name=setDocumentTypeName)]
    pub fn set_document_type_name(&mut self, document_type_name: &str) {
        self.document_type_name = document_type_name.to_string();
    }

    #[wasm_bindgen(js_name=toBytes)]
    pub fn to_bytes(
        &self,
        data_contract: &DataContractWASM,
        type_name: String,
        js_platform_version: JsValue,
    ) -> Result<Vec<u8>, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::PLATFORM_V1,
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let rs_document: Document = Document::from(self.clone());

        let document_type_ref = data_contract
            .get_document_type_ref_by_name(type_name)
            .map_err(|err| JsValue::from_str(err.to_string().as_str()))?;

        DocumentPlatformConversionMethodsV0::serialize(
            &rs_document,
            document_type_ref,
            &platform_version.into(),
        )
        .with_js_error()
    }

    #[wasm_bindgen(js_name=fromBytes)]
    pub fn from_bytes(
        bytes: Vec<u8>,
        data_contract: &DataContractWASM,
        type_name: String,
        js_platform_version: JsValue,
    ) -> Result<DocumentWASM, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::PLATFORM_V1,
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let document_type_ref = match data_contract.get_document_type_ref_by_name(type_name) {
            Ok(type_ref) => Ok(type_ref),
            Err(err) => Err(JsValue::from_str(err.to_string().as_str())),
        }?;

        let rs_document = Document::from_bytes(
            bytes.as_slice(),
            document_type_ref,
            &platform_version.into(),
        )
        .with_js_error();

        match rs_document {
            Ok(doc) => Ok(DocumentWASM::from(doc)),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name=generateId)]
    pub fn generate_id(
        js_document_type_name: &str,
        js_owner_id: &IdentifierWASM,
        js_data_contract_id: &IdentifierWASM,
        opt_entropy: Option<Vec<u8>>,
    ) -> Result<Vec<u8>, JsValue> {
        let entropy: [u8; 32] = match opt_entropy {
            Some(entropy_vec) => {
                let mut entropy = [0u8; 32];
                let bytes = entropy_vec.as_slice();
                let len = bytes.len().min(32);
                entropy[..len].copy_from_slice(&bytes[..len]);
                entropy
            }
            None => entropy_generator::DefaultEntropyGenerator
                .generate()
                .with_js_error()?,
        };

        let identifier = pshenmic_dpp_utils::generate_document_id_v0(
            &js_data_contract_id.into(),
            &js_owner_id.into(),
            js_document_type_name,
            &entropy,
        );

        match identifier {
            Ok(identifier) => Ok(identifier.to_vec()),
            Err(err) => Err(err),
        }
    }
}

impl DocumentWASM {
    pub fn rs_get_owner_id(&self) -> Identifier {
        self.owner_id.into()
    }

    pub fn rs_get_id(&self) -> Identifier {
        self.id.into()
    }

    pub fn rs_get_data_contract_id(&self) -> Identifier {
        self.data_contract_id.into()
    }

    pub fn rs_get_entropy(&self) -> Option<[u8; 32]> {
        self.entropy
    }

    pub fn rs_get_properties(&self) -> BTreeMap<String, Value> {
        self.clone().properties
    }
}
