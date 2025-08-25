use dpp::consensus;
use dpp::consensus::ConsensusError;
use dpp::consensus::basic::data_contract::{DocumentTypesAreMissingError, DuplicateIndexError, UnknownDocumentCreationRestrictionModeError, UnknownSecurityLevelError, UnknownStorageKeyRequirementsError, UnknownTradeModeError, UnknownTransferableTypeError};
use dpp::consensus::basic::decode::{DecodingError, SerializedObjectParsingError};
use dpp::consensus::basic::document::InvalidDocumentTypeError;
use dpp::consensus::basic::json_schema_compilation_error::JsonSchemaCompilationError;
use dpp::consensus::basic::{
    BasicError, IncompatibleProtocolVersionError, UnsupportedProtocolVersionError,
    UnsupportedVersionError,
};
use dpp::consensus::basic::data_contract::data_contract_max_depth_exceed_error::DataContractMaxDepthExceedError;
use dpp::consensus::basic::invalid_identifier_error::InvalidIdentifierError;
use dpp::consensus::basic::value_error::ValueError;
use dpp::data_contract::errors::{DataContractError, JsonSchemaError};
use dpp::platform_value::string_encoding::Encoding;
use dpp::serialization::PlatformDeserializable;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "ConsensusErrorWASM")]
pub struct ConsensusErrorWASM(ConsensusError);

#[wasm_bindgen]
impl ConsensusErrorWASM {
    #[wasm_bindgen(js_name="deserialize")]
    pub fn deserialize(error: Vec<u8>) -> Result<Self, JsValue> {
        Ok(ConsensusErrorWASM(
            ConsensusError::deserialize_from_bytes(error.as_slice()).with_js_error()?,
        ))
    }

    #[wasm_bindgen(getter="message")]
    pub fn message(&self) -> String {
        self.0.to_string()
    }
}
