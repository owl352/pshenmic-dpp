use std::collections::BTreeMap;

use dpp::platform_value::Value;
use napi::{
    Either, Status,
    bindgen_prelude::{Either16, Null, Uint8Array, Undefined},
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

#[derive(Clone)]
#[napi(js_name = "DynamicValue")]
pub struct DynamicValue(
    Either16<
        String,
        Vec<u8>,
        u8,
        u16,
        u32,
        Uint64String,
        bool,
        BTreeMap<String, DynamicValue>,
        Vec<DynamicValue>,
        Null,
        Undefined,
        i8,
        i16,
        i32,
        i64,
        f64,
    >,
);

#[napi]
impl DynamicValue {
    #[napi(constructor)]
    pub fn new(
        value: Either16<
            String,
            Uint8Array,
            u8,
            u16,
            u32,
            Uint64String,
            bool,
            BTreeMap<String, &DynamicValue>,
            Vec<&DynamicValue>,
            Null,
            Undefined,
            i8,
            i16,
            i32,
            i64,
            f64,
        >,
    ) -> Self {
        let owned = match value {
            Either16::A(v) => Either16::A(v),
            Either16::B(v) => Either16::B(v.to_vec()),
            Either16::C(v) => Either16::C(v),
            Either16::D(v) => Either16::D(v),
            Either16::E(v) => Either16::E(v),
            Either16::F(v) => Either16::F(v),
            Either16::G(v) => Either16::G(v),
            Either16::H(map) => Either16::H(map.into_iter().map(|(k, v)| (k, v.clone())).collect()),
            Either16::I(vec) => Either16::I(vec.into_iter().cloned().collect()),
            Either16::J(v) => Either16::J(v),
            Either16::K(v) => Either16::K(v),
            Either16::L(v) => Either16::L(v),
            Either16::M(v) => Either16::M(v),
            Either16::N(v) => Either16::N(v),
            Either16::O(v) => Either16::O(v),
            Either16::P(v) => Either16::P(v),
        };

        Self(owned)
    }

    #[napi(getter, js_name = "place")]
    pub fn place_holder(&self) -> String {
        "holder".to_string()
    }
}

impl TryFrom<Value> for DynamicValue {
    type Error = napi::Error;

    fn try_from(value: Value) -> Result<Self, Self::Error> {
        match value {
            Value::U128(num) => Ok(DynamicValue(Either16::F(Uint64String::from(
                num.to_string(),
            )))),
            Value::I128(num) => Ok(DynamicValue(Either16::F(Uint64String::from(
                num.to_string(),
            )))),
            Value::U64(num) => Ok(DynamicValue(Either16::F(Uint64String::from(
                num.to_string(),
            )))),
            Value::I64(num) => Ok(DynamicValue(Either16::O(num))),
            Value::U32(num) => Ok(DynamicValue(Either16::E(num))),
            Value::I32(num) => Ok(DynamicValue(Either16::N(num))),
            Value::U16(num) => Ok(DynamicValue(Either16::D(num))),
            Value::I16(num) => Ok(DynamicValue(Either16::M(num))),
            Value::U8(num) => Ok(DynamicValue(Either16::C(num))),
            Value::I8(num) => Ok(DynamicValue(Either16::L(num))),
            Value::Bytes(bytes) => Ok(DynamicValue(Either16::B(bytes))),
            Value::Bytes20(bytes) => Ok(DynamicValue(Either16::B(bytes.to_vec()))),
            Value::Bytes32(bytes) => Ok(DynamicValue(Either16::B(bytes.to_vec()))),
            Value::Bytes36(bytes) => Ok(DynamicValue(Either16::B(bytes.to_vec()))),
            Value::EnumU8(bytes) => Ok(DynamicValue(Either16::B(bytes))),
            Value::EnumString(items) => Ok(DynamicValue(Either16::I(
                items
                    .iter()
                    .map(|i| DynamicValue::from(i.clone()))
                    .collect(),
            ))),
            Value::Identifier(bytes) => Ok(DynamicValue(Either16::B(bytes.to_vec()))),
            Value::Float(num) => Ok(DynamicValue(Either16::P(num))),
            Value::Text(text) => Ok(DynamicValue::from(text)),
            Value::Bool(flag) => Ok(DynamicValue::from(flag)),
            Value::Null => Ok(DynamicValue(Either16::J(Null))),
            Value::Array(arr) => Ok(DynamicValue(Either16::I(
                arr.iter()
                    .map(|v| Ok::<DynamicValue, napi::Error>(v.clone().try_into()?))
                    .collect::<Result<Vec<DynamicValue>, napi::Error>>()?,
            ))),
            Value::Map(val) => Ok(DynamicValue(Either16::H(
                val.into_iter()
                    .map(|(k, v)| {
                        Ok::<(String, DynamicValue), napi::Error>((k.to_string(), v.try_into()?))
                    })
                    .collect::<Result<BTreeMap<String, DynamicValue>, napi::Error>>()?,
            ))),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Unimplemented type",
            )),
        }
    }
}

