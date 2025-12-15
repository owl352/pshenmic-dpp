use dpp::{consensus::ConsensusError, serialization::PlatformDeserializable};
use napi_derive::napi;

use crate::utils::WithJsError;

#[napi(js_name = "ConsensusErrorNAPI")]
pub struct ConsensusErrorNAPI {
    consensus_error: ConsensusError,
}

#[napi]
impl ConsensusErrorNAPI {
    #[napi(js_name = "deserialize")]
    pub fn deserialize(error: Vec<u8>) -> Result<Self, napi::Error> {
        Ok(ConsensusErrorNAPI {
            consensus_error: ConsensusError::deserialize_from_bytes(error.as_slice())
                .with_js_error()?,
        })
    }

    #[napi(getter, js_name = "message")]
    pub fn message(&self) -> String {
        self.consensus_error.to_string()
    }
}
