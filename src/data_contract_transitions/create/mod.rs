use dpp::ProtocolError;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::DataContract;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransition;
use dpp::state_transition::data_contract_create_transition::accessors::DataContractCreateTransitionAccessorsV0;
use dpp::state_transition::data_contract_create_transition::{
    DataContractCreateTransition, DataContractCreateTransitionV0,
};
use dpp::validation::operations::ProtocolValidationOperation;
use dpp::version::{TryFromPlatformVersioned, TryIntoPlatformVersioned};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "DataContractCreateTransitionNAPI")]
pub struct DataContractCreateTransitionNAPI(DataContractCreateTransition);

#[napi]
impl DataContractCreateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        data_contract: &DataContractNAPI,
        identity_nonce: BigIntString,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractCreateTransitionNAPI, napi::Error> {
        let rs_data_contract: DataContract = data_contract.clone().into();

        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let rs_data_contract_in_serialized: Result<
            DataContractInSerializationFormat,
            ProtocolError,
        > = rs_data_contract.try_into_platform_versioned(&platform_version.into());

        let rs_data_contract_create_transition_v0: DataContractCreateTransitionV0 =
            DataContractCreateTransitionV0 {
                data_contract: rs_data_contract_in_serialized.with_js_error()?,
                identity_nonce: identity_nonce.try_to_u64()?,
                user_fee_increase: 0,
                signature_public_key_id: 0,
                signature: Default::default(),
            };

        let rs_data_contract_transition =
            DataContractCreateTransition::V0(rs_data_contract_create_transition_v0);

        Ok(DataContractCreateTransitionNAPI(
            rs_data_contract_transition,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<DataContractCreateTransitionNAPI, napi::Error> {
        let rs_data_contract_create_transition: DataContractCreateTransition =
            DataContractCreateTransition::deserialize_from_bytes(bytes.to_vec().as_slice())
                .with_js_error()?;

        Ok(DataContractCreateTransitionNAPI(
            rs_data_contract_create_transition,
        ))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<DataContractCreateTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        DataContractCreateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<DataContractCreateTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        DataContractCreateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Base64,
        ))
    }

    #[napi(getter, js_name = "featureVersion")]
    pub fn get_feature_version(&self) -> u16 {
        self.0.feature_version()
    }

    #[napi(js_name = "verifyProtocolVersion")]
    pub fn verify_protocol_version(&self, protocol_version: u32) -> Result<bool, napi::Error> {
        self.0
            .verify_protocol_version(protocol_version)
            .with_js_error()
    }

    #[napi(js_name = "setDataContract")]
    pub fn set_data_contract(
        &mut self,
        data_contract: &DataContractNAPI,
        js_platform_version: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let data_contract_serialization_format =
            DataContractInSerializationFormat::try_from_platform_versioned(
                DataContract::from(data_contract.clone()),
                &platform_version.into(),
            )
            .with_js_error()?;

        self.0.set_data_contract(data_contract_serialization_format);

        Ok(())
    }

    #[napi(getter, js_name = "identityNonce")]
    pub fn get_identity_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_nonce())
    }

    #[napi(js_name = "getDataContract")]
    pub fn get_data_contract(
        &self,
        js_platform_version: &DynamicValue,
        full_validation: Option<bool>,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let rs_data_contract_serialization_format = self.0.data_contract();

        let mut validation_operations: Vec<ProtocolValidationOperation> = Vec::new();

        let rs_data_contract = DataContract::try_from_platform_versioned(
            rs_data_contract_serialization_format.clone(),
            full_validation.unwrap_or(false),
            &mut validation_operations,
            &platform_version.into(),
        )
        .with_js_error()?;

        Ok(DataContractNAPI::from(rs_data_contract))
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        let rs_state_transition = StateTransition::from(self.0.clone());

        StateTransitionNAPI::from(rs_state_transition)
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        state_transition: &StateTransitionNAPI,
    ) -> Result<DataContractCreateTransitionNAPI, napi::Error> {
        let rs_transition = StateTransition::from(state_transition.clone());

        match rs_transition {
            StateTransition::DataContractCreate(state_transition) => {
                Ok(DataContractCreateTransitionNAPI(state_transition))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Incorrect transition type",
            )),
        }
    }
}
