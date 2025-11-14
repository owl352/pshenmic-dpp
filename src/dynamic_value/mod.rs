use napi::{Status, bindgen_prelude::{Null, Uint8Array}};
use napi_derive::napi;

pub trait TryToU64 {
    fn try_to_u64(&self) -> Result<u64, napi::Error>;
}


#[napi(object)]
pub struct Uint64String {
    pub value: String,
}

impl TryToU64 for Uint64String {
    fn try_to_u64(&self) -> Result<u64, napi::Error> {
        self.value.parse().map_err(|_| {
            napi::Error::new(
                Status::Unknown,
                "Cannot convert String from Uint64String to u64".to_string(),
            )
        })
    }
}

impl From<u64> for Uint64String {
    fn from(value: u64) -> Self {
        Uint64String { value: value.to_string() }
    }
}

#[napi(js_name = "DynamicValue")]
pub enum DynamicValue {
    Text(String),
    Bytes(Uint8Array),
    Uint8(u8),
    Uint16(u16),
    Uint32(u32),
    Uint64(Uint64String),
    Bool(bool),
    Null(Null),
    Object(Vec<(DynamicValue, DynamicValue)>),
    Array(Vec<DynamicValue>),
}
