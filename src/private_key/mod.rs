use dpp::dashcore::hashes::hex::FromHex;
use dpp::dashcore::key::Secp256k1;
use dpp::dashcore::secp256k1::Message;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::dashcore::signer::{CompactSignature, double_sha};
use dpp::dashcore::{Network, PrivateKey, base58};
use dpp::platform_value::string_encoding::{Encoding, decode};
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;
use crate::enums::network::NetworkNAPI;
use crate::public_key::PublicKeyNAPI;

#[derive(Debug, Clone)]
#[napi(js_name = "PrivateKeyNAPI")]
pub struct PrivateKeyNAPI(PrivateKey);

#[napi]
impl PrivateKeyNAPI {
    #[napi(constructor)]
    pub fn new(
        value: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_network: &DynamicValue,
    ) -> Result<PrivateKeyNAPI, napi::Error> {
        PrivateKeyNAPI::from_js_value(value, js_network.try_into()?)
    }

    #[napi(js_name = "fromWIF")]
    pub fn from_wif(wif: String) -> Result<Self, napi::Error> {
        let pk = PrivateKey::from_wif(wif.as_str())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(PrivateKeyNAPI(pk))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array, js_network: NetworkNAPI) -> Result<Self, napi::Error> {
        let bytes_vec = bytes.to_vec();

        let fixed_bytes: [u8; 32] = bytes_vec.as_slice().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot parse private key from bytes",
            )
        })?;

        let pk = PrivateKey::from_byte_array(&fixed_bytes, js_network.into())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(PrivateKeyNAPI(pk))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex_key: String, js_network: NetworkNAPI) -> Result<Self, napi::Error> {
        let bytes = Vec::from_hex(hex_key.as_str())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        PrivateKeyNAPI::from_bytes(bytes.into(), js_network)
    }

    #[napi(js_name = "getPublicKey")]
    pub fn get_public_key(&self) -> PublicKeyNAPI {
        let secp = Secp256k1::new();

        let public_key = self.0.public_key(&secp);

        public_key.into()
    }
}

#[napi]
impl PrivateKeyNAPI {
    #[napi(js_name = "getNetwork")]
    pub fn get_network(&self) -> String {
        NetworkNAPI::from(self.0.network).into()
    }

    #[napi(js_name = "WIF")]
    pub fn get_wif(&self) -> String {
        self.0.to_wif()
    }

    #[napi(js_name = "bytes")]
    pub fn get_bytes(&self) -> Uint8Array {
        self.0.to_bytes().into()
    }

    #[napi(js_name = "hex")]
    pub fn get_hex(&self) -> String {
        self.0.to_bytes().to_hex_string(Case::Upper)
    }

    #[napi(js_name = "getPublicKeyHash")]
    pub fn get_public_key_hash(&self) -> String {
        let secp = Secp256k1::new();

        self.0.public_key(&secp).pubkey_hash().to_hex()
    }

    #[napi(js_name = "sign")]
    pub fn sign(&self, data: Uint8Array) -> Result<Uint8Array, napi::Error> {
        let data_vec = data.to_vec();

        let data_hash = double_sha(data_vec);
        self.sign_hash(data_hash.into()).into()
    }

    #[napi(js_name = "signHash")]
    pub fn sign_hash(&self, data_hash: Uint8Array) -> Result<Uint8Array, napi::Error> {
        let data_hash_vec = data_hash.to_vec();

        let secp = Secp256k1::new();
        let msg = Message::from_digest(data_hash_vec.as_slice().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::InvalidArg,
                "Cannot convert data_hash to [u8; 32]",
            )
        })?);

        let signature = secp
            .sign_ecdsa_recoverable(&msg, &self.0.inner)
            .to_compact_signature(self.0.compressed);

        Ok(signature.to_vec().into())
    }
}

impl PrivateKeyNAPI {
    pub fn network(&self) -> Network {
        self.0.network
    }

    pub fn from_js_value(
        value: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_network: NetworkNAPI,
    ) -> Result<Self, napi::Error> {
        match value {
            Either::A(value) => {
                let is_text = value.is_string();
                let is_bytes = value.is_uint_8_array();

                if is_text {
                    let text = value.as_string().unwrap();

                    if text.len() == 64 {
                        // raw hex
                        return PrivateKeyNAPI::from_hex(text, js_network);
                    } else {
                        // base58 check
                        let key_base58 = base58::decode_check(&text).map_err(|err| {
                            napi::Error::new(
                                napi::Status::InvalidArg,
                                format!("Private Key error read wif ({})", err),
                            )
                        })?;

                        if key_base58.clone().len() == 33 || key_base58.clone().len() == 34 {
                            return PrivateKeyNAPI::from_wif(text);
                        } else {
                            return Err(napi::Error::new(
                                napi::Status::InvalidArg,
                                format!(
                                    "Private key decoded wif must be 38 byte length ({})",
                                    key_base58.clone().len()
                                ),
                            ));
                        }
                    }
                } else if is_bytes {
                    let bytes = value.as_bytes().unwrap();

                    return PrivateKeyNAPI::from_bytes(bytes.clone().into(), js_network);
                } else {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Cannot parse private key",
                    ));
                }
            }
            Either::B(key) => Ok(key.clone()),
        }
    }

    pub fn bytes_from_js_value(
        value: Either<&DynamicValue, &PrivateKeyNAPI>,
    ) -> Result<Uint8Array, napi::Error> {
        match value {
            Either::A(value) => {
                let is_text = value.is_string();
                let is_bytes = value.is_uint_8_array();

                if is_text {
                    let text = value.as_string().unwrap();

                    if text.len() == 64 {
                        // raw hex
                        return Ok(decode(&text, Encoding::Hex)
                            .map_err(|err| {
                                napi::Error::new(napi::Status::InvalidArg, err.to_string())
                            })?
                            .into());
                    } else {
                        // base58 check
                        let key_base58 = base58::decode_check(&text).map_err(|err| {
                            napi::Error::new(
                                napi::Status::InvalidArg,
                                format!("Private Key error read wif ({})", err),
                            )
                        })?;

                        if key_base58.clone().len() == 33 || key_base58.clone().len() == 34 {
                            return Ok(PrivateKeyNAPI::from_wif(text)?.get_bytes());
                        } else {
                            return Err(napi::Error::new(
                                napi::Status::InvalidArg,
                                format!(
                                    "Private key decoded wif must be 38 byte length ({})",
                                    key_base58.clone().len()
                                ),
                            ));
                        }
                    }
                } else if is_bytes {
                    let bytes = value.as_bytes().unwrap().clone();

                    return Ok(bytes.into());
                } else {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Cannot create private key",
                    ));
                }
            }
            Either::B(key) => Ok(key.get_bytes()),
        }
    }
}
