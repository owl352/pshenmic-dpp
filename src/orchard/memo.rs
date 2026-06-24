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
        if value.len() != MEMO_PAYLOAD_SIZE {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!("Memo payload must be {MEMO_PAYLOAD_SIZE}"),
            ));
        }

        Ok(ShieldedMemoNAPI(ShieldedMemo::Text(value)))
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
                format!("Memo payload must be {MEMO_PAYLOAD_SIZE}"),
            ));
        }

        Ok(ShieldedMemoNAPI(ShieldedMemo::Other {
            kind,
            payload: payload.to_vec().as_slice().try_into().unwrap(),
        }))
    }

    #[napi(js_name = "toString")]
    pub fn to_string(&self) -> Result<String, napi::Error> {
        Ok(str::from_utf8(&self.0.to_bytes().clone())
            .map_err(|_| {
                napi::Error::new(
                    napi::Status::GenericFailure,
                    "cannot convert bytes to utf-8",
                )
            })?
            .to_string())
    }

    #[napi(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.0.to_bytes().clone().into()
    }
}
