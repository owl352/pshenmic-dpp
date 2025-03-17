use crate::DocumentWASM;
use dpp::platform_value::converter::serde_json::BTreeValueJsonConverter;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::prelude::Revision;
use pshenmic_dpp_utils::{ToSerdeJSONExt, identifier_from_js_value};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
impl DocumentWASM {
    #[wasm_bindgen(js_name=new)]
    pub fn js_new(
        js_raw_document: JsValue,
        js_document_type_name: &str,
        js_revision: u64,
        js_data_contract_id: &str,
        js_owner_id: &str,
    ) -> Self {
        let revision = Revision::from(js_revision);

        let document = js_raw_document
            .with_serde_to_platform_value_map()
            .expect("cannot convert document to platform value map");

        DocumentWASM::new(
            document,
            js_document_type_name,
            revision,
            js_data_contract_id,
            js_owner_id,
        )
    }

    #[wasm_bindgen(js_name=getId)]
    pub fn js_get_id(&self) -> JsValue {
        JsValue::from_str(self.id.to_string(Base58).as_str())
    }

    #[wasm_bindgen(js_name=getEntropy)]
    pub fn js_get_entropy(&self) -> JsValue {
        match self.entropy {
            Some(_entropy) => JsValue::from(self.entropy.unwrap().to_vec()),
            None => JsValue::undefined(),
        }
    }

    #[wasm_bindgen(js_name=getOwnerId)]
    pub fn js_get_owner_id(&self) -> JsValue {
        JsValue::from_str(self.owner_id.to_string(Base58).as_str())
    }

    #[wasm_bindgen(js_name=getProperties)]
    pub fn js_get_properties(&self) -> JsValue {
        let json = &self.properties.to_json_value().unwrap();

        let obj = json.as_object().unwrap();

        serde_wasm_bindgen::to_value(obj).unwrap()
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
    pub fn js_set_id(&mut self, id: JsValue) {
        self.id = identifier_from_js_value(&id).unwrap()
    }

    #[wasm_bindgen(js_name=setEntropy)]
    pub fn js_set_entropy(&mut self, entropy: JsValue) {
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
    pub fn js_set_owner_id(&mut self, id: JsValue) {
        self.owner_id = identifier_from_js_value(&id).unwrap()
    }

    #[wasm_bindgen(js_name=setProperties)]
    pub fn js_set_properties(&mut self, properties: JsValue) {
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
}
