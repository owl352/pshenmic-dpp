use dpp::shielded::{MEMO_PAYLOAD_SIZE, ShieldedMemo};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "ShieldedMemoNAPI")]
#[derive(Clone)]
pub struct ShieldedMemoNAPI(ShieldedMemo);

impl From<ShieldedMemo> for ShieldedMemoNAPI {
    fn from(value: ShieldedMemo) -> Self {
        ShieldedMemoNAPI(value)
    }
}

impl From<ShieldedMemoNAPI> for ShieldedMemo {
    fn from(value: ShieldedMemoNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ShieldedMemoNAPI {
    #[napi(js_name = "fromString")]
    pub fn from_string(value: String) -> Result<Self, napi::Error> {
        // Delegate so the length rule stays defined in exactly one place.
        ShieldedMemo::text(value)
            .map(ShieldedMemoNAPI)
            .map_err(|error| napi::Error::new(napi::Status::InvalidArg, error.to_string()))
    }

    #[napi(js_name = "empty")]
    pub fn empty() -> ShieldedMemoNAPI {
        ShieldedMemoNAPI(ShieldedMemo::Empty)
    }

    #[napi(js_name = "other")]
    pub fn other(kind: u32, payload: Uint8Array) -> Result<Self, napi::Error> {
        if payload.len() != MEMO_PAYLOAD_SIZE {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!(
                    "Memo payload must be exactly {MEMO_PAYLOAD_SIZE} bytes, got {}",
                    payload.len()
                ),
            ));
        }

        Ok(ShieldedMemoNAPI(ShieldedMemo::Other {
            kind,
            payload: payload.to_vec().as_slice().try_into().unwrap(),
        }))
    }

    #[napi(js_name = "toString")]
    pub fn to_string(&self) -> Result<String, napi::Error> {
        match &self.0 {
            ShieldedMemo::Empty => Ok(String::new()),
            ShieldedMemo::Text(text) => Ok(text.clone()),
            ShieldedMemo::Other { kind, .. } => Err(napi::Error::new(
                napi::Status::GenericFailure,
                format!("memo of kind {kind} is not text; use toBytes instead"),
            )),
        }
    }

    #[napi(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.0.to_bytes().clone().into()
    }
}
