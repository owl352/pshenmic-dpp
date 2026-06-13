use std::collections::BTreeMap;

use dpp::{address_funds::PlatformAddress, fee::Credits, prelude::AddressNonce};

use crate::{
    address_transitions::entities::{
        input_address::InputAddressNAPI,
        output_address::{OutputAddressNAPI, OutputAddressNullableCreditsNAPI},
    },
    dynamic_value::TryToU64,
};

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

pub fn js_inputs_to_inputs(
    js_inputs: Vec<&InputAddressNAPI>,
) -> Result<BTreeMap<PlatformAddress, (AddressNonce, Credits)>, napi::Error> {
    js_inputs
        .into_iter()
        .map(|input| {
            Ok::<(PlatformAddress, (AddressNonce, Credits)), napi::Error>((
                input.address().clone().into(),
                (input.nonce().clone(), input.credits().try_to_u64()?),
            ))
        })
        .collect::<Result<BTreeMap<PlatformAddress, (AddressNonce, Credits)>, napi::Error>>()
}

pub fn js_outputs_to_outputs_nullable(
    js_outputs: Vec<&OutputAddressNullableCreditsNAPI>,
) -> Result<BTreeMap<PlatformAddress, Option<Credits>>, napi::Error> {
    js_outputs
        .into_iter()
        .map(|output| {
            Ok::<(PlatformAddress, Option<Credits>), napi::Error>((
                output.address().clone().into(),
                output
                    .credits()
                    .clone()
                    .map(|credits| credits.try_to_u64())
                    .transpose()?,
            ))
        })
        .collect::<Result<BTreeMap<PlatformAddress, Option<Credits>>, napi::Error>>()
}

pub fn js_outputs_to_outputs(
    js_outputs: Vec<&OutputAddressNAPI>,
) -> Result<BTreeMap<PlatformAddress, Credits>, napi::Error> {
    js_outputs
        .into_iter()
        .map(|output| {
            Ok::<(PlatformAddress, Credits), napi::Error>((
                output.address().clone().into(),
                output.credits().try_to_u64()?,
            ))
        })
        .collect::<Result<BTreeMap<PlatformAddress, Credits>, napi::Error>>()
}
