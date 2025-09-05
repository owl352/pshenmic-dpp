use dpp::balances::credits::SignedTokenAmount;
use dpp::balances::total_single_token_balance::TotalSingleTokenBalance;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "TotalSingleTokenBalanceWASM")]
pub struct TotalSingleTokenBalanceWASM(TotalSingleTokenBalance);

impl From<TotalSingleTokenBalance> for TotalSingleTokenBalanceWASM {
    fn from(value: TotalSingleTokenBalance) -> Self {
        Self(value)
    }
}

#[wasm_bindgen]
impl TotalSingleTokenBalanceWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "TotalSingleTokenBalanceWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "TotalSingleTokenBalanceWASM".to_string()
    }

    #[wasm_bindgen(getter = "tokenSupply")]
    pub fn token_supply(&self) -> SignedTokenAmount {
        self.0.token_supply
    }

    #[wasm_bindgen(getter = "aggregatedTokenAccountBalances")]
    pub fn aggregated_token_account_balances(&self) -> SignedTokenAmount {
        self.0.aggregated_token_account_balances
    }
}

#[wasm_bindgen(js_name = "VerifiedTokenTotalSupplyWASM")]
pub struct VerifiedTokenTotalSupplyWASM {
    root_hash: RootHash,
    total_balance: TotalSingleTokenBalanceWASM,
}

#[wasm_bindgen]
impl VerifiedTokenTotalSupplyWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTokenTotalSupplyWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTokenTotalSupplyWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "totalBalance")]
    pub fn total_balance(&self) -> TotalSingleTokenBalanceWASM {
        self.total_balance.clone()
    }
}

#[wasm_bindgen(js_name = "verifyTokenTotalSupply")]
pub fn verify_token_total_supply(
    proof: &Uint8Array,
    js_token_id: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedTokenTotalSupplyWASM, JsValue> {
    let token_id = IdentifierWASM::try_from(js_token_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, total_balance) =
        Drive::verify_token_total_supply_and_aggregated_identity_balance(
            &proof.to_vec(),
            token_id.to_slice(),
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedTokenTotalSupplyWASM {
        root_hash,
        total_balance: total_balance.into(),
    })
}
