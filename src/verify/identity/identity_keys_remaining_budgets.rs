use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::verify::plain::{
    VerifiedProofNAPI, identifier_from_js, platform_version_from_js, verified, verify_error,
};

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct KeyRemainingBudget {
    key_id: u32,
    remaining_budget: Option<u64>,
}

/// What is left of the budget of each requested key; `remainingBudget` is `null` for a key
/// without a budget or not found
#[napi(js_name = "verifyIdentityKeysRemainingBudgetsProof")]
pub fn verify_identity_keys_remaining_budgets(
    proof: Uint8Array,
    js_identity_id: IdentifierLikeNAPI,
    key_ids: Vec<u32>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let identity_id = identifier_from_js(js_identity_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, budgets): (_, Vec<(u32, Option<u64>)>) =
        Drive::verify_identity_keys_remaining_budgets(
            &proof,
            identity_id.to_buffer(),
            &key_ids,
            verify_subset_of_proof,
            &platform_version,
        )
        .map_err(verify_error)?;

    let budgets: Vec<KeyRemainingBudget> = budgets
        .into_iter()
        .map(|(key_id, remaining_budget)| KeyRemainingBudget {
            key_id,
            remaining_budget,
        })
        .collect();

    verified(root_hash, &budgets)
}
