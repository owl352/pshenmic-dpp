use dpp::bls_signatures;
use dpp::bls_signatures::{Bls12381G2Impl, Pairing, Signature};
use dpp::dashcore::secp256k1::hashes::hex::Case::Lower;
use dpp::dashcore::secp256k1::hashes::hex::DisplayHex;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "verifySignatureDigest")]
pub fn wasm_verify_signature_digest(
    sign_digest: Uint8Array,
    signature: Uint8Array,
    pubkey_bytes: Uint8Array,
) -> Result<bool, napi::Error> {
    let pubkey =
        bls_signatures::PublicKey::<Bls12381G2Impl>::try_from(pubkey_bytes.to_vec().as_slice())
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
                signature.to_hex_string(Lower),
                pubkey_bytes.to_hex_string(Lower),
                sign_digest.to_hex_string(Lower)
            ),
        )),
    }
}

pub fn verify_signature_digest(
    sign_digest: &[u8],
    signature: &[u8; 96],
    public_key: &bls_signatures::PublicKey<Bls12381G2Impl>,
) -> Result<bool, napi::Error> {
    if signature == &[0; 96] {
        return Err(napi::Error::new(
            napi::Status::InvalidArg,
            "empty signature",
        ));
    }
    let signature = Signature::Basic(
        <Bls12381G2Impl as Pairing>::Signature::from_compressed(signature)
            .into_option()
            .ok_or(napi::Error::new(
                napi::Status::GenericFailure,
                "Could not verify signature digest",
            ))?,
    );

    Ok(signature.verify(public_key, sign_digest).is_ok())
}
