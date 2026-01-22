use std::collections::BTreeMap;

use dpp::{address_funds::PlatformAddress, fee::Credits, prelude::AddressNonce};

use crate::{
    address_transitions::entities::{
        input_address::InputAddressNAPI,
        output_address::{OutputAddressNAPI, OutputAddressNullableCreditsNAPI},
    },
    dynamic_value::TryToU64,
};

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
