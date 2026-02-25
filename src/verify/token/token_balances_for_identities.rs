use dpp::balances::credits::TokenAmount;
use drive::verify::RootHash;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[derive(Clone)]
#[napi(js_name = "IdentityTokenBalanceOptionalNAPI")]
pub struct IdentityTokenBalanceOptionalNAPI {
    pub(crate) id: IdentifierNAPI,
    pub balance: Option<BigIntString>,
}

#[napi]
impl IdentityTokenBalanceOptionalNAPI {
    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.id.clone()
    }
}

#[napi(js_name = "VerifiedTokenBalancesForIdentitiesNAPI")]
pub struct VerifiedTokenBalancesForIdentitiesNAPI {
    pub root_hash: Uint8Array,
    balances: Vec<IdentityTokenBalanceOptionalNAPI>,
}

#[napi]
impl VerifiedTokenBalancesForIdentitiesNAPI {
    #[napi(getter, js_name = "balances")]
    pub fn balances(&self) -> Vec<IdentityTokenBalanceOptionalNAPI> {
        self.balances.clone()
    }
}

#[napi(js_name = "verifyTokenBalancesForIdentitiesProof")]
pub fn verify_token_balances_for_identities(
    proof: Uint8Array,
    js_token_id: IdentifierLikeNAPI,
    is_proof_subset: bool,
    js_identities: Vec<IdentifierLikeNAPI>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTokenBalancesForIdentitiesNAPI, napi::Error> {
    let token_id = IdentifierNAPI::try_from(js_token_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let identities: Vec<[u8; 32]> = js_identities
        .into_iter()
        .map(|id| Ok::<[u8; 32], napi::Error>(IdentifierNAPI::try_from(id)?.to_slice()))
        .collect::<Result<Vec<[u8; 32]>, napi::Error>>()?;

    let (root_hash, balances_vec): (RootHash, Vec<([u8; 32], Option<TokenAmount>)>) =
        drive::drive::Drive::verify_token_balances_for_identity_ids(
            &proof.to_vec(),
            token_id.to_slice(),
            identities.as_slice(),
            is_proof_subset,
            &platform_version.into(),
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    let mut js_balances: Vec<IdentityTokenBalanceOptionalNAPI> = Vec::new();

    for (id, balance) in balances_vec.iter() {
        js_balances.push(IdentityTokenBalanceOptionalNAPI {
            id: IdentifierNAPI::from(id.clone()),
            balance: balance.clone().map(BigIntString::from_u64),
        });
    }

    Ok(VerifiedTokenBalancesForIdentitiesNAPI {
        root_hash: root_hash.into(),
        balances: js_balances.into(),
    })
}
