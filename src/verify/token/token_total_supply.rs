use dpp::balances::total_single_token_balance::TotalSingleTokenBalance;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
};

#[derive(Clone)]
#[napi(js_name = "TotalSingleTokenBalanceNAPI")]
pub struct TotalSingleTokenBalanceNAPI(TotalSingleTokenBalance);

impl From<TotalSingleTokenBalance> for TotalSingleTokenBalanceNAPI {
    fn from(value: TotalSingleTokenBalance) -> Self {
        Self(value)
    }
}

#[napi]
impl TotalSingleTokenBalanceNAPI {
    #[napi(getter, js_name = "tokenSupply")]
    pub fn token_supply(&self) -> BigIntString {
        BigIntString::from_i64(self.0.token_supply)
    }

    #[napi(getter, js_name = "aggregatedTokenAccountBalances")]
    pub fn aggregated_token_account_balances(&self) -> BigIntString {
        BigIntString::from_i64(self.0.aggregated_token_account_balances)
    }
}

#[napi(js_name = "VerifiedTokenTotalSupplyNAPI")]
pub struct VerifiedTokenTotalSupplyNAPI {
    pub root_hash: Uint8Array,
    total_balance: TotalSingleTokenBalanceNAPI,
}

#[napi]
impl VerifiedTokenTotalSupplyNAPI {
    #[napi(getter, js_name = "totalBalance")]
    pub fn total_balance(&self) -> TotalSingleTokenBalanceNAPI {
        self.total_balance.clone()
    }
}

#[napi(js_name = "verifyTokenTotalSupplyProof")]
pub fn verify_token_total_supply(
    proof: Uint8Array,
    js_token_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTokenTotalSupplyNAPI, napi::Error> {
    let token_id = IdentifierNAPI::try_from(js_token_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, total_balance) =
        Drive::verify_token_total_supply_and_aggregated_identity_balance(
            &proof.to_vec(),
            token_id.to_slice(),
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedTokenTotalSupplyNAPI {
        root_hash: root_hash.into(),
        total_balance: total_balance.into(),
    })
}
