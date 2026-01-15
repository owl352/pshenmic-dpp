use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI, TryToU64, TypeChecker, Uint64String};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::utils::{WithJsError, with_serde_to_platform_value, with_serde_to_platform_value_map};
use dpp::data_contract::accessors::v0::{DataContractV0Getters, DataContractV0Setters};
use dpp::data_contract::accessors::v1::{DataContractV1Getters, DataContractV1Setters};
use dpp::data_contract::config::DataContractConfig;
use dpp::data_contract::conversion::json::DataContractJsonConversionMethodsV0;
use dpp::data_contract::conversion::value::v0::DataContractValueConversionMethodsV0;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::errors::DataContractError;
use dpp::data_contract::schema::DataContractSchemaMethodsV0;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::data_contract::{DataContract, TokenConfiguration, TokenContractPosition};
use dpp::platform_value::string_encoding::Encoding::{Base58, Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::platform_value::{Value, ValueMap};
use dpp::serialization::{
    PlatformDeserializableWithPotentialValidationFromVersionedStructure,
    PlatformSerializableWithPlatformVersion,
};
use dpp::version::{PlatformVersion, TryIntoPlatformVersioned};
use dpp::{ProtocolError, platform_value};
use napi::bindgen_prelude::{Object, Uint8Array};
use napi_derive::napi;
use serde_json::{Map, Value as JsonValue};
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

// pub fn tokens_configuration_from_js_value(
//     js_configuration: &JsValue,
// ) -> Result<BTreeMap<TokenContractPosition, TokenConfiguration>, JsValue> {
//     let configuration_object = Object::from(js_configuration.clone());
//     let configuration_keys = Object::keys(&configuration_object);

//     let mut configuration: BTreeMap<TokenContractPosition, TokenConfiguration> = BTreeMap::new();

//     for key in configuration_keys.iter() {
//         let contract_position = match key.as_string() {
//             None => Err(JsValue::from("Cannot read timestamp in distribution rules")),
//             Some(contract_position) => Ok(contract_position
//                 .parse::<GroupContractPosition>()
//                 .map_err(JsError::from)?),
//         }?;

//         let js_config = Reflect::get(&js_configuration, &key)?
//             .to_wasm::<TokenConfigurationWASM>("TokenConfigurationWASM")?
//             .clone();

//         configuration.insert(contract_position, js_config.into());
//     }

//     Ok(configuration)
// }

#[napi]
impl DataContractNAPI {
    #[napi(constructor)]
    pub fn from_js_values(
        js_owner_id: IdentifierLikeNAPI,
        js_identity_nonce: Uint64String,
        js_schema: Object,
        js_definitions: Option<Object>,
        // js_tokens: &BTreeMap<u16, TokenConfiguration>,
        full_validation: bool,
        js_platform_version: DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;

        let owner_id_value = Value::from(owner_id.base58());

        let identity_nonce = js_identity_nonce.try_to_u64()?;

        let schema: Value = with_serde_to_platform_value(js_schema)?;

        let tokens: BTreeMap<TokenContractPosition, TokenConfiguration> = BTreeMap::new();
        // match js_tokens.is_undefined() {
        //     true => BTreeMap::new(),
        //     false => tokens_configuration_from_js_value(js_tokens)?,
        // };

        let platform_version: PlatformVersion = match js_platform_version {
            DynamicValue::Null(_) => PlatformVersionNAPI::default().into(),
            _ => PlatformVersionNAPI::try_from(js_platform_version)?.into(),
        };

        let data_contract_structure_version_value = Value::from(
            platform_version
                .dpp
                .contract_versions
                .contract_structure_version
                .to_string(),
        );

        let definitions = js_definitions
            .map(|definitions| with_serde_to_platform_value(definitions))
            .transpose()?;

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
            .set_value("$format_version", data_contract_structure_version_value)
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

        let data_contract =
            DataContract::from_value(contract_value, full_validation, &platform_version)
                .with_js_error()?;

        let data_contract_with_tokens = match data_contract {
            DataContract::V0(v0) => DataContract::from(v0),
            DataContract::V1(mut v1) => {
                v1.set_tokens(tokens);

                DataContract::from(v1)
            }
        };

        Ok(DataContractNAPI(data_contract_with_tokens))
    }

    #[napi(js_name = "fromValue")]
    pub fn from_value(
        js_value: Object,
        full_validation: bool,
        js_platform_version: DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let value = with_serde_to_platform_value(js_value)?;

        let contract = DataContract::from_value(value, full_validation, &platform_version.into())
            .with_js_error()?;

        Ok(DataContractNAPI(contract))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(
        js_bytes: Uint8Array,
        full_validation: bool,
        js_platform_version: DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_null() {
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
        js_platform_version: DynamicValue,
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
        js_platform_version: DynamicValue,
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
    pub fn to_bytes(&self, js_platform_version: DynamicValue) -> Result<Uint8Array, napi::Error> {
        let platform_version = match js_platform_version.is_null() {
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
    pub fn to_hex(&self, js_platform_version: DynamicValue) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(js_platform_version)?.to_vec().as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self, js_platform_version: DynamicValue) -> Result<String, napi::Error> {
        Ok(encode(
            self.to_bytes(js_platform_version)?.to_vec().as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "toValue", ts_return_type = "object")]
    pub fn to_value(&self, js_platform_version: DynamicValue) -> Result<JsonValue, napi::Error> {
        let platform_version = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let value = self
            .0
            .clone()
            .to_value(&platform_version.into())
            .with_js_error()?;

        let json: JsonValue = value.try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::GenericFailure,
                "cannot convert contract to json value",
            )
        })?;

        Ok(json)
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

    #[napi(js_name = "getSchemas", ts_return_type = "object")]
    pub fn get_schemas(&self) -> Result<JsonValue, napi::Error> {
        let mut schema: Map<String, JsonValue> = Map::new();

        let rs_schema = self.0.document_schemas().clone();
        let keys = rs_schema.keys();

        for key in keys {
            let value = rs_schema.get(key).cloned().ok_or(0).map_err(|_| {
                napi::Error::new(
                    napi::Status::GenericFailure,
                    format!("cannot get value by key {}", key),
                )
            })?;

            schema.insert(
                key.clone(),
                value.clone().try_into().map_err(|_| {
                    napi::Error::new(napi::Status::GenericFailure, "cannot convert value to json")
                })?,
            );
        }

        Ok(JsonValue::Object(schema))
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

    #[napi(js_name = "getConfig", ts_return_type = "object")]
    pub fn get_config(&self) -> Result<JsonValue, napi::Error> {
        let json: JsonValue = platform_value::to_value(self.0.config())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
            .try_into()
            .map_err(|_| {
                napi::Error::new(
                    napi::Status::GenericFailure,
                    "cannot convert config value to json",
                )
            })?;

        Ok(json)
    }

    // TODO: Implement tokens

    // #[napi(getter, js_name = "tokens")]
    // pub fn get_tokens(&self) -> Result<Object, JsValue> {
    //     let tokens_object = Object::new();

    //     for (key, value) in self.0.tokens().iter() {
    //         Reflect::set(
    //             &tokens_object,
    //             &JsValue::from(key.clone()),
    //             &JsValue::from(TokenConfigurationWASM::from(value.clone())),
    //         )?;
    //     }

    //     Ok(tokens_object)
    // }

    // #[napi(getter, js_name = "groups")]
    // pub fn get_groups(&self) -> Result<JsValue, JsValue> {
    //     let groups_object = Object::new();

    //     for (key, value) in self.0.groups().iter() {
    //         Reflect::set(
    //             &groups_object,
    //             &JsValue::from(key.clone()),
    //             &JsValue::from(GroupWASM::from(value.clone())),
    //         )?;
    //     }

    //     Ok(groups_object.into())
    // }

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
        js_config: Object,
        js_platform_version: DynamicValue,
    ) -> Result<(), napi::Error> {
        let platform_version = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let config_value: Value = with_serde_to_platform_value(js_config)?;

        let config = DataContractConfig::from_value(config_value, &platform_version.into())
            .with_js_error()?;

        self.0.set_config(config);

        Ok(())
    }

    #[napi(js_name = "setSchemas")]
    pub fn set_schemas(
        &mut self,
        js_schema: Object,
        js_definitions: Option<Object>,
        full_validation: bool,
        js_platform_version: DynamicValue,
    ) -> Result<(), napi::Error> {
        let platform_version = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let schema = with_serde_to_platform_value_map(js_schema)?;

        let definitions: Option<BTreeMap<String, Value>> = js_definitions
            .map(|definitions| with_serde_to_platform_value_map(definitions))
            .transpose()?;

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

    // TODO: tokens

    // #[napi(setter, js_name = "tokens")]
    // pub fn set_tokens(&mut self, js_tokens: &JsValue) -> Result<(), JsValue> {
    //     Ok(self
    //         .0
    //         .set_tokens(tokens_configuration_from_js_value(js_tokens)?))
    // }

    // #[napi(setter, js_name = "groups")]
    // pub fn set_groups(&mut self, js_groups: &JsValue) -> Result<(), JsValue> {
    //     let groups_object = Object::from(js_groups.clone());

    //     let mut groups: BTreeMap<GroupContractPosition, Group> = BTreeMap::new();

    //     for js_position in Object::keys(&groups_object) {
    //         let num_position = match js_position.as_f64() {
    //             None => Err(JsValue::from("position must be a number")),
    //             Some(key) => Ok(key),
    //         }?;

    //         if num_position > u16::MAX as f64 {
    //             return Err(JsValue::from_str(&format!(
    //                 "Position value '{:?}' exceeds the maximum limit for u16.",
    //                 js_position.as_string()
    //             )));
    //         }

    //         let position = num_position as u16;

    //         let js_group = Reflect::get(&groups_object, &js_position)?;

    //         let group = js_group.to_wasm::<GroupWASM>("GroupWASM")?.clone();

    //         groups.insert(position, group.into());
    //     }

    //     self.0.set_groups(groups);

    //     Ok(())
    // }

    #[napi(setter, js_name = "description")]
    pub fn set_description(&mut self, description: Option<String>) {
        self.0.set_description(description)
    }

    #[napi(setter, js_name = "keywords")]
    pub fn set_keywords(&mut self, keywords: Vec<String>) {
        self.0.set_keywords(keywords)
    }

    #[napi(js_name = "toJson", ts_return_type = "object")]
    pub fn to_json(&self, js_platform_version: DynamicValue) -> Result<JsonValue, napi::Error> {
        let platform_version = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let json = self.0.to_json(&platform_version.into()).with_js_error()?;

        Ok(json)
    }

    #[napi(js_name = "generateId")]
    pub fn generate_id(
        js_owner_id: IdentifierLikeNAPI,
        js_identity_nonce: Uint64String,
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
