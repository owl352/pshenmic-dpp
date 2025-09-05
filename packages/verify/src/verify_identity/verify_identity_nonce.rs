use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::prelude::IdentityNonce;
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedIdentityNonceWASM")]
pub struct VerifiedIdentityNonceWASM {
    root_hash: RootHash,
    nonce: Option<IdentityNonce>,
}

#[wasm_bindgen]
impl VerifiedIdentityNonceWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentityNonceWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentityNonceWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "nonce")]
    pub fn nonce(&self) -> Option<IdentityNonce> {
        self.nonce
    }
}

#[wasm_bindgen(js_name = "verifyIdentityNonce")]
pub fn verify_identity_nonce(
    proof: &Uint8Array,
    js_identity_id: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentityNonceWASM, JsValue> {
    let identity_id = IdentifierWASM::try_from(js_identity_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, nonce) = Drive::verify_identity_nonce(
        &proof.to_vec(),
        identity_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentityNonceWASM { root_hash, nonce })
}
