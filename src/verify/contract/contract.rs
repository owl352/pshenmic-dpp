use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;

#[napi(js_name = "VerifiedContractNAPI")]
pub struct VerifiedContractWASM {
    pub root_hash: Uint8Array,
    data_contract: Option<DataContractNAPI>,
}

#[napi]
impl VerifiedContractWASM {
    #[napi(getter, js_name = "dataContract")]
    pub fn data_contract(&self) -> Option<DataContractNAPI> {
        self.data_contract.clone().into()
    }

    #[napi(setter, js_name = "dataContract")]
    pub fn set_data_contract(&mut self, data_contract: Option<&DataContractNAPI>) {
        self.data_contract = data_contract.map(|contract| contract.clone());
    }
}

#[napi(js_name = "verifyContractProof")]
pub fn verify_contract(
    proof: Uint8Array,
    contract_known_keeps_history: Option<bool>,
    is_proof_subset: bool,
    in_multiple_contract_proof_form: bool,
    js_contract_id: IdentifierLikeNAPI,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedContractWASM, napi::Error> {
    let contract_id = IdentifierNAPI::try_from(js_contract_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, contract_option) = Drive::verify_contract(
        proof.to_vec().as_slice(),
        contract_known_keeps_history,
        is_proof_subset,
        in_multiple_contract_proof_form,
        contract_id.to_slice(),
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedContractWASM {
        root_hash: root_hash.into(),
        data_contract: contract_option.map(DataContractNAPI::from),
    })
}
