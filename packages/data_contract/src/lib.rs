use dpp::dashcore::hashes::serde::Serialize;
use dpp::data_contract::accessors::v0::{DataContractV0Getters, DataContractV0Setters};
use dpp::data_contract::conversion::json::DataContractJsonConversionMethodsV0;
use dpp::data_contract::conversion::value::v0::DataContractValueConversionMethodsV0;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::errors::DataContractError;
use dpp::data_contract::schema::DataContractSchemaMethodsV0;
use dpp::data_contract::{DataContract, DataContractV0};
use dpp::prelude::IdentityNonce;
use dpp::serialization::{
    PlatformDeserializableWithPotentialValidationFromVersionedStructure,
    PlatformSerializableWithPlatformVersion,
};
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_utils::{ToSerdeJSONExt, WithJsError, identifier_from_js_value};
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
    #[wasm_bindgen(constructor)]
    pub fn new(
        js_value: JsValue,
        full_validation: bool,
        platform_version: PlatformVersionWASM,
    ) -> Result<DataContractWASM, JsValue> {
        let value = js_value.with_serde_to_platform_value()?;

        let v0_contract =
            DataContractV0::from_value(value, full_validation, &platform_version.into())
                .with_js_error()?;

        Ok(DataContractWASM(DataContract::V0(v0_contract)))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(
        bytes: Vec<u8>,
        full_validation: bool,
        platform_version: PlatformVersionWASM,
    ) -> Result<DataContractWASM, JsValue> {
        let rs_data_contract = DataContract::versioned_deserialize(
            &bytes.as_slice(),
            full_validation,
            &platform_version.into(),
        )
        .with_js_error()?;

        Ok(DataContractWASM(rs_data_contract))
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self, platform_version: PlatformVersionWASM) -> Result<Vec<u8>, JsValue> {
        let rs_data_contract: DataContract = self.0.clone();

        rs_data_contract
            .serialize_to_bytes_with_platform_version(&platform_version.into())
            .with_js_error()
    }

    #[wasm_bindgen(js_name = "toValue")]
    pub fn to_value(&self, platform_version: PlatformVersionWASM) -> Result<JsValue, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0
            .clone()
            .to_value(&platform_version.into())
            .with_js_error()?
            .serialize(&serializer)
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "getSchemas")]
    pub fn get_schemas(&self) -> Result<JsValue, JsValue> {
        let serializer = serde_wasm_bindgen::Serializer::json_compatible();

        self.0
            .document_schemas()
            .serialize(&serializer)
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "getDataContractVersion")]
    pub fn get_data_contract_version(&self) -> u32 {
        self.0.version()
    }

    #[wasm_bindgen(js_name = "getId")]
    pub fn get_id(&self) -> Vec<u8> {
        self.0.id().to_vec()
    }

    #[wasm_bindgen(js_name = "getOwnerId")]
    pub fn get_owner_id(&self) -> Vec<u8> {
        self.0.owner_id().to_vec()
    }

    #[wasm_bindgen(js_name = "getConfig")]
    pub fn get_config(&self) -> Result<JsValue, JsValue> {
        self.0
            .config()
            .serialize(&serde_wasm_bindgen::Serializer::json_compatible())
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self, platform_version: PlatformVersionWASM) -> Result<JsValue, JsValue> {
        let json = self.0.to_json(&platform_version.into()).with_js_error()?;

        json.serialize(&serde_wasm_bindgen::Serializer::json_compatible())
            .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "generateId")]
    pub fn generate_id(&mut self, identity_nonce: IdentityNonce) {
        let data_contract_id = DataContract::generate_data_contract_id_v0(
            self.0.owner_id().to_buffer(),
            identity_nonce,
        );

        self.0.set_id(data_contract_id);
    }

    #[wasm_bindgen(js_name = "setId")]
    pub fn set_id(&mut self, js_data_contract_id: JsValue) -> Result<(), JsValue> {
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        Ok(self.0.set_id(data_contract_id))
    }

    #[wasm_bindgen(js_name = "setOwnerId")]
    pub fn set_owner_id(&mut self, js_owner_id: JsValue) -> Result<(), JsValue> {
        let owner_id = identifier_from_js_value(&js_owner_id)?;

        Ok(self.0.set_owner_id(owner_id))
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
