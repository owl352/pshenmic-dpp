use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = VerifiedIdentifierByNonUniquePublicKeyHashWASM)]
pub struct VerifiedIdentifierByNonUniquePublicKeyHashWASM {
    root_hash: RootHash,
    identifier: Option<IdentifierWASM>,
}

#[wasm_bindgen]
impl VerifiedIdentifierByNonUniquePublicKeyHashWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentifierByNonUniquePublicKeyHashWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentifierByNonUniquePublicKeyHashWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "identifier")]
    pub fn identifier(&self) -> Option<IdentifierWASM> {
        self.identifier
    }
}

#[wasm_bindgen(js_name = "verifyIdentifierByNonUniquePublicKeyHashProof")]
pub fn verify_identifier_by_non_unique_public_key_hash(
    proof: &Uint8Array,
    is_proof_subset: bool,
    js_public_key_hash: &Uint8Array,
    js_after: &JsValue,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentifierByNonUniquePublicKeyHashWASM, JsValue> {
    let public_key_hash: [u8; 20] = js_public_key_hash
        .to_vec()
        .try_into()
        .map_err(|_| JsValue::from_str("Invalid public_key_hash length. Expected 20 bytes."))?;
    let after = match js_after.is_undefined() | js_after.is_null() {
        true => None,
        false => Some(IdentifierWASM::try_from(js_after)?.to_slice()),
    };
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, identifier) = Drive::verify_identity_id_by_non_unique_public_key_hash(
        &proof.to_vec(),
        is_proof_subset,
        public_key_hash,
        after,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentifierByNonUniquePublicKeyHashWASM {
        root_hash,
        identifier: identifier.map(IdentifierWASM::from),
    })
}
