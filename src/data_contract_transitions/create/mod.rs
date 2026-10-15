use dpp::ProtocolError;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::DataContract;
use dpp::serialization::{PlatformDeserializableUntrusted, PlatformSerializable};
use dpp::state_transition::StateTransition;
use dpp::state_transition::StateTransitionEstimatedFeeValidation;
use dpp::state_transition::data_contract_create_transition::accessors::DataContractCreateTransitionAccessorsV0;
use dpp::state_transition::data_contract_create_transition::accessors::DataContractCreateTransitionAccessorsV1;
use dpp::state_transition::data_contract_create_transition::{
    DataContractCreateTransition, DataContractCreateTransitionV0, DataContractCreateTransitionV1,
};
use dpp::validation::operations::ProtocolValidationOperation;
use dpp::version::PlatformVersion;
use dpp::version::{TryFromPlatformVersioned, TryIntoPlatformVersioned};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{WithJsError, serde_from_js, serde_to_js};

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
            DataContractCreateTransition::deserialize_from_bytes_untrusted(
                bytes.to_vec().as_slice(),
            )
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
        let platform_version = match js_platform_version.is_undefined_or_null() {
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

    /// The contract group this transition registers, as `{ admins, name?, description? }`
    #[napi(getter, js_name = "contractGroup")]
    pub fn get_contract_group(&self) -> Result<Option<DynamicValue>, napi::Error> {
        self.0.contract_group().map(serde_to_js).transpose()
    }

    /// Registering a contract group makes this a V1 transition (platform v14+)
    #[napi(setter, js_name = "contractGroup")]
    pub fn set_contract_group(
        &mut self,
        js_contract_group: Option<&DynamicValue>,
    ) -> Result<(), napi::Error> {
        let contract_group = js_contract_group
            .filter(|value| !value.is_undefined_or_null())
            .map(serde_from_js)
            .transpose()?;

        if contract_group.is_some() || matches!(self.0, DataContractCreateTransition::V1(_)) {
            self.as_v1_mut().contract_group = contract_group;
        }

        Ok(())
    }

    #[napi(getter, js_name = "contractGroupId")]
    pub fn get_contract_group_id(&self) -> Option<IdentifierNAPI> {
        self.0.contract_group_id().map(Into::into)
    }

    /// The groups the new contract joins, as
    /// `[{ contractGroupId, member: 'contract' | { documentType } | { token } }]`
    #[napi(getter, js_name = "contractGroupMemberships")]
    pub fn get_contract_group_memberships(&self) -> Result<DynamicValue, napi::Error> {
        serde_to_js(&self.0.contract_group_memberships())
    }

    #[napi(setter, js_name = "contractGroupMemberships")]
    pub fn set_contract_group_memberships(
        &mut self,
        js_memberships: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let memberships: Vec<_> = match js_memberships.is_undefined_or_null() {
            true => vec![],
            false => serde_from_js(js_memberships)?,
        };

        if !memberships.is_empty() || matches!(self.0, DataContractCreateTransition::V1(_)) {
            self.as_v1_mut().contract_group_memberships = memberships;
        }

        Ok(())
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

impl DataContractCreateTransitionNAPI {
    /// Contract groups only exist on V1 transitions, so this upgrades a V0 one
    fn as_v1_mut(&mut self) -> &mut DataContractCreateTransitionV1 {
        if let DataContractCreateTransition::V0(v0) = &self.0 {
            self.0 = DataContractCreateTransition::V1(DataContractCreateTransitionV1 {
                data_contract: v0.data_contract.clone(),
                identity_nonce: v0.identity_nonce,
                contract_group: None,
                contract_group_memberships: vec![],
                user_fee_increase: v0.user_fee_increase,
                signature_public_key_id: v0.signature_public_key_id,
                signature: v0.signature.clone(),
            });
        }

        match &mut self.0 {
            DataContractCreateTransition::V1(v1) => v1,
            DataContractCreateTransition::V0(_) => unreachable!("upgraded to V1 above"),
        }
    }
}
