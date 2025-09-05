use dpp::bls_signatures;
use dpp::bls_signatures::{Bls12381G2Impl, Pairing, Signature};
use dpp::dashcore::secp256k1::hashes::hex::Case::Lower;
use dpp::dashcore::secp256k1::hashes::hex::DisplayHex;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "verifySignatureDigest")]
pub fn wasm_verify_signature_digest(
    sign_digest: &[u8],
    signature: &[u8],
    pubkey_bytes: &[u8],
) -> Result<bool, JsValue> {
    let pubkey = bls_signatures::PublicKey::<Bls12381G2Impl>::try_from(pubkey_bytes)
        .map_err(|e| JsValue::from(e.to_string()))?;

    match verify_signature_digest(
        &sign_digest,
        &signature
            .try_into()
            .map_err(|e| JsValue::from(format!("{}", e)))?,
        &pubkey,
    )? {
        true => Ok(true),
        false => Err(JsValue::from(format!(
            "signature {} could not be verified with public key {} for sign digest {}",
            signature.to_hex_string(Lower),
            pubkey_bytes.to_hex_string(Lower),
            sign_digest.to_hex_string(Lower)
        ))),
    }
}

pub fn verify_signature_digest(
    sign_digest: &[u8],
    signature: &[u8; 96],
    public_key: &bls_signatures::PublicKey<Bls12381G2Impl>,
) -> Result<bool, JsValue> {
    if signature == &[0; 96] {
        return Err(JsValue::from("empty signature"));
    }
    let signature = Signature::Basic(
        <Bls12381G2Impl as Pairing>::Signature::from_compressed(signature)
            .into_option()
            .ok_or(JsValue::from("Could not verify signature digest"))?,
    );

    Ok(signature.verify(public_key, sign_digest).is_ok())
}
