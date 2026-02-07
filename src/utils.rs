use std::collections::BTreeMap;

use dpp::{
    ProtocolError, platform_value::Value, prelude::Identifier, util::hash::hash_double_to_vec,
};
use napi::Status;

use crate::dynamic_value::DynamicValue;

pub trait WithJsError<T> {
    fn with_js_error(self) -> Result<T, napi::Error>;
}

impl<T> WithJsError<T> for Result<T, napi::Error> {
    fn with_js_error(self) -> Result<T, napi::Error> {
        match self {
            Ok(ok) => Ok(ok),
            Err(error) => Err(error),
        }
    }
}

impl<T> WithJsError<T> for Result<T, ProtocolError> {
    fn with_js_error(self) -> Result<T, napi::Error> {
        match self {
            Ok(ok) => Ok(ok),
            Err(error) => Err(napi::Error::new(Status::GenericFailure, error.to_string())),
        }
    }
}

// pub fn with_serde_to_json_value(data: Object) -> Result<JsonValue, napi::Error> {
//     let json: Object = Env::from(data.env())
//         .get_global()?
//         .get_named_property("JSON")?;

//     let stringify: Option<Function<Object, String>> = json.get("stringify")?;

//     if stringify.is_none() {
//         return Err(napi::Error::new(
//             Status::GenericFailure,
//             "JSON.stringify not found",
//         ));
//     }

//     let value: JsonValue = serde_json::from_str(&stringify.unwrap().call(data)?)
//         .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("{e:#}")))?;
//     Ok(value)
// }

pub fn with_serde_to_platform_value_map(
    data: &DynamicValue,
) -> Result<BTreeMap<String, Value>, napi::Error> {
    Value::try_from(data.clone())?
        .into_btree_string_map()
        .map_err(ProtocolError::ValueError)
        .with_js_error()
}

pub fn generate_document_id_v0(
    contract_id: &Identifier,
    owner_id: &Identifier,
    document_type_name: &str,
    entropy: &[u8],
) -> Result<Identifier, napi::Error> {
    let mut buf: Vec<u8> = vec![];

    buf.extend_from_slice(&contract_id.to_buffer());
    buf.extend_from_slice(&owner_id.to_buffer());
    buf.extend_from_slice(document_type_name.as_bytes());
    buf.extend_from_slice(entropy);

    Identifier::from_bytes(&hash_double_to_vec(&buf))
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))
}
