use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::drive::Drive;
use drive::drive::identity::key::fetch::{IdentityKeysRequest, KeyRequestType};
use drive::verify::RootHash;
use js_sys::{Array, Uint8Array};
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_partial_identity::PartialIdentityWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "verifiedIdentityKeysByIdentifierWASM")]
pub struct VerifiedIdentityKeysByIdentifierWASM {
    root_hash: RootHash,
    identity: Option<PartialIdentityWASM>,
}

#[wasm_bindgen]
impl VerifiedIdentityKeysByIdentifierWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedIdentityKeysByIdentifierWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedIdentityKeysByIdentifierWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "identity")]
    pub fn identity(&self) -> Option<PartialIdentityWASM> {
        self.identity.clone()
    }
}
#[wasm_bindgen(js_name = "verifyIdentityKeysByIdentifier")]
pub fn verify_identity_keys_by_identifier(
    proof: &Uint8Array,
    js_identity_id: &JsValue,
    specific_key_ids: Option<Array>,
    with_revision: bool,
    with_balance: bool,
    is_proof_subset: bool,
    limit: Option<u16>,
    offset: Option<u16>,
    js_platform_version: &JsValue,
) -> Result<VerifiedIdentityKeysByIdentifierWASM, JsValue> {
    let identity_id = IdentifierWASM::try_from(js_identity_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let request_type = if let Some(keys_array) = specific_key_ids {
        let mut keys_vec = Vec::new();
        for i in 0..keys_array.length() {
            let key_id = keys_array
                .get(i)
                .as_string()
                .ok_or_else(|| JsValue::from_str("Key ID must be a string"))?
                .parse::<u32>()
                .map_err(|_| JsValue::from_str("Invalid key ID number"))?;
            keys_vec.push(key_id);
        }
        KeyRequestType::SpecificKeys(keys_vec)
    } else {
        KeyRequestType::AllKeys
    };

    let key_request = IdentityKeysRequest {
        identity_id: identity_id.to_slice(),
        request_type,
        limit,
        offset,
    };

    let (root_hash, identity) = Drive::verify_identity_keys_by_identity_id(
        &proof.to_vec(),
        key_request,
        with_revision,
        with_balance,
        is_proof_subset,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedIdentityKeysByIdentifierWASM {
        root_hash,
        identity: identity.map(PartialIdentityWASM::from),
    })
}
