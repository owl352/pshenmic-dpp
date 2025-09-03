use dpp::balances::credits::TokenAmount;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::verify::RootHash;
use js_sys::{Array, Object, Reflect, Uint8Array};
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedTokenBalancesForIdentitiesWASM")]
pub struct VerifiedTokenBalancesForIdentitiesWASM {
    root_hash: RootHash,
    balances: JsValue,
}

#[wasm_bindgen]
impl VerifiedTokenBalancesForIdentitiesWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTokenBalancesForIdentitiesWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTokenBalancesForIdentitiesWASM".to_string()
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

#[wasm_bindgen(js_name = "verifyTokenBalancesForIdentities")]
pub fn verify_token_balances_for_identities(
    proof: &Uint8Array,
    js_token_id: &JsValue,
    is_proof_subset: bool,
    js_identities: &JsValue,
    js_platform_version: &JsValue,
) -> Result<VerifiedTokenBalancesForIdentitiesWASM, JsValue> {
    let token_id = IdentifierWASM::try_from(js_token_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let identities = match js_identities.is_array() {
        false => Err(JsValue::from("identities should be array")),
        true => {
            let js_ids_array = Array::from(js_identities);

            let mut ids_array: Vec<[u8; 32]> = Vec::new();

            for js_id in js_ids_array.iter() {
                ids_array.push(IdentifierWASM::try_from(js_id)?.to_slice())
            }

            Ok(ids_array)
        }
    }?;

    let (root_hash, balances_vec): (RootHash, Vec<([u8; 32], Option<TokenAmount>)>) =
        drive::drive::Drive::verify_token_balances_for_identity_ids(
            &proof.to_vec(),
            token_id.to_slice(),
            identities.as_slice(),
            is_proof_subset,
            &platform_version.into(),
        )
        .map_err(|e| JsValue::from(e.to_string()))?;

    let js_balances = Array::new();

    for (id, balance) in balances_vec.iter() {
        let js_balance = Object::new();

        Reflect::set(
            &js_balance,
            &"identityId".into(),
            &Uint8Array::from(id.as_slice()).into(),
        )?;
        Reflect::set(
            &js_balance,
            &"balance".into(),
            &JsValue::from(balance.clone()),
        )?;

        js_balances.push(&js_balance);
    }

    Ok(VerifiedTokenBalancesForIdentitiesWASM {
        root_hash,
        balances: js_balances.into(),
    })
}
