use dpp::dashcore::key::constants;
use dpp::dashcore::{PublicKey, secp256k1};
use dpp::util::hash::ripemd160_sha256;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "PublicKeyNAPI")]
pub struct PublicKeyNAPI(PublicKey);

impl From<PublicKey> for PublicKeyNAPI {
    fn from(pk: PublicKey) -> Self {
        Self(pk)
    }
}

impl From<PublicKeyNAPI> for PublicKey {
    fn from(pk: PublicKeyNAPI) -> Self {
        pk.0
    }
}

#[napi]
impl PublicKeyNAPI {
    #[napi(constructor)]
    pub fn new(
        compressed: bool,
        public_key_bytes: Uint8Array,
    ) -> Result<PublicKeyNAPI, napi::Error> {
        let inner = match compressed {
            true => {
                if public_key_bytes.len() != constants::PUBLIC_KEY_SIZE {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        format!(
                            "compressed public key size must be equal to {}",
                            constants::PUBLIC_KEY_SIZE
                        ),
                    ));
                }

                let public_key_bytes_vec = public_key_bytes.to_vec();

                secp256k1::PublicKey::from_byte_array_compressed(
                    &public_key_bytes_vec.try_into().map_err(|_| {
                        napi::Error::new(napi::Status::InvalidArg, "Invalid public key bytes")
                    })?,
                )
            }
            false => {
                if public_key_bytes.len() != constants::UNCOMPRESSED_PUBLIC_KEY_SIZE {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        format!(
                            "uncompressed public key size must be equal to {}",
                            constants::UNCOMPRESSED_PUBLIC_KEY_SIZE
                        ),
                    ));
                }

                let public_key_bytes_vec = public_key_bytes.to_vec();

                secp256k1::PublicKey::from_byte_array_uncompressed(
                    &public_key_bytes_vec.try_into().map_err(|_| {
                        napi::Error::new(napi::Status::InvalidArg, "Invalid public key bytes")
                    })?,
                )
            }
        }
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(PublicKeyNAPI(PublicKey { compressed, inner }))
    }

    #[napi(getter, js_name = "compressed")]
    pub fn compressed(&self) -> bool {
        self.0.compressed
    }

    #[napi(getter, js_name = "inner")]
    pub fn inner(&self) -> Uint8Array {
        match self.0.compressed {
            true => self.0.inner.serialize().into(),
            false => self.0.inner.serialize_uncompressed().into(),
        }
    }

    #[napi(setter, js_name = "compressed")]
    pub fn set_compressed(&mut self, compressed: bool) {
        self.0.compressed = compressed;
    }

    #[napi(setter, js_name = "inner")]
    pub fn set_inner(&mut self, inner: Uint8Array) -> Result<(), napi::Error> {
        match inner.len() == constants::PUBLIC_KEY_SIZE {
            true => {
                let inner_vec = inner.to_vec();

                self.0.compressed = true;
                self.0.inner = secp256k1::PublicKey::from_byte_array_compressed(
                    &inner_vec.try_into().map_err(|_| {
                        napi::Error::new(
                            napi::Status::GenericFailure,
                            "Cannot convert Uint8Array to byte array",
                        )
                    })?,
                )
                .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
            }
            false => {
                let inner_vec = inner.to_vec();

                if inner_vec.len() != constants::UNCOMPRESSED_PUBLIC_KEY_SIZE {
                    return Err(napi::Error::new(
                        napi::Status::GenericFailure,
                        format!(
                            "uncompressed public key size must be equal to {}",
                            constants::UNCOMPRESSED_PUBLIC_KEY_SIZE
                        ),
                    ));
                }

                self.0.compressed = false;
                self.0.inner = secp256k1::PublicKey::from_byte_array_uncompressed(
                    &inner_vec.try_into().map_err(|_| {
                        napi::Error::new(
                            napi::Status::GenericFailure,
                            "Cannot convert Uint8Array to byte array",
                        )
                    })?,
                )
                .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;
            }
        };

        Ok(())
    }

    #[napi(js_name = getPublicKeyHash)]
    pub fn get_public_key_hash(&self) -> String {
        self.0.pubkey_hash().to_hex()
    }

    #[napi(js_name = hash160)]
    pub fn get_public_key_hash_160(&self) -> Uint8Array {
        ripemd160_sha256(self.0.to_bytes().as_slice())
            .to_vec()
            .into()
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.0.to_bytes().into()
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<PublicKeyNAPI, napi::Error> {
        let bytes_vec = bytes.to_vec();

        Ok(PublicKeyNAPI(
            PublicKey::from_slice(bytes_vec.as_slice())
                .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?,
        ))
    }
}
