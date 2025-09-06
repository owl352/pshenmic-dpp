use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_identity::IdentityWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedIdentityByIdentifierWASM")]
pub struct VerifiedIdentityByIdentifierWASM {
    root_hash: RootHash,
    identity: Option<IdentityWASM>,
}

#[wasm_bindgen]
impl VerifiedIdentityByIdentifierWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentityByIdentifierWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentityByIdentifierWASM".to_string()
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

#[wasm_bindgen(js_name = "verifyIdentityByIdentifierProof")]
pub fn verify_identity_by_identifier(
    proof: &Uint8Array,
    js_identity_id: &JsValue,
    is_proof_subset: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentityByIdentifierWASM, JsValue> {
    let identity_id = IdentifierWASM::try_from(js_identity_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, identity) = Drive::verify_full_identity_by_identity_id(
        &proof.to_vec(),
        is_proof_subset,
        identity_id.to_slice(),
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentityByIdentifierWASM {
        root_hash,
        identity: identity.map(IdentityWASM::from),
    })
}
