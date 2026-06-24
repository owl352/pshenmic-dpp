use std::collections::BTreeMap;

use async_trait::async_trait;
use dpp::{
    ProtocolError,
    address_funds::{AddressWitness, PlatformAddress},
    dashcore::signer,
    identity::{
        IdentityPublicKey, KeyType, identity_public_key::accessors::v0::IdentityPublicKeyGettersV0,
        signer::Signer,
    },
    platform_value::BinaryData,
};

use crate::private_key::PrivateKeyNAPI;

/// A minimal [`Signer<PlatformAddress>`] backed by raw P2PKH private keys,
/// keyed by the 20-byte public-key hash. Built from the `PrivateKeyNAPI`s the
/// caller supplies for the transparent inputs being spent by a `Shield`.
#[derive(Debug, Default)]
pub struct AddressKeySigner {
    keys: BTreeMap<[u8; 20], [u8; 32]>,
}

impl AddressKeySigner {
    /// Builds a signer from the given private keys. Each key is registered under
    /// the hash160 of its public key (the P2PKH address hash).
    pub fn from_private_keys(private_keys: &[&PrivateKeyNAPI]) -> Result<Self, napi::Error> {
        let mut keys = BTreeMap::new();

        for pk in private_keys {
            let hash_hex = pk.get_public_key_hash();
            let hash_vec = hex::decode(&hash_hex).map_err(|e| {
                napi::Error::new(
                    napi::Status::GenericFailure,
                    format!("invalid public key hash: {e}"),
                )
            })?;
            let hash: [u8; 20] = hash_vec.as_slice().try_into().map_err(|_| {
                napi::Error::new(
                    napi::Status::GenericFailure,
                    "public key hash must be 20 bytes",
                )
            })?;

            let secret: [u8; 32] = pk.get_bytes().to_vec().as_slice().try_into().map_err(|_| {
                napi::Error::new(napi::Status::InvalidArg, "private key must be 32 bytes")
            })?;

            keys.insert(hash, secret);
        }

        Ok(AddressKeySigner { keys })
    }

    fn key_for(&self, address: &PlatformAddress) -> Result<&[u8; 32], ProtocolError> {
        match address {
            PlatformAddress::P2pkh(hash) => self.keys.get(hash).ok_or_else(|| {
                ProtocolError::Generic(format!("no private key for address {address:?}"))
            }),
            PlatformAddress::P2sh(_) => Err(ProtocolError::Generic(
                "P2SH addresses not supported".to_string(),
            )),
        }
    }
}

#[async_trait]
impl Signer<PlatformAddress> for AddressKeySigner {
    async fn sign(
        &self,
        address: &PlatformAddress,
        data: &[u8],
    ) -> Result<BinaryData, ProtocolError> {
        let private_key = self.key_for(address)?;
        let signature = signer::sign(data, private_key)?;
        Ok(signature.to_vec().into())
    }

    async fn sign_create_witness(
        &self,
        address: &PlatformAddress,
        data: &[u8],
    ) -> Result<AddressWitness, ProtocolError> {
        let signature = self.sign(address, data).await?;
        match address {
            PlatformAddress::P2pkh(_) => Ok(AddressWitness::P2pkh { signature }),
            PlatformAddress::P2sh(_) => Err(ProtocolError::Generic(
                "P2SH addresses not supported".to_string(),
            )),
        }
    }

    fn can_sign_with(&self, address: &PlatformAddress) -> bool {
        match address {
            PlatformAddress::P2pkh(hash) => self.keys.contains_key(hash),
            PlatformAddress::P2sh(_) => false,
        }
    }
}
/// A minimal [`Signer<IdentityPublicKey>`] backed by raw private keys, paired
/// with their identity public keys. Used by `identityCreateFromShieldedPool` to
/// produce each key's proof-of-possession signature. ECDSA keys only.
#[derive(Debug, Default)]
pub struct IdentityKeySigner {
    keys: Vec<(IdentityPublicKey, [u8; 32])>,
}

impl IdentityKeySigner {
    pub fn add(&mut self, public_key: IdentityPublicKey, private_key: [u8; 32]) {
        self.keys.push((public_key, private_key));
    }

    fn secret_for(&self, key: &IdentityPublicKey) -> Option<&[u8; 32]> {
        self.keys.iter().find(|(k, _)| k == key).map(|(_, s)| s)
    }
}

#[async_trait]
impl Signer<IdentityPublicKey> for IdentityKeySigner {
    async fn sign(
        &self,
        key: &IdentityPublicKey,
        data: &[u8],
    ) -> Result<BinaryData, ProtocolError> {
        let secret = self.secret_for(key).ok_or_else(|| {
            ProtocolError::Generic("no private key for identity public key".to_string())
        })?;

        match key.key_type() {
            KeyType::ECDSA_SECP256K1 | KeyType::ECDSA_HASH160 => {
                let signature = signer::sign(data, secret)?;
                Ok(signature.to_vec().into())
            }
            other => Err(ProtocolError::Generic(format!(
                "unsupported key type for signing: {other:?} (only ECDSA is supported)"
            ))),
        }
    }

    async fn sign_create_witness(
        &self,
        key: &IdentityPublicKey,
        data: &[u8],
    ) -> Result<AddressWitness, ProtocolError> {
        let signature = self.sign(key, data).await?;
        Ok(AddressWitness::P2pkh { signature })
    }

    fn can_sign_with(&self, key: &IdentityPublicKey) -> bool {
        self.secret_for(key).is_some()
    }
}
