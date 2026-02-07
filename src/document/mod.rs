use dpp::document::serialization_traits::DocumentPlatformConversionMethodsV0;
use dpp::document::{Document, DocumentV0, DocumentV0Getters};
use dpp::identifier::Identifier;
use dpp::identity::TimestampMillis;
use dpp::platform_value::Value;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::{BlockHeight, CoreBlockHeight, Revision};
use dpp::util::entropy_generator::{self, EntropyGenerator};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::utils::{WithJsError, generate_document_id_v0, with_serde_to_platform_value_map};

#[derive(Clone)]
#[napi(js_name = "DocumentNAPI")]
pub struct DocumentNAPI {
    id: IdentifierNAPI,
    owner_id: IdentifierNAPI,
    revision: Option<Revision>,
    data_contract_id: IdentifierNAPI,
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
    creator_id: Option<IdentifierNAPI>,
}

impl From<DocumentNAPI> for Document {
    fn from(wasm_doc: DocumentNAPI) -> Self {
        Document::V0(DocumentV0 {
            id: wasm_doc.id.into(),
            owner_id: wasm_doc.owner_id.into(),
            properties: wasm_doc.properties,
            revision: wasm_doc.revision,
            created_at: wasm_doc.created_at,
            updated_at: wasm_doc.updated_at,
            transferred_at: wasm_doc.transferred_at,
            created_at_block_height: wasm_doc.created_at_block_height,
            updated_at_block_height: wasm_doc.updated_at_block_height,
            transferred_at_block_height: wasm_doc.transferred_at_block_height,
            created_at_core_block_height: wasm_doc.created_at_core_block_height,
            updated_at_core_block_height: wasm_doc.updated_at_core_block_height,
            transferred_at_core_block_height: wasm_doc.transferred_at_core_block_height,
            creator_id: wasm_doc.creator_id.map(|id| id.into()),
        })
    }
}

impl From<Document> for DocumentNAPI {
    fn from(doc: Document) -> Self {
        DocumentNAPI {
            id: doc.id().into(),
            owner_id: doc.owner_id().into(),
            revision: doc.revision(),
            data_contract_id: Identifier::default().into(),
            document_type_name: "".to_string(),
            properties: doc.properties().clone(),
            created_at: doc.created_at(),
            updated_at: doc.updated_at(),
            transferred_at: doc.transferred_at(),
            created_at_block_height: doc.created_at_block_height(),
            updated_at_block_height: doc.updated_at_block_height(),
            transferred_at_block_height: doc.transferred_at_block_height(),
            created_at_core_block_height: doc.created_at_core_block_height(),
            updated_at_core_block_height: doc.updated_at_core_block_height(),
            transferred_at_core_block_height: doc.transferred_at_core_block_height(),
            entropy: None,
            creator_id: doc.creator_id().map(|id| id.into()),
        }
    }
}

impl DocumentNAPI {
    pub fn from_batch(
        document: Document,
        data_contract_id: Identifier,
        document_type_name: String,
        entropy: Option<[u8; 32]>,
    ) -> Self {
        DocumentNAPI {
            id: document.id().into(),
            owner_id: document.owner_id().into(),
            revision: document.revision(),
            data_contract_id: data_contract_id.into(),
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
            entropy,
            creator_id: document.creator_id().map(|id| id.into()),
        }
    }
}

