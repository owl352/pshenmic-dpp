use dpp::{consensus::ConsensusError, serialization::PlatformDeserializable};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::utils::WithJsError;

#[napi(js_name = "ConsensusErrorNAPI")]
pub struct ConsensusErrorNAPI(ConsensusError);

#[napi]
impl ConsensusErrorNAPI {
    #[napi(js_name = "deserialize")]
    pub fn deserialize(error: Uint8Array) -> Result<Self, napi::Error> {
        let error_bytes = error.to_vec();

        Ok(ConsensusErrorNAPI(
            ConsensusError::deserialize_from_bytes(error_bytes.as_slice()).with_js_error()?,
        ))
    }

    #[napi(getter, js_name = "message")]
    pub fn message(&self) -> String {
        self.0.to_string()
    }
}
