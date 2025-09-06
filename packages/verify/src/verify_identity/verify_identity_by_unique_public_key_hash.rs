use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identity::IdentityWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedIdentityByUniqueKeyHashWASM")]
pub struct VerifiedIdentityByUniqueKeyHashWASM {
    root_hash: RootHash,
    identity: Option<IdentityWASM>,
}

#[wasm_bindgen]
impl VerifiedIdentityByUniqueKeyHashWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentityByUniqueKeyHashWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentityByUniqueKeyHashWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "identity")]
    pub fn identity(&self) -> Option<IdentityWASM> {
        self.identity.clone()
    }
}

#[wasm_bindgen(js_name = "verifyIdentityByUniqueKeyHashProof")]
pub fn verify_identity_by_unique_public_key_hash(
    proof: &Uint8Array,
    js_public_key_hash: &Uint8Array,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentityByUniqueKeyHashWASM, JsValue> {
    let public_key_hash: [u8; 20] = js_public_key_hash
        .to_vec()
        .try_into()
        .map_err(|_| JsValue::from_str("Invalid public_key_hash length. Expected 20 bytes."))?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, identity) = Drive::verify_full_identity_by_unique_public_key_hash(
        &proof.to_vec(),
        public_key_hash,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentityByUniqueKeyHashWASM {
        root_hash,
        identity: identity.map(IdentityWASM::from),
    })
}