#[napi]
impl DocumentNAPI {
    #[napi(constructor)]
    pub fn new(
        js_raw_document: &DynamicValue,
        js_document_type_name: String,
        js_revision: BigIntString,
        js_data_contract_id: IdentifierLikeNAPI,
        js_owner_id: IdentifierLikeNAPI,
        js_document_id: Option<IdentifierLikeNAPI>,
        js_creator_id: Option<IdentifierLikeNAPI>,
    ) -> Result<DocumentNAPI, napi::Error> {
        let data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?;
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;
        let creator_id = match js_creator_id {
            Some(id) => Some(IdentifierNAPI::try_from(id)?),
            None => None,
        };

        let revision = js_revision.try_to_u64()?;

        let document = with_serde_to_platform_value_map(js_raw_document)?;

        let entropy = entropy_generator::DefaultEntropyGenerator
            .generate()
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        let document_id: IdentifierNAPI = match js_document_id {
            Some(id) => id.try_into()?,
            None => generate_document_id_v0(
                &data_contract_id.clone().into(),
                &owner_id.clone().into(),
                js_document_type_name.as_str(),
                &entropy,
            )?
            .into(),
        };

        Ok(DocumentNAPI {
            owner_id,
            entropy: Some(entropy),
            id: document_id,
            document_type_name: js_document_type_name.to_string(),
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
            creator_id,
        })
    }

    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.id.clone()
    }

    #[napi(getter, js_name = "entropy")]
    pub fn get_entropy(&self) -> Option<Uint8Array> {
        match self.entropy {
            Some(entropy) => Some(entropy.to_vec().into()),
            None => None,
        }
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        self.data_contract_id.clone()
    }

    #[napi(getter, js_name = "ownerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        self.owner_id.clone()
    }

    #[napi(getter, js_name = "properties", ts_return_type = "object")]
    pub fn get_properties(&self) -> Result<DynamicValue, napi::Error> {
        let platform_value: Vec<(Value, Value)> = self
            .properties
            .clone()
            .iter()
            .map(|(k, v)| (Value::Text(k.clone()), v.clone()))
            .collect();
        Value::Map(platform_value).try_into()
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> Option<BigIntString> {
        self.revision.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "createdAt")]
    pub fn get_created_at(&self) -> Option<BigIntString> {
        self.created_at.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "updatedAt")]
    pub fn get_updated_at(&self) -> Option<BigIntString> {
        self.updated_at.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "transferredAt")]
    pub fn get_transferred_at(&self) -> Option<BigIntString> {
        self.transferred_at.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "createdAtBlockHeight")]
    pub fn get_created_at_block_height(&self) -> Option<BigIntString> {
        self.created_at_block_height.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "updatedAtBlockHeight")]
    pub fn get_updated_at_block_height(&self) -> Option<BigIntString> {
        self.updated_at_block_height.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "transferredAtBlockHeight")]
    pub fn get_transferred_at_block_height(&self) -> Option<BigIntString> {
        self.transferred_at_block_height.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "createdAtCoreBlockHeight")]
    pub fn get_created_at_core_block_height(&self) -> Option<u32> {
        self.created_at_core_block_height
    }

    #[napi(getter, js_name = "updatedAtCoreBlockHeight")]
    pub fn get_updated_at_core_block_height(&self) -> Option<u32> {
        self.updated_at_core_block_height
    }

    #[napi(getter, js_name = "transferredAtCoreBlockHeight")]
    pub fn get_transferred_at_core_block_height(&self) -> Option<u32> {
        self.transferred_at_core_block_height
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn get_document_type_name(&self) -> String {
        self.document_type_name.clone()
    }

    #[napi(getter, js_name = "creatorId")]
    pub fn get_creator_id(&self) -> Option<IdentifierNAPI> {
        self.creator_id.clone()
    }

    #[napi(setter, js_name = "id")]
    pub fn set_id(&mut self, id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.id = IdentifierNAPI::try_from(id)?;
        Ok(())
    }

    #[napi(setter, js_name = "entropy")]
    pub fn set_entropy(&mut self, js_entropy: Option<Uint8Array>) {
        match js_entropy {
            Some(entropy_val) => {
                let mut entropy = [0u8; 32];
                let bytes = entropy_val.to_vec();
                let len = bytes.len().min(32);
                entropy[..len].copy_from_slice(&bytes[..len]);
                self.entropy = Some(entropy);
            }
            None => self.entropy = None,
        };
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_js_data_contract_id(
        &mut self,
        js_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.data_contract_id = IdentifierNAPI::try_from(js_contract_id)?;

        Ok(())
    }

    #[napi(setter, js_name = "ownerId")]
    pub fn set_owner_id(&mut self, id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.owner_id = IdentifierNAPI::try_from(id)?.clone();
        Ok(())
    }

    #[napi(setter, js_name = "properties")]
    pub fn set_properties(&mut self, properties: &DynamicValue) -> Result<(), napi::Error> {
        self.properties = with_serde_to_platform_value_map(properties)?;

        Ok(())
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: Option<BigIntString>) -> Result<(), napi::Error> {
        self.revision = revision.map(|r| r.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "createdAt")]
    pub fn set_created_at(&mut self, created_at: Option<BigIntString>) -> Result<(), napi::Error> {
        self.created_at = created_at.map(|t| t.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "updatedAt")]
    pub fn set_updated_at(&mut self, updated_at: Option<BigIntString>) -> Result<(), napi::Error> {
        self.updated_at = updated_at.map(|t| t.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "transferredAt")]
    pub fn set_transferred_at(
        &mut self,
        transferred_at: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.transferred_at = transferred_at.map(|t| t.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "createdAtBlockHeight")]
    pub fn set_created_at_block_height(
        &mut self,
        created_at_block_height: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.created_at_block_height = created_at_block_height
            .map(|t| t.try_to_u64())
            .transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "updatedAtBlockHeight")]
    pub fn set_updated_at_block_height(
        &mut self,
        updated_at_block_height: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.updated_at_block_height = updated_at_block_height
            .map(|t| t.try_to_u64())
            .transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "transferredAtBlockHeight")]
    pub fn set_transferred_at_block_height(
        &mut self,
        transferred_at_block_height: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.transferred_at_block_height = transferred_at_block_height
            .map(|t| t.try_to_u64())
            .transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "createdAtCoreBlockHeight")]
    pub fn set_created_at_core_block_height(&mut self, created_at_core_block_height: Option<u32>) {
        self.created_at_core_block_height = created_at_core_block_height
    }

    #[napi(setter, js_name = "updatedAtCoreBlockHeight")]
    pub fn set_updated_at_core_block_height(&mut self, updated_at_core_block_height: Option<u32>) {
        self.updated_at_core_block_height = updated_at_core_block_height
    }

    #[napi(setter, js_name = "transferredAtCoreBlockHeight")]
    pub fn set_transferred_at_core_block_height(
        &mut self,
        transferred_at_core_block_height: Option<u32>,
    ) {
        self.transferred_at_core_block_height = transferred_at_core_block_height
    }

    #[napi(setter, js_name = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.document_type_name = document_type_name.to_string();
    }

    #[napi(setter, js_name = "creatorId")]
    pub fn set_creator_id(
        &mut self,
        js_creator_id: Option<IdentifierLikeNAPI>,
    ) -> Result<(), napi::Error> {
        let creator_id = match js_creator_id {
            None => None,
            Some(id) => Some(IdentifierNAPI::try_from(id)?),
        };

        self.creator_id = creator_id;

        Ok(())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(
        &self,
        data_contract: &DataContractNAPI,
        js_platform_version: &DynamicValue,
    ) -> Result<Uint8Array, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let rs_document: Document = Document::from(self.clone());

        let document_type_ref = data_contract
            .get_document_type_ref_by_name(self.get_document_type_name())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(DocumentPlatformConversionMethodsV0::serialize(
            &rs_document,
            document_type_ref,
            &data_contract.clone().into(),
            &platform_version.into(),
        )
        .with_js_error()?
        .into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(
        &self,
        data_contract: &DataContractNAPI,
        js_platform_version: &DynamicValue,
    ) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(data_contract, js_platform_version)?
                .to_vec()
                .as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(
        &self,
        data_contract: &DataContractNAPI,
        js_platform_version: &DynamicValue,
    ) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(data_contract, js_platform_version)?
                .to_vec()
                .as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(
        bytes: Uint8Array,
        data_contract: &DataContractNAPI,
        type_name: String,
        js_platform_version: &DynamicValue,
    ) -> Result<DocumentNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let document_type_ref = match data_contract.get_document_type_ref_by_name(type_name.clone())
        {
            Ok(type_ref) => Ok(type_ref),
            Err(err) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                err.to_string(),
            )),
        }?;

        let rs_document = Document::from_bytes(
            bytes.to_vec().as_slice(),
            document_type_ref,
            &platform_version.into(),
        )
        .with_js_error()?;

        let mut js_document = DocumentNAPI::from(rs_document);

        js_document.set_document_type_name(type_name.clone());
        js_document.set_data_contract_id(&data_contract.get_id());

        Ok(js_document)
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(
        hex: String,
        data_contract: &DataContractNAPI,
        type_name: String,
        js_platform_version: &DynamicValue,
    ) -> Result<DocumentNAPI, napi::Error> {
        DocumentNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
            data_contract,
            type_name,
            js_platform_version,
        )
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(
        base64: String,
        data_contract: &DataContractNAPI,
        type_name: String,
        js_platform_version: &DynamicValue,
    ) -> Result<DocumentNAPI, napi::Error> {
        DocumentNAPI::from_bytes(
            decode(base64.as_str(), Base64)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
            data_contract,
            type_name,
            js_platform_version,
        )
    }

    #[napi(js_name = "generateId")]
    pub fn generate_id(
        js_document_type_name: String,
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        opt_entropy: Option<Uint8Array>,
    ) -> Result<IdentifierNAPI, napi::Error> {
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;
        let data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?;

        let entropy: [u8; 32] = match opt_entropy {
            Some(entropy_vec) => {
                let mut entropy = [0u8; 32];
                let bytes = entropy_vec.to_vec();
                let len = bytes.len().min(32);
                entropy[..len].copy_from_slice(&bytes[..len]);
                entropy
            }
            None => entropy_generator::DefaultEntropyGenerator
                .generate()
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?,
        };

        let identifier = generate_document_id_v0(
            &data_contract_id.into(),
            &owner_id.into(),
            js_document_type_name.as_str(),
            &entropy,
        );

        match identifier {
            Ok(identifier) => Ok(identifier.into()),
            Err(err) => Err(err),
        }
    }
}

impl DocumentNAPI {
    pub fn rs_get_owner_id(&self) -> Identifier {
        self.owner_id.clone().into()
    }

    pub fn rs_get_revision(&self) -> Option<Revision> {
        self.revision
    }

    pub fn rs_get_id(&self) -> Identifier {
        self.id.clone().into()
    }

    pub fn rs_get_data_contract_id(&self) -> Identifier {
        self.data_contract_id.clone().into()
    }

    pub fn rs_get_entropy(&self) -> Option<[u8; 32]> {
        self.entropy
    }

    pub fn rs_get_properties(&self) -> BTreeMap<String, Value> {
        self.clone().properties
    }

    fn set_data_contract_id(&mut self, data_contract_id: &IdentifierNAPI) {
        self.data_contract_id = data_contract_id.clone();
    }
}
