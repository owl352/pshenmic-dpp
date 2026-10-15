use dpp::prelude::Identifier;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::identifier::IdentifierNAPI;
use crate::verify::plain::{
    VerifiedProofNAPI, identifier_from_js, platform_version_from_js, verified, verify_error,
};

#[napi(object, object_from_js = false, js_name = "ContractByRangeNAPI")]
pub struct ContractByRangeNAPI {
    pub id: IdentifierNAPI,
    pub data_contract: Option<DataContractNAPI>,
}

#[napi(js_name = "VerifiedContractsByRangeNAPI")]
pub struct VerifiedContractsByRangeNAPI {
    pub root_hash: Uint8Array,
    contracts: Vec<(Identifier, Option<dpp::prelude::DataContract>)>,
}

#[napi]
impl VerifiedContractsByRangeNAPI {
    /// With `idsOnly` the proof holds no contracts and every `dataContract` is undefined
    #[napi(getter, js_name = "contracts")]
    pub fn contracts(&self) -> Vec<ContractByRangeNAPI> {
        self.contracts
            .iter()
            .map(|(id, contract)| ContractByRangeNAPI {
                id: (*id).into(),
                data_contract: contract.clone().map(Into::into),
            })
            .collect()
    }
}

/// A page of the contracts tree in id order
#[napi(js_name = "verifyContractsByRangeProof")]
pub fn verify_contracts_by_range(
    proof: Uint8Array,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
    limit: u16,
    ids_only: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedContractsByRangeNAPI, napi::Error> {
    let start_at = js_start_at
        .map(identifier_from_js)
        .transpose()?
        .map(|id| (id.to_buffer(), start_at_included));
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, contracts) =
        Drive::verify_contracts_by_range(&proof, start_at, limit, ids_only, &platform_version)
            .map_err(verify_error)?;

    Ok(VerifiedContractsByRangeNAPI {
        root_hash: root_hash.to_vec().into(),
        contracts,
    })
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ContractVersion {
    contract_id: Identifier,
    version: Option<u32>,
}

/// The latest version of each requested contract, `null` for a contract that does not exist
#[napi(js_name = "verifyContractsVersionsProof")]
pub fn verify_contracts_versions(
    proof: Uint8Array,
    js_contract_ids: Vec<IdentifierLikeNAPI>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_ids = js_contract_ids
        .into_iter()
        .map(|id| identifier_from_js(id).map(|id| id.to_buffer()))
        .collect::<Result<Vec<[u8; 32]>, napi::Error>>()?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, versions) =
        Drive::verify_contracts_versions(&proof, &contract_ids, &platform_version)
            .map_err(verify_error)?;

    let versions: Vec<ContractVersion> = versions
        .into_iter()
        .map(|(contract_id, version)| ContractVersion {
            contract_id: Identifier::new(contract_id),
            version,
        })
        .collect();

    verified(root_hash, &versions)
}
