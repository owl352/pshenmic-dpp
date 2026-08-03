use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::DataContract;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransition;
use dpp::state_transition::StateTransitionEstimatedFeeValidation;
use dpp::state_transition::data_contract_update_transition::DataContractUpdateTransition;
use dpp::state_transition::data_contract_update_transition::accessors::DataContractUpdateTransitionAccessorsV0;
use dpp::validation::operations::ProtocolValidationOperation;
use dpp::version::PlatformVersion;
use dpp::version::TryFromPlatformVersioned;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "DataContractUpdateTransitionNAPI")]
pub struct DataContractUpdateTransitionNAPI(DataContractUpdateTransition);

#[napi]
impl DataContractUpdateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        data_contract: &DataContractNAPI,
        identity_nonce: BigIntString,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractUpdateTransitionNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        Ok(DataContractUpdateTransitionNAPI(
            DataContractUpdateTransition::try_from_platform_versioned(
                (
                    DataContract::from(data_contract.clone()),
                    identity_nonce.try_to_u64()?,
                ),
                &platform_version.into(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<DataContractUpdateTransitionNAPI, napi::Error> {
        let rs_data_contract_update_transition: DataContractUpdateTransition =
            DataContractUpdateTransition::deserialize_from_bytes(bytes.to_vec().as_slice())
                .with_js_error()?;

        Ok(DataContractUpdateTransitionNAPI(
            rs_data_contract_update_transition,
        ))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<DataContractUpdateTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        DataContractUpdateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<DataContractUpdateTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        DataContractUpdateTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "calculateMinRequiredFee")]
    pub fn calculate_min_required_fee(
        &self,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        self.0
            .calculate_min_required_fee(&platform_version)
            .map(BigIntString::from_u64)
            .with_js_error()
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
        let platform_version = match js_platform_version.is_undefined_or_null() {
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

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_contract_nonce())
    }

    #[napi(js_name = "getDataContract")]
    pub fn get_data_contract(
        &self,
        full_validation: Option<bool>,
        js_platform_version: &DynamicValue,
    ) -> Result<DataContractNAPI, napi::Error> {
        let platform_version = match js_platform_version.is_undefined_or_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        };

        let data_contract_serialization_format = self.0.data_contract();

        let mut validation_operations: Vec<ProtocolValidationOperation> = Vec::new();

        let rs_data_contract = DataContract::try_from_platform_versioned(
            data_contract_serialization_format.clone(),
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
    ) -> Result<DataContractUpdateTransitionNAPI, napi::Error> {
        let rs_transition = StateTransition::from(state_transition.clone());

        match rs_transition {
            StateTransition::DataContractUpdate(state_transition) => {
                Ok(DataContractUpdateTransitionNAPI(state_transition))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Incorrect transition type",
            )),
        }
    }
}
