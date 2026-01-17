use std::collections::BTreeMap;

use napi::{
    Either, Status,
    bindgen_prelude::{Either11, Null, Uint8Array, Undefined},
};
use napi_derive::napi;

use crate::identifier::IdentifierNAPI;

#[napi(js_name = "IdentifierLikeNAPI")]
pub type IdentifierLikeNAPI<'a> = Either<&'a IdentifierNAPI, &'a DynamicValue>;

pub trait TryToU64 {
    fn try_to_u64(&self) -> Result<u64, napi::Error>;
    fn try_from_string(val: String) -> Result<Uint64String, napi::Error>;
    fn from_u64(val: u64) -> Uint64String;
}

#[napi]
pub type Uint64String = String;

impl TryToU64 for Uint64String {
    fn try_to_u64(&self) -> Result<u64, napi::Error> {
        self.parse().map_err(|_| {
            napi::Error::new(
                Status::Unknown,
                "Cannot convert String from Uint64String to u64".to_string(),
            )
        })
    }

    fn try_from_string(val: String) -> Result<Self, napi::Error> {
        match val.trim().parse::<u64>() {
            Ok(num) => Ok(num.to_string()),
            Err(_) => Err(napi::Error::new(
                napi::Status::NumberExpected,
                format!("Cannot parse string ({}) to u64", val),
            )),
        }
    }

    fn from_u64(val: u64) -> Self {
        val.to_string()
    }
}

#[napi(js_name = "DynamicValue")]
pub struct DynamicValue{
    pub val: Either11<
        String,
        Uint8Array,
        u8,
        u16,
        u32,
        Uint64String,
        bool,
        BTreeMap<String, DynamicValue>,
        Vec<DynamicValue>,
        Null,
        Undefined
    >,
};

impl From<String> for DynamicValue {
    fn from(value: String) -> Self {
        DynamicValue(Either11::A(value))
    }
}

impl From<u8> for DynamicValue {
    fn from(value: u8) -> Self {
        DynamicValue(Either11::C(value))
    }
}

impl From<u16> for DynamicValue {
    fn from(value: u16) -> Self {
        DynamicValue(Either11::D(value))
    }
}

impl From<u32> for DynamicValue {
    fn from(value: u32) -> Self {
        DynamicValue(Either11::E(value))
    }
}

impl From<bool> for DynamicValue {
    fn from(value: bool) -> Self {
        DynamicValue(Either11::G(value))
    }
}

impl DynamicValue {
    pub fn is_undefined(&self) -> bool {
        match self.0 {
            Either11::K(_) => true,
            _ => false,
        }
    }

    pub fn is_null(&self) -> bool {
        match self.0 {
            Either11::J(_) => true,
            _ => false,
        }
    }

    pub fn is_undefined_or_null(&self) -> bool {
        self.is_null() || self.is_undefined()
    }

    pub fn try_to_u64(&self) -> Result<u64, napi::Error> {
        match &self.0 {
            Either11::C(val) => Ok(val.clone() as u64),
            Either11::D(val) => Ok(val.clone() as u64),
            Either11::E(val) => Ok(val.clone() as u64),
            Either11::F(val) => val.try_to_u64(),
            Either11::A(val) => Uint64String::from(val).try_to_u64(),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot convert value to u64",
            )),
        }
    }

    pub fn is_string(&self) -> bool {
        match self.0 {
            Either11::A(_) => true,
            _ => false,
        }
    }

    pub fn is_uint_8_array(&self) -> bool {
        match self.0 {
            Either11::B(_) => true,
            _ => false,
        }
    }

    pub fn is_uint8(&self) -> bool {
        match self.0 {
            Either11::C(_) => true,
            _ => false,
        }
    }

    pub fn is_uint16(&self) -> bool {
        match self.0 {
            Either11::D(_) => true,
            _ => false,
        }
    }

    pub fn is_uint32(&self) -> bool {
        match self.0 {
            Either11::E(_) => true,
            _ => false,
        }
    }

    pub fn is_uint64(&self) -> bool {
        match self.0 {
            Either11::F(_) => true,
            _ => false,
        }
    }

    pub fn is_bool(&self) -> bool {
        match self.0 {
            Either11::G(_) => true,
            _ => false,
        }
    }

    pub fn is_map(&self) -> bool {
        match self.0 {
            Either11::H(_) => true,
            _ => false,
        }
    }

    pub fn is_array(&self) -> bool {
        match self.0 {
            Either11::I(_) => true,
            _ => false,
        }
    }

    pub fn is_number(&self) -> bool {
        self.is_uint8() || self.is_uint16() || self.is_uint32() || self.is_uint64()
    }

    pub fn as_string(&self) -> Option<String> {
        match &self.0 {
            Either11::A(string) => Some(string.clone()),
            _ => None,
        }
    }

    pub fn as_uint_8_array(&self) -> Option<&Uint8Array> {
        match &self.0 {
            Either11::B(bytes) => Some(bytes),
            _ => None,
        }
    }

    pub fn as_uint8(&self) -> Option<u8> {
        match self.0 {
            Either11::C(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_uint16(&self) -> Option<u16> {
        match self.0 {
            Either11::C(val) => Some(val as u16),
            Either11::D(val) => Some(val),
            _ => None,
        }
    }

    pub fn as_uint32(&self) -> Option<u32> {
        match self.0 {
            Either11::C(val) => Some(val as u32),
            Either11::D(val) => Some(val as u32),
            Either11::E(val) => Some(val),
            _ => None,
        }
    }
}

impl TryFrom<&DynamicValue> for u64 {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        match value.is_number() {
            true => value.try_to_u64(),
            false => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot convert value to number",
            )),
        }
    }
}
