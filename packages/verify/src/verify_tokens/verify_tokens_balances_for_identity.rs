use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::verify::RootHash;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedTokenBalancesForIdentitiesWASM")]
pub struct VerifiedTokensBalancesForIdentityWASM {
    root_hash: RootHash,
    balances: JsValue,
}

#[wasm_bindgen]
impl VerifiedTokensBalancesForIdentityWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTokensBalancesForIdentityWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTokensBalancesForIdentityWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "balances")]
    pub fn balances(&self) -> JsValue {
        self.balances.clone()
    }
}
