use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::DataContract;
use dpp::data_contract::accessors::v0::{DataContractV0Getters, DataContractV0Setters};
use dpp::data_contract::config::DataContractConfig;
use dpp::data_contract::conversion::json::DataContractJsonConversionMethodsV0;
use dpp::data_contract::conversion::value::v0::DataContractValueConversionMethodsV0;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::errors::DataContractError;
use dpp::data_contract::schema::DataContractSchemaMethodsV0;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::platform_value::{Value, ValueMap};
use dpp::prelude::IdentityNonce;
use dpp::serialization::{
    PlatformDeserializableWithPotentialValidationFromVersionedStructure,
    PlatformSerializableWithPlatformVersion,
};
use dpp::version::PlatformVersion;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::{ToSerdeJSONExt, WithJsError};
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "DataContractWASM")]
#[derive(Clone)]
pub struct DataContractWASM(DataContract);

impl From<DataContract> for DataContractWASM {
    fn from(v: DataContract) -> Self {
        DataContractWASM(v)
    }
}

impl From<DataContractWASM> for DataContract {
    fn from(v: DataContractWASM) -> Self {
        v.0
    }
}

#[wasm_bindgen]
impl DataContractWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "DataContractWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn from_js_values(
        js_owner_id: &JsValue,
        identity_nonce: IdentityNonce,
        js_schema: JsValue,
        js_definitions: Option<js_sys::Object>,
        full_validation: bool,
        js_platform_version: JsValue,
    ) -> Result<DataContractWASM, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        let owner_id: IdentifierWASM = js_owner_id.clone().try_into()?;

        let owner_id_value = Value::from(owner_id.get_base58());

        let schema: Value = serde_wasm_bindgen::from_value(js_schema)?;

        let platform_version: PlatformVersion = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default().into(),
            false => PlatformVersionWASM::try_from(js_platform_version)?.into(),
        };

        let data_contract_structure_version_value = Value::from(
            platform_version
                .dpp
                .contract_versions
                .contract_structure_version
                .to_string(),
        );

        let definitions = js_definitions
            .map(|definitions| serde_wasm_bindgen::from_value(definitions.into()))
            .transpose()?;

        let definitions_value = Value::from(definitions);

        let data_contract_id =
            DataContract::generate_data_contract_id_v0(owner_id.get_bytes(), identity_nonce);

        let data_contract_id_value = Value::from(data_contract_id.to_string(Base58));

        let config =
            DataContractConfig::default_for_version(&platform_version.clone()).with_js_error()?;

        let config_value = config
            .serialize(&serializer)
            .map_err(JsValue::from)?
            .with_serde_to_platform_value_map()?;

        let mut contract_value = Value::Map(ValueMap::new());

        contract_value
            .set_value("$format_version", data_contract_structure_version_value)
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("id", data_contract_id_value)
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("config", Value::from(config_value))
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("version", Value::from(1u16))
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("ownerId", owner_id_value)
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("schemaDefs", definitions_value)
            .map_err(|err| JsValue::from(err.to_string()))?;

        contract_value
            .set_value("documentSchemas", schema)
            .map_err(|err| JsValue::from(err.to_string()))?;

        Ok(DataContractWASM(
            DataContract::from_value(contract_value, full_validation, &platform_version)
                .with_js_error()?,
        ))
    }

    #[wasm_bindgen(js_name = "fromValue")]
    pub fn from_value(
        js_value: JsValue,
        full_validation: bool,
        js_platform_version: JsValue,
    ) -> Result<DataContractWASM, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let value = js_value.with_serde_to_platform_value()?;

        let contract = DataContract::from_value(value, full_validation, &platform_version.into())
            .with_js_error()?;

        Ok(DataContractWASM(contract))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(
        bytes: Vec<u8>,
        full_validation: bool,
        js_platform_version: JsValue,
    ) -> Result<DataContractWASM, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let rs_data_contract = DataContract::versioned_deserialize(
            &bytes.as_slice(),
            full_validation,
            &platform_version.into(),
        )
        .with_js_error()?;

        Ok(DataContractWASM(rs_data_contract))
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self, js_platform_version: JsValue) -> Result<Vec<u8>, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let rs_data_contract: DataContract = self.0.clone();

        rs_data_contract
            .serialize_to_bytes_with_platform_version(&platform_version.into())
            .with_js_error()
    }

    #[wasm_bindgen(js_name = "toValue")]
    pub fn to_value(&self, js_platform_version: JsValue) -> Result<JsValue, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0
            .clone()
            .to_value(&platform_version.into())
            .with_js_error()?
            .serialize(&serializer)
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "getSchema")]
    pub fn get_schemas(&self) -> Result<JsValue, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0
            .document_schemas()
            .serialize(&serializer)
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "getVersion")]
    pub fn get_version(&self) -> u32 {
        self.0.version()
    }

    #[wasm_bindgen(js_name = "getId")]
    pub fn get_id(&self) -> IdentifierWASM {
        self.0.id().into()
    }

    #[wasm_bindgen(js_name = "getOwnerId")]
    pub fn get_owner_id(&self) -> IdentifierWASM {
        self.0.owner_id().into()
    }

    #[wasm_bindgen(js_name = "getConfig")]
    pub fn get_config(&self) -> Result<JsValue, JsValue> {
        self.0
            .config()
            .serialize(&serde_wasm_bindgen::Serializer::json_compatible())
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "setId")]
    pub fn set_id(&mut self, js_data_contract_id: &JsValue) -> Result<(), JsValue> {
        self.0
            .set_id(IdentifierWASM::try_from(js_data_contract_id)?.into());
        Ok(())
    }

    #[wasm_bindgen(js_name = "setOwnerId")]
    pub fn set_owner_id(&mut self, js_owner_id: &JsValue) -> Result<(), JsValue> {
        self.0
            .set_owner_id(IdentifierWASM::try_from(js_owner_id)?.into());
        Ok(())
    }

    #[wasm_bindgen(js_name = "setVersion")]
    pub fn set_version(&mut self, version: u32) {
        self.0.set_version(version)
    }

    #[wasm_bindgen(js_name = "setConfig")]
    pub fn set_config(
        &mut self,
        js_config: JsValue,
        js_platform_version: JsValue,
    ) -> Result<(), JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let config_value: Value = serde_wasm_bindgen::from_value(js_config)?;

        let config = DataContractConfig::from_value(config_value, &platform_version.into())
            .with_js_error()?;

        self.0.set_config(config);

        Ok(())
    }

    #[wasm_bindgen(js_name = "setSchema")]
    pub fn set_schemas(
        &mut self,
        js_schema: JsValue,
        js_definitions: Option<js_sys::Object>,
        full_validation: bool,
        js_platform_version: JsValue,
    ) -> Result<(), JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let schema = js_schema.with_serde_to_platform_value_map()?;

        let definitions: Option<BTreeMap<String, Value>> = js_definitions
            .map(|definitions| serde_wasm_bindgen::from_value(definitions.into()))
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

    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self, js_platform_version: JsValue) -> Result<JsValue, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let json = self.0.to_json(&platform_version.into()).with_js_error()?;

        json.serialize(&serde_wasm_bindgen::Serializer::json_compatible())
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "generateId")]
    pub fn generate_id(
        js_owner_id: &JsValue,
        identity_nonce: IdentityNonce,
    ) -> Result<IdentifierWASM, JsValue> {
        Ok(DataContract::generate_data_contract_id_v0(
            IdentifierWASM::try_from(js_owner_id)?.get_bytes(),
            identity_nonce,
        )
        .into())
    }
}

impl DataContractWASM {
    pub fn get_document_type_ref_by_name(
        &self,
        name: String,
    ) -> Result<DocumentTypeRef, DataContractError> {
        self.0.document_type_for_name(name.as_str()).clone()
    }
}
