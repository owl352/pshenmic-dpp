use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::prelude::{DataContract, IdentityNonce};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransition;
use dpp::state_transition::data_contract_update_transition::DataContractUpdateTransition;
use dpp::state_transition::data_contract_update_transition::accessors::DataContractUpdateTransitionAccessorsV0;
use dpp::validation::operations::ProtocolValidationOperation;
use dpp::version::{FeatureVersion, ProtocolVersion, TryFromPlatformVersioned};
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "DataContractUpdateTransitionWASM")]
pub struct DataContractUpdateTransitionWASM(DataContractUpdateTransition);

#[wasm_bindgen]
impl DataContractUpdateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        data_contract: &DataContractWASM,
        identity_nonce: IdentityNonce,
        js_platform_version: JsValue,
    ) -> Result<DataContractUpdateTransitionWASM, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
        };

        let rs_data_contract_update_transition =
            DataContractUpdateTransition::try_from_platform_versioned(
                (DataContract::from(data_contract.clone()), identity_nonce),
                &platform_version.into(),
            )
            .with_js_error()?;

        Ok(DataContractUpdateTransitionWASM(
            rs_data_contract_update_transition,
        ))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<DataContractUpdateTransitionWASM, JsValue> {
        let rs_data_contract_update_transition: DataContractUpdateTransition =
            DataContractUpdateTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error()?;

        Ok(DataContractUpdateTransitionWASM(
            rs_data_contract_update_transition,
        ))
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "getFeatureVersion")]
    pub fn get_feature_version(&self) -> FeatureVersion {
        self.0.feature_version()
    }

    #[wasm_bindgen(js_name = "verifyProtocolVersion")]
    pub fn verify_protocol_version(
        &self,
        protocol_version: ProtocolVersion,
    ) -> Result<bool, JsValue> {
        self.0
            .verify_protocol_version(protocol_version)
            .with_js_error()
    }

    #[wasm_bindgen(js_name = "setDataContract")]
    pub fn set_data_contract(
        &mut self,
        data_contract: &DataContractWASM,
        js_platform_version: JsValue,
    ) -> Result<(), JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
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

    #[wasm_bindgen(js_name = "getDataContract")]
    pub fn get_data_contract(
        &self,
        full_validation: Option<bool>,
        js_platform_version: JsValue,
    ) -> Result<DataContractWASM, JsValue> {
        let platform_version = match js_platform_version.is_undefined() {
            true => PlatformVersionWASM::default(),
            false => PlatformVersionWASM::try_from(js_platform_version)?,
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

        Ok(DataContractWASM::from(rs_data_contract))
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        let rs_state_transition = StateTransition::from(self.0.clone());

        StateTransitionWASM::from(rs_state_transition)
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        state_transition: &StateTransitionWASM,
    ) -> Result<DataContractUpdateTransitionWASM, JsValue> {
        let rs_transition = StateTransition::from(state_transition.clone());

        match rs_transition {
            StateTransition::DataContractUpdate(state_transition) => {
                Ok(DataContractUpdateTransitionWASM(state_transition))
            }
            _ => Err(JsValue::from("Incorrect transition type")),
        }
    }
}
