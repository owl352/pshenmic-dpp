use dpp::bls::{PublicKey, Signature};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "verifySignatureDigest")]
pub fn wasm_verify_signature_digest(
    sign_digest: Uint8Array,
    signature: Uint8Array,
    pubkey_bytes: Uint8Array,
) -> Result<bool, napi::Error> {
    let pubkey = PublicKey::try_from(pubkey_bytes.to_vec().as_slice())
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    match verify_signature_digest(
        &sign_digest,
        &signature.to_vec().as_slice().try_into().map_err(|_| {
            napi::Error::new(napi::Status::InvalidArg, "signature size must be 96 bytes")
        })?,
        &pubkey,
    )? {
        true => Ok(true),
        false => Err(napi::Error::new(
            napi::Status::GenericFailure,
            format!(
                "signature {} could not be verified with public key {} for sign digest {}",
                hex::encode(&signature),
                hex::encode(&pubkey_bytes),
                hex::encode(&sign_digest)
            ),
        )),
    }
}

pub fn verify_signature_digest(
    sign_digest: &[u8],
    signature: &[u8; 96],
    public_key: &PublicKey,
) -> Result<bool, napi::Error> {
    if signature == &[0; 96] {
        return Err(napi::Error::new(
            napi::Status::InvalidArg,
            "empty signature",
        ));
    }
    let signature = Signature::from_compressed(signature).ok_or(napi::Error::new(
        napi::Status::GenericFailure,
        "Could not verify signature digest",
    ))?;

    Ok(signature.verify(public_key, sign_digest).is_ok())
}
