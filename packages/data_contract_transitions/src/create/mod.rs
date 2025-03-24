use dpp::ProtocolError;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::prelude::DataContract;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransition;
use dpp::state_transition::data_contract_create_transition::DataContractCreateTransition;
use dpp::state_transition::data_contract_create_transition::accessors::DataContractCreateTransitionAccessorsV0;
use dpp::validation::operations::ProtocolValidationOperation;
use dpp::version::{FeatureVersion, ProtocolVersion, TryFromPlatformVersioned};
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "DataContractCreateTransitionWASM")]
pub struct DataContractCreateTransitionWASM(DataContractCreateTransition);

#[wasm_bindgen]
impl DataContractCreateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        data_contract: DataContractWASM,
        platform_version: Option<PlatformVersionWASM>,
    ) -> Result<DataContractCreateTransitionWASM, JsValue> {
        let rs_data_contract_transition: Result<DataContractCreateTransition, ProtocolError> =
            DataContractCreateTransition::try_from_platform_versioned(
                DataContract::from(data_contract),
                &platform_version
                    .unwrap_or(PlatformVersionWASM::PLATFORM_V1)
                    .into(),
            );

        match rs_data_contract_transition {
            Ok(transition) => Ok(DataContractCreateTransitionWASM(transition)),
            Err(err) => Err(JsValue::from(err.to_string())),
        }
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<DataContractCreateTransitionWASM, JsValue> {
        let rs_data_contract_transition: DataContractCreateTransition =
            DataContractCreateTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error()?;

        Ok(DataContractCreateTransitionWASM(
            rs_data_contract_transition,
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
        data_contract: DataContractWASM,
        platform_version_wasm: Option<PlatformVersionWASM>,
    ) -> Result<(), JsValue> {
        let data_contract_serialization_format =
            DataContractInSerializationFormat::try_from_platform_versioned(
                DataContract::from(data_contract),
                &platform_version_wasm
                    .unwrap_or(PlatformVersionWASM::PLATFORM_V1)
                    .into(),
            )
            .with_js_error()?;

        self.0.set_data_contract(data_contract_serialization_format);

        Ok(())
    }

    #[wasm_bindgen(js_name = "getDataContract")]
    pub fn get_data_contract(
        &self,
        platform_version_wasm: Option<PlatformVersionWASM>,
        full_validation: Option<bool>,
    ) -> Result<DataContractWASM, JsValue> {
        let rs_data_contract_serialization_format = self.0.data_contract();

        let mut validation_operations: Vec<ProtocolValidationOperation> = Vec::new();

        let rs_data_contract = DataContract::try_from_platform_versioned(
            rs_data_contract_serialization_format.clone(),
            full_validation.unwrap_or(false),
            &mut validation_operations,
            &platform_version_wasm
                .unwrap_or(PlatformVersionWASM::PLATFORM_V1)
                .into(),
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
        state_transition: StateTransitionWASM,
    ) -> Result<DataContractCreateTransitionWASM, JsValue> {
        let rs_transition = StateTransition::from(state_transition);

        match rs_transition {
            StateTransition::DataContractCreate(state_transition) => {
                Ok(DataContractCreateTransitionWASM(state_transition))
            }
            _ => Err(JsValue::from("Incorrect transition type")),
        }
    }
}