impl TryFrom<DynamicValue> for Value {
    type Error = napi::Error;
    fn try_from(value: DynamicValue) -> Result<Self, Self::Error> {
        match value.0 {
            Either16::A(v) => Ok(Value::Text(v)),
            Either16::B(v) => Ok(Value::Bytes(v.to_vec())),
            Either16::C(v) => Ok(Value::U8(v)),
            Either16::D(v) => Ok(Value::U16(v)),
            Either16::E(v) => Ok(Value::U32(v)),
            Either16::F(v) => Ok(Value::U64(v.try_to_u64()?)),
            Either16::G(v) => Ok(Value::Bool(v)),
            Either16::H(obj) => {
                let mut map: Vec<(Value, Value)> = Vec::new();
                for (k, v) in obj.iter() {
                    let val = Value::try_from(v.clone())?;
                    map.push((Value::Text(k.clone()), val));
                }

                Ok(Value::Map(map))
            }
            Either16::I(js_array) => {
                let mut arr: Vec<Value> = Vec::new();

                for v in js_array {
                    let val = Value::try_from(v.clone())?;
                    arr.push(val);
                }

                Ok(Value::Array(arr))
            }
            Either16::J(_) => Ok(Value::Null),
            Either16::K(_) => Ok(Value::Null),
            Either16::L(num) => Ok(Value::I8(num)),
            Either16::M(num) => Ok(Value::I16(num)),
            Either16::N(num) => Ok(Value::I32(num)),
            Either16::O(num) => Ok(Value::I64(num)),
            Either16::P(num) => Ok(Value::Float(num)),
        }
    }
}

impl From<String> for DynamicValue {
    fn from(value: String) -> Self {
        DynamicValue(Either16::A(value))
    }
}

impl From<u8> for DynamicValue {
    fn from(value: u8) -> Self {
        DynamicValue(Either16::C(value))
    }
}

impl From<u16> for DynamicValue {
    fn from(value: u16) -> Self {
        DynamicValue(Either16::D(value))
    }
}

impl From<u32> for DynamicValue {
    fn from(value: u32) -> Self {
        DynamicValue(Either16::E(value))
    }
}

impl From<bool> for DynamicValue {
    fn from(value: bool) -> Self {
        DynamicValue(Either16::G(value))
    }
}

impl DynamicValue {
    pub fn is_undefined(&self) -> bool {
        match self.0 {
            Either16::K(_) => true,
            _ => false,
        }
    }

    pub fn is_null(&self) -> bool {
        match self.0 {
            Either16::J(_) => true,
            _ => false,
        }
    }

    pub fn is_undefined_or_null(&self) -> bool {
        self.is_null() || self.is_undefined()
    }

