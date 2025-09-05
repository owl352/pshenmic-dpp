use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::prelude::IdentityNonce;
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedIdentityContractNonceWASM")]
pub struct VerifiedIdentityContractNonceWASM {
    root_hash: RootHash,
    contract_nonce: Option<IdentityNonce>,
}

#[wasm_bindgen]
impl VerifiedIdentityContractNonceWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentityContractNonceWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentityContractNonceWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "contractNonce")]
    pub fn contract_nonce(&self) -> Option<IdentityNonce> {
        self.contract_nonce
    }
}

#[wasm_bindgen(js_name = "verifyIdentityContractNonce")]
pub fn verify_identity_contract_nonce(
    proof: &Uint8Array,
    js_identity_id: &JsValue,
    js_contract_id: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentityContractNonceWASM, JsValue> {
    let identity_id = IdentifierWASM::try_from(js_identity_id)?;
    let contract_id = IdentifierWASM::try_from(js_contract_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, contract_nonce) = Drive::verify_identity_contract_nonce(
        &proof.to_vec(),
        identity_id.to_slice(),
        contract_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentityContractNonceWASM {
        root_hash,
        contract_nonce,
    })
}
