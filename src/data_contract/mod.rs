use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::token_configuration::TokenConfigurationNAPI;
use crate::token_configuration::group::GroupNAPI;
use crate::utils::{WithJsError, with_serde_to_platform_value_map};
use dpp::data_contract::accessors::v0::{DataContractV0Getters, DataContractV0Setters};
use dpp::data_contract::accessors::v1::{DataContractV1Getters, DataContractV1Setters};
use dpp::data_contract::config::DataContractConfig;
use dpp::data_contract::conversion::value::v0::DataContractValueConversionMethodsV0;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::errors::DataContractError;
use dpp::data_contract::group::Group;
use dpp::data_contract::schema::DataContractSchemaMethodsV0;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::data_contract::{
    DataContract, GroupContractPosition, TokenConfiguration, TokenContractPosition,
};
use dpp::platform_value::string_encoding::Encoding::{Base58, Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::platform_value::{Value, ValueMap};
use dpp::serialization::{
    PlatformDeserializableWithPotentialValidationFromVersionedStructure,
    PlatformSerializableWithPlatformVersion,
};
use dpp::version::{PlatformVersion, TryIntoPlatformVersioned};
use dpp::{ProtocolError, platform_value};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;
use std::collections::BTreeMap;

#[napi(js_name = "DataContractNAPI")]
#[derive(Clone)]
pub struct DataContractNAPI(DataContract);

impl From<DataContract> for DataContractNAPI {
    fn from(v: DataContract) -> Self {
        DataContractNAPI(v)
    }
}

impl From<DataContractNAPI> for DataContract {
    fn from(v: DataContractNAPI) -> Self {
        v.0
    }
}

#[napi]
impl DataContractNAPI {
    #[napi(constructor)]
    pub fn from_js_values(
        js_owner_id: IdentifierLikeNAPI,
        js_identity_nonce: BigIntString,
        js_schema: &DynamicValue,
        js_definitions: &DynamicValue,
        js_tokens: Option<Vec<(u16, &TokenConfigurationNAPI)>>,
        full_validation: Option<bool>,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;

        let owner_id_value = Value::from(owner_id.base58());

        let identity_nonce = js_identity_nonce.try_to_u64()?;

        let schema: Value = js_schema.clone().try_into()?;

        let tokens: BTreeMap<TokenContractPosition, TokenConfiguration> = match js_tokens {
            Some(tokens) => tokens
                .into_iter()
                .map(|(pos, config)| (pos.clone(), config.clone().into()))
                .collect(),
            None => BTreeMap::new(),
        };

        let platform_version: PlatformVersion = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default().into(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?.into(),
        };

        let data_contract_structure_version_value = Value::from(
            platform_version
                .dpp
                .contract_versions
                .contract_structure_version
                .to_string(),
        );

        let definitions: Option<Value> = match js_definitions.is_undefined_or_null() {
            true => None,
            false => Some(js_definitions.clone().try_into()?),
        };

        let definitions_value = Value::from(definitions);

        let data_contract_id =
            DataContract::generate_data_contract_id_v0(owner_id.bytes(), identity_nonce);

        let data_contract_id_value = Value::from(data_contract_id.to_string(Base58));

        let config =
            DataContractConfig::default_for_version(&platform_version.clone()).with_js_error()?;

        let config_value = platform_value::to_value(config)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        let mut contract_value = Value::Map(ValueMap::new());

        contract_value
            .set_value("$formatVersion", data_contract_structure_version_value)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("id", data_contract_id_value)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("config", config_value)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("version", Value::from(1u16))
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("ownerId", owner_id_value)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("schemaDefs", definitions_value)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        contract_value
            .set_value("documentSchemas", schema)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        // data contract from value require human readable values, when identifier .toValue() returns bytes
        // for fix we convert all to json and then to value, because identifier => json = string instead bytes
        let tokens_value_map: Vec<(Value, Value)> = tokens
            .into_iter()
            .map(|(pos, config)| {
                serde_json::to_value(config)
                    .map(|json| (Value::Text(pos.to_string()), Value::from(json)))
                    .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))
            })
            .collect::<Result<_, napi::Error>>()?;

        contract_value
            .set_value("tokens", Value::Map(tokens_value_map))
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        let data_contract = DataContract::from_value(
            contract_value,
            full_validation.unwrap_or(true),
            &platform_version,
        )
        .with_js_error()?;

        Ok(DataContractNAPI(data_contract))
    }

    #[napi(js_name = "fromValue")]
    pub fn from_value(
        js_value: &DynamicValue,
        full_validation: bool,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let value: Value = js_value.clone().try_into()?;

        let contract = DataContract::from_value(value, full_validation, &platform_version.into())
            .with_js_error()?;

        Ok(DataContractNAPI(contract))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(
        js_bytes: Uint8Array,
        full_validation: bool,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let bytes = js_bytes.to_vec();

        let rs_data_contract = DataContract::versioned_deserialize(
            &bytes.as_slice(),
            full_validation,
            &platform_version.into(),
        )
        .with_js_error()?;

        Ok(DataContractNAPI(rs_data_contract))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(
        hex: String,
        full_validation: bool,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        DataContractNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
            full_validation,
            js_platform_version,
        )
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(
        base64: String,
        full_validation: bool,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        DataContractNAPI::from_bytes(
            decode(base64.as_str(), Base64)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
            full_validation,
            js_platform_version,
        )
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self, js_platform_version: &DynamicValue) -> Result<Uint8Array, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let rs_data_contract: DataContract = self.0.clone();

        rs_data_contract
            .serialize_to_bytes_with_platform_version(&platform_version.into())
            .with_js_error()
            .map(Into::into)
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self, js_platform_version: &DynamicValue) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(js_platform_version)?.to_vec().as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self, js_platform_version: &DynamicValue) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(js_platform_version)?.to_vec().as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "toValue")]
    pub fn to_value(
        &self,
        js_platform_version: &DynamicValue,
    ) -> Result<DynamicValue, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let value = self
            .0
            .clone()
            .to_value(&platform_version.into())
            .with_js_error()?;

        value.try_into()
    }

    #[napi(getter, js_name = "systemVersion")]
    pub fn data_contract_protocol_version(&self) -> u16 {
        self.0.system_version_type()
    }

    #[napi(setter, js_name = "systemVersion")]
    pub fn set_data_contract_protocol_version(&mut self, version: u8) -> Result<(), napi::Error> {
        match version {
            0 => {
                let platform_versioned_contract: Result<
                    DataContractInSerializationFormat,
                    ProtocolError,
                > = self
                    .0
                    .clone()
                    .try_into_platform_versioned(&PlatformVersionNAPI::PLATFORM_V8.into());

                self.0 = DataContract::try_from_platform_versioned(
                    platform_versioned_contract.with_js_error()?,
                    true,
                    &mut vec![],
                    &PlatformVersionNAPI::PLATFORM_V8.into(),
                )
                .with_js_error()?;

                Ok(())
            }
            1 => {
                let platform_versioned_contract: Result<
                    DataContractInSerializationFormat,
                    ProtocolError,
                > = self
                    .0
                    .clone()
                    .try_into_platform_versioned(&PlatformVersionNAPI::PLATFORM_V10.into());

                self.0 = DataContract::try_from_platform_versioned(
                    platform_versioned_contract.with_js_error()?,
                    true,
                    &mut vec![],
                    &PlatformVersionNAPI::PLATFORM_V10.into(),
                )
                .with_js_error()?;

                Ok(())
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "protocol version must be 0 or 1",
            )),
        }
    }

    #[napi(js_name = "getSchemas")]
    pub fn get_schemas(&self) -> Result<DynamicValue, napi::Error> {
        let schema = self.0.document_schemas();

        let schema_vec: Vec<(Value, Value)> = schema
            .clone()
            .into_iter()
            .map(|(k, v)| (Value::Text(k.clone()), v.clone()))
            .collect();

        Value::Map(schema_vec).try_into()
    }

    #[napi(getter, js_name = "version")]
    pub fn get_version(&self) -> u32 {
        self.0.version()
    }

    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.0.id().into()
    }

    #[napi(getter, js_name = "ownerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        self.0.owner_id().into()
    }

    #[napi(js_name = "getConfig")]
    pub fn get_config(&self) -> Result<DynamicValue, napi::Error> {
        platform_value::to_value(self.0.config())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
            .try_into()
    }

    #[napi(getter, js_name = "tokens")]
    pub fn get_tokens(&self) -> Vec<(u16, TokenConfigurationNAPI)> {
        self.0
            .tokens()
            .iter()
            .map(|(id, config)| (id.clone(), config.clone().into()))
            .collect()
    }

    #[napi(getter, js_name = "groups")]
    pub fn get_groups(&self) -> Vec<(u16, GroupNAPI)> {
        self.0
            .groups()
            .iter()
            .map(|(id, group)| (id.clone(), group.clone().into()))
            .collect()
    }

    #[napi(getter, js_name = "description")]
    pub fn get_description(&self) -> Option<String> {
        self.0.description().map(|st| st.clone())
    }

    #[napi(getter, js_name = "keywords")]
    pub fn get_keywords(&self) -> Vec<String> {
        self.0.keywords().clone()
    }

    #[napi(setter, js_name = "id")]
    pub fn set_id(&mut self, js_data_contract_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0
            .set_id(IdentifierNAPI::try_from(js_data_contract_id)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "ownerId")]
    pub fn set_owner_id(&mut self, js_owner_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0
            .set_owner_id(IdentifierNAPI::try_from(js_owner_id)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "version")]
    pub fn set_version(&mut self, version: u32) {
        self.0.set_version(version)
    }

    #[napi(js_name = "setConfig")]
    pub fn set_config(
        &mut self,
        js_config: &DynamicValue,
        js_platform_version: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let config_value: Value = js_config.clone().try_into()?;

        let config = DataContractConfig::from_value(config_value, &platform_version.into())
            .with_js_error()?;

        self.0.set_config(config);

        Ok(())
    }

    #[napi(js_name = "setSchemas")]
    pub fn set_schemas(
        &mut self,
        js_schema: &DynamicValue,
        js_definitions: &DynamicValue,
        full_validation: bool,
        js_platform_version: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let schema = with_serde_to_platform_value_map(js_schema)?;

        let definitions: Option<BTreeMap<String, Value>> =
            match js_definitions.is_undefined_or_null() {
                true => None,
                false => Some(with_serde_to_platform_value_map(js_definitions)?),
            };

        self.0
            .set_document_schemas(
                schema,
                definitions,
                full_validation,
                &mut Vec::new(),
                &platform_version.into(),
            )
            .with_js_error()?;

        Ok(())
    }

    #[napi(setter, js_name = "tokens")]
    pub fn set_tokens(&mut self, js_tokens: Option<Vec<(u16, &TokenConfigurationNAPI)>>) {
        let tokens: BTreeMap<TokenContractPosition, TokenConfiguration> = match js_tokens {
            Some(tokens) => tokens
                .into_iter()
                .map(|(pos, config)| (pos.clone(), config.clone().into()))
                .collect(),
            None => BTreeMap::new(),
        };

        self.0.set_tokens(tokens)
    }

    #[napi(setter, js_name = "groups")]
    pub fn set_groups(&mut self, js_groups: Vec<(u16, &GroupNAPI)>) {
        let groups: BTreeMap<GroupContractPosition, Group> = js_groups
            .into_iter()
            .map(|(pos, group)| (pos.clone(), group.clone().into()))
            .collect();

        self.0.set_groups(groups);
    }

    #[napi(setter, js_name = "description")]
    pub fn set_description(&mut self, description: Option<String>) {
        self.0.set_description(description)
    }

    #[napi(setter, js_name = "keywords")]
    pub fn set_keywords(&mut self, keywords: Vec<String>) {
        self.0.set_keywords(keywords)
    }

    #[napi(js_name = "toJson")]
    pub fn to_json(&self, js_platform_version: &DynamicValue) -> Result<DynamicValue, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let json: Value = self.0.to_value(&platform_version.into()).with_js_error()?;

        DynamicValue::try_from(json)
    }

    #[napi(js_name = "generateId")]
    pub fn generate_id(
        js_owner_id: IdentifierLikeNAPI,
        js_identity_nonce: BigIntString,
    ) -> Result<IdentifierNAPI, napi::Error> {
        let identity_nonce = js_identity_nonce.try_to_u64()?;

        Ok(DataContract::generate_data_contract_id_v0(
            IdentifierNAPI::try_from(js_owner_id)?.bytes(),
            identity_nonce,
        )
        .into())
    }
}

impl DataContractNAPI {
    pub fn get_document_type_ref_by_name(
        &self,
        name: String,
    ) -> Result<DocumentTypeRef<'_>, DataContractError> {
        self.0.document_type_for_name(name.as_str())
    }
}