    pub fn try_to_u64(&self) -> Result<u64, napi::Error> {
        match &self.0 {
            Either16::C(val) => Ok(val.clone() as u64),
            Either16::D(val) => Ok(val.clone() as u64),
            Either16::E(val) => Ok(val.clone() as u64),
            Either16::F(val) => val.try_to_u64(),
            Either16::A(val) => Uint64String::from(val).try_to_u64(),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot convert value to u64",
            )),
        }
    }

    pub fn is_string(&self) -> bool {
        match self.0 {
            Either16::A(_) => true,
            _ => false,
        }
    }

    pub fn is_uint_8_array(&self) -> bool {
        match self.0 {
            Either16::B(_) => true,
            _ => false,
        }
    }

    pub fn is_uint8(&self) -> bool {
        match self.0 {
            Either16::C(_) => true,
            _ => false,
        }
    }

    pub fn is_uint16(&self) -> bool {
        match self.0 {
            Either16::D(_) => true,
            _ => false,
        }
    }

    pub fn is_uint32(&self) -> bool {
        match self.0 {
            Either16::E(_) => true,
            _ => false,
        }
    }

    pub fn is_uint64(&self) -> bool {
        match self.0 {
            Either16::F(_) => true,
            _ => false,
        }
    }

    pub fn is_int8(&self) -> bool {
        match self.0 {
            Either16::L(_) => true,
            _ => false,
        }
    }

    pub fn is_int16(&self) -> bool {
        match self.0 {
            Either16::M(_) => true,
            _ => false,
        }
    }

    pub fn is_int32(&self) -> bool {
        match self.0 {
            Either16::N(_) => true,
            _ => false,
        }
    }

    pub fn is_int64(&self) -> bool {
        match self.0 {
            Either16::O(_) => true,
            _ => false,
        }
    }

    pub fn is_f64(&self) -> bool {
        match self.0 {
            Either16::P(_) => true,
            _ => false,
        }
    }

    pub fn is_bool(&self) -> bool {
        match self.0 {
            Either16::G(_) => true,
            _ => false,
        }
    }

    pub fn is_map(&self) -> bool {
        match self.0 {
            Either16::H(_) => true,
            _ => false,
        }
    }

    pub fn is_array(&self) -> bool {
        match self.0 {
            Either16::I(_) => true,
            _ => false,
        }
    }

    pub fn is_number(&self) -> bool {
        self.is_uint8()
            || self.is_uint16()
            || self.is_uint32()
            || self.is_uint64()
            || self.is_int8()
            || self.is_int16()
            || self.is_int32()
            || self.is_int64()
            || self.is_f64()
    }

    pub fn as_string(&self) -> Option<String> {
        match &self.0 {
            Either16::A(string) => Some(string.clone()),
            _ => None,
        }
    }

    pub fn as_bytes(&self) -> Option<&Vec<u8>> {
        match &self.0 {
            Either16::B(bytes) => Some(bytes),
            _ => None,
        }
    }

    pub fn as_uint8(&self) -> Option<u8> {
        match self.0 {
            Either16::C(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_uint16(&self) -> Option<u16> {
        match self.0 {
            Either16::C(val) => Some(val as u16),
            Either16::D(val) => Some(val),
            _ => None,
        }
    }

    pub fn as_uint32(&self) -> Option<u32> {
        match self.0 {
            Either16::C(val) => Some(val as u32),
            Either16::D(val) => Some(val as u32),
            Either16::E(val) => Some(val),
            _ => None,
        }
    }

    pub fn as_bool(&self) -> Option<bool> {
        match self.0 {
            Either16::G(val) => Some(val),
            _ => None,
        }
    }

    pub fn as_map(&self) -> Option<&BTreeMap<String, DynamicValue>> {
        match &self.0 {
            Either16::H(val) => Some(val),
            _ => None,
        }
    }

    pub fn as_array(&self) -> Option<&Vec<DynamicValue>> {
        match &self.0 {
            Either16::I(val) => Some(val),
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
