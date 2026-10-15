use std::collections::{BTreeMap, BTreeSet};

use dpp::contract_group::ContractGroupInfo;
use dpp::data_contract::TokenContractPosition;
use dpp::prelude::Identifier;
use drive::drive::Drive;
use drive::drive::contract_groups::types::{ContractGroupMembersPage, ContractGroupMembersQuery};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::utils::serde_from_js;
use crate::verify::plain::{
    VerifiedProofNAPI, identifier_from_js, platform_version_from_js, verified, verify_error,
};

/// The registration of a contract group, `null` when there is none
#[napi(js_name = "verifyContractGroupInfoProof")]
pub fn verify_contract_group_info(
    proof: Uint8Array,
    js_contract_group_id: IdentifierLikeNAPI,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_group_id = identifier_from_js(js_contract_group_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, info): (_, Option<ContractGroupInfo>) =
        Drive::verify_contract_group_info(&proof, contract_group_id, &platform_version)
            .map_err(verify_error)?;

    verified(root_hash, &info)
}

#[derive(serde::Deserialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
enum MembersQuery {
    Contracts {
        #[serde(default, rename = "startAfter")]
        start_after: Option<Identifier>,
    },
    DocumentTypes {
        #[serde(default, rename = "startAfter")]
        start_after: Option<(Identifier, String)>,
    },
    Tokens {
        #[serde(default, rename = "startAfter")]
        start_after: Option<(Identifier, TokenContractPosition)>,
    },
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "members", rename_all = "camelCase")]
enum MembersPage {
    Contracts(Vec<Identifier>),
    DocumentTypes(Vec<(Identifier, String)>),
    Tokens(Vec<(Identifier, TokenContractPosition)>),
}

/// One kind of members of a contract group, paged in key order. The query is
/// `{ kind: 'contracts' | 'documentTypes' | 'tokens', startAfter? }`
#[napi(js_name = "verifyContractGroupMembersProof")]
pub fn verify_contract_group_members(
    proof: Uint8Array,
    js_contract_group_id: IdentifierLikeNAPI,
    js_query: &DynamicValue,
    limit: u16,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_group_id = identifier_from_js(js_contract_group_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let query = match serde_from_js::<MembersQuery>(js_query)? {
        MembersQuery::Contracts { start_after } => {
            ContractGroupMembersQuery::Contracts { start_after }
        }
        MembersQuery::DocumentTypes { start_after } => {
            ContractGroupMembersQuery::DocumentTypes { start_after }
        }
        MembersQuery::Tokens { start_after } => ContractGroupMembersQuery::Tokens { start_after },
    };

    let (root_hash, page) = Drive::verify_contract_group_members(
        &proof,
        contract_group_id,
        &query,
        limit,
        &platform_version,
    )
    .map_err(verify_error)?;

    let page = match page {
        ContractGroupMembersPage::Contracts(ids) => MembersPage::Contracts(ids),
        ContractGroupMembersPage::DocumentTypes(entries) => MembersPage::DocumentTypes(entries),
        ContractGroupMembersPage::Tokens(entries) => MembersPage::Tokens(entries),
    };

    verified(root_hash, &page)
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct TokenMemberships {
    token_contract_position: TokenContractPosition,
    contract_group_ids: BTreeSet<Identifier>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct MembershipsForContract {
    contract: BTreeSet<Identifier>,
    document_types: BTreeMap<String, BTreeSet<Identifier>>,
    tokens: Vec<TokenMemberships>,
}

/// The groups a contract, each of its document types and each of its tokens belong to
#[napi(js_name = "verifyContractGroupMembershipsForContractProof")]
pub fn verify_contract_group_memberships_for_contract(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, memberships) = Drive::verify_contract_group_memberships_for_contract(
        &proof,
        contract_id,
        &platform_version,
    )
    .map_err(verify_error)?;

    let memberships = MembershipsForContract {
        contract: memberships.contract,
        document_types: memberships.document_types,
        tokens: memberships
            .tokens
            .into_iter()
            .map(
                |(token_contract_position, contract_group_ids)| TokenMemberships {
                    token_contract_position,
                    contract_group_ids,
                },
            )
            .collect(),
    };

    verified(root_hash, &memberships)
}
