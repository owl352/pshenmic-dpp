use dpp::balances::credits::TokenAmount;
use drive::verify::RootHash;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    verify::state_transition::entities::VerifiedIdentityBalanceNAPI,
};

#[napi(js_name = "VerifiedTokensBalancesForIdentityNAPI")]
pub struct VerifiedTokensBalancesForIdentityNAPI {
    pub root_hash: Uint8Array,
    balances: Vec<VerifiedIdentityBalanceNAPI>,
}

#[napi]
impl VerifiedTokensBalancesForIdentityNAPI {
    #[napi(getter, js_name = "balances")]
    pub fn balances(&self) -> Vec<VerifiedIdentityBalanceNAPI> {
        self.balances.clone()
    }
}

#[napi(js_name = "verifyTokensBalancesForIdentityProof")]
pub fn verify_tokens_balances_for_identity(
    proof: Uint8Array,
    js_token_ids: Vec<IdentifierLikeNAPI>,
    js_identity_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTokensBalancesForIdentityNAPI, napi::Error> {
    let identity_id = IdentifierNAPI::try_from(js_identity_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let token_ids: Vec<[u8; 32]> = js_token_ids
        .into_iter()
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .collect::<Result<Vec<[u8; 32]>, napi::Error>>()?;

    let (root_hash, balances_vec): (RootHash, Vec<([u8; 32], Option<TokenAmount>)>) =
        drive::drive::Drive::verify_token_balances_for_identity_id(
            &proof.to_vec(),
            &token_ids,
            identity_id.to_slice(),
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    let mut js_balances: Vec<VerifiedIdentityBalanceNAPI> = Vec::new();

    for (id, balance) in balances_vec.iter() {
        js_balances.push(VerifiedIdentityBalanceNAPI {
            id: IdentifierNAPI::from(id.clone()),
            balance: balance
                .clone()
                .map(BigIntString::from_u64)
                .unwrap_or("-1".to_string()),
        });
    }

    Ok(VerifiedTokensBalancesForIdentityNAPI {
        root_hash: root_hash.into(),
        balances: js_balances.into(),
    })
}
