use dpp::balances::credits::TokenAmount;
use drive::verify::RootHash;
use js_sys::{Array, Object, Reflect, Uint8Array};
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedTokensBalancesForIdentityWASM")]
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
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "balances")]
    pub fn balances(&self) -> JsValue {
        self.balances.clone()
    }
}

#[wasm_bindgen(js_name = "verifyTokensBalancesForIdentityProof")]
pub fn verify_tokens_balances_for_identity(
    proof: &Uint8Array,
    js_token_ids: &JsValue,
    js_identity_id: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedTokensBalancesForIdentityWASM, JsValue> {
    let identity_id = IdentifierWASM::try_from(js_identity_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let token_ids = match js_token_ids.is_array() {
        false => Err(JsValue::from("token ids should be array")),
        true => {
            let js_token_ids_array = Array::from(js_token_ids);

            let mut token_ids_array: Vec<[u8; 32]> = Vec::new();

            for js_token_id in js_token_ids_array.iter() {
                token_ids_array.push(IdentifierWASM::try_from(js_token_id)?.to_slice())
            }

            Ok(token_ids_array)
        }
    }?;

    let (root_hash, balances_vec): (RootHash, Vec<([u8; 32], Option<TokenAmount>)>) =
        drive::drive::Drive::verify_token_balances_for_identity_id(
            &proof.to_vec(),
            &token_ids,
            identity_id.to_slice(),
            verify_subset_of_proof,
            &platform_version.into(),
        )
        .map_err(|e| JsValue::from(e.to_string()))?;

    let js_balances = Array::new();

    for (id, balance) in balances_vec.iter() {
        let js_balance = Object::new();

        Reflect::set(
            &js_balance,
            &"tokenId".into(),
            &Uint8Array::from(id.as_slice()).into(),
        )?;
        Reflect::set(
            &js_balance,
            &"balance".into(),
            &JsValue::from(balance.clone()),
        )?;

        js_balances.push(&js_balance);
    }

    Ok(VerifiedTokensBalancesForIdentityWASM {
        root_hash,
        balances: js_balances.into(),
    })
}
