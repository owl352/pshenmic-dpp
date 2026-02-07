use std::collections::BTreeMap;
use std::sync::Arc;

use dpp::prelude::{DataContract, Identifier};
use drive::drive::Drive;
use drive::query::ContractLookupFn;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::DynamicValue;
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::verify::state_transition::entities::{BlockInfoNAPI, VerifiedStateTransitionResultNAPI};

#[napi(js_name = "verifyStateTransitionResult")]
pub fn verify_state_transition_result(
    proof: Uint8Array,
    state_transition: &StateTransitionNAPI,
    block_info: &BlockInfoNAPI,
    js_known_contracts_array: Vec<&DataContractNAPI>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedStateTransitionResultNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;
    let known_contracts = js_known_contracts_to_rs(js_known_contracts_array);

    let contract_lookup_fn: Box<ContractLookupFn> =
        Box::new(move |identifier: &Identifier| Ok(known_contracts.get(identifier).cloned()));

    let (root_hash, proof_result) = Drive::verify_state_transition_was_executed_with_proof(
        &state_transition.clone().into(),
        &block_info.clone().into(),
        &proof.to_vec(),
        &contract_lookup_fn,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedStateTransitionResultNAPI {
        root_hash: root_hash.into(),
        result: proof_result,
    })
}

fn js_known_contracts_to_rs(
    js_known_contracts_array: Vec<&DataContractNAPI>,
) -> BTreeMap<Identifier, Arc<DataContract>> {
    let mut out: BTreeMap<Identifier, Arc<DataContract>> = BTreeMap::new();

    for js_contract in js_known_contracts_array.into_iter() {
        let id: IdentifierNAPI = js_contract.get_id();

        out.insert(id.into(), Arc::new(DataContract::from(js_contract.clone())));
    }

    out
}
