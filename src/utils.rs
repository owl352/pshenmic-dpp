use dpp::{ProtocolError, platform_value::Value};
use napi::{
    Env, Status,
    bindgen_prelude::{Function, JsObjectValue, JsValuesTuple, Object},
};
use serde_json::Value as JsonValue;

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

pub fn with_serde_to_json_value(data: Object) -> Result<JsonValue, napi::Error> {
    let json: Object = Env::from(data.env())
        .get_global()?
        .get_named_property("JSON")?;

    let stringify: Option<Function<Object, String>> = json.get("stringify")?;

    if stringify.is_none() {
        return Err(napi::Error::new(
            Status::GenericFailure,
            "JSON.stringify not found",
        ));
    }

    let value: JsonValue = serde_json::from_str(&stringify.unwrap().call(data)?)
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("{e:#}")))?;
    Ok(value)
}

pub fn with_serde_to_platform_value(data: Object) -> Result<Value, napi::Error> {
    Ok(with_serde_to_json_value(data.clone())?.into())
}
