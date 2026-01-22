use dpp::identity::KeyType;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[allow(non_camel_case_types)]
#[napi(js_name = "KeyTypeNAPI")]
pub enum KeyTypeNAPI {
    ECDSA_SECP256K1 = 0,
    BLS12_381 = 1,
    ECDSA_HASH160 = 2,
    BIP13_SCRIPT_HASH = 3,
    EDDSA_25519_HASH160 = 4,
}

impl From<KeyTypeNAPI> for String {
    fn from(value: KeyTypeNAPI) -> Self {
        match value {
            KeyTypeNAPI::ECDSA_SECP256K1 => String::from("ECDSA_SECP256K1"),
            KeyTypeNAPI::BLS12_381 => String::from("BLS12_381"),
            KeyTypeNAPI::ECDSA_HASH160 => String::from("ECDSA_HASH160"),
            KeyTypeNAPI::BIP13_SCRIPT_HASH => String::from("BIP13_SCRIPT_HASH"),
            KeyTypeNAPI::EDDSA_25519_HASH160 => String::from("EDDSA_25519_HASH160"),
        }
    }
}

impl From<KeyTypeNAPI> for KeyType {
    fn from(key_type: KeyTypeNAPI) -> Self {
        match key_type {
            KeyTypeNAPI::ECDSA_SECP256K1 => KeyType::ECDSA_SECP256K1,
            KeyTypeNAPI::BLS12_381 => KeyType::BLS12_381,
            KeyTypeNAPI::ECDSA_HASH160 => KeyType::ECDSA_HASH160,
            KeyTypeNAPI::BIP13_SCRIPT_HASH => KeyType::BIP13_SCRIPT_HASH,
            KeyTypeNAPI::EDDSA_25519_HASH160 => KeyType::EDDSA_25519_HASH160,
        }
    }
}

impl From<KeyType> for KeyTypeNAPI {
    fn from(key_type: KeyType) -> Self {
        match key_type {
            KeyType::ECDSA_SECP256K1 => KeyTypeNAPI::ECDSA_SECP256K1,
            KeyType::BLS12_381 => KeyTypeNAPI::BLS12_381,
            KeyType::ECDSA_HASH160 => KeyTypeNAPI::ECDSA_HASH160,
            KeyType::BIP13_SCRIPT_HASH => KeyTypeNAPI::BIP13_SCRIPT_HASH,
            KeyType::EDDSA_25519_HASH160 => KeyTypeNAPI::EDDSA_25519_HASH160,
        }
    }
}

impl From<KeyTypeNAPI> for u8 {
    fn from(key_type: KeyTypeNAPI) -> Self {
        match key_type {
            KeyTypeNAPI::ECDSA_SECP256K1 => 0,
            KeyTypeNAPI::BLS12_381 => 1,
            KeyTypeNAPI::ECDSA_HASH160 => 2,
            KeyTypeNAPI::BIP13_SCRIPT_HASH => 3,
            KeyTypeNAPI::EDDSA_25519_HASH160 => 4,
        }
    }
}

impl TryFrom<u64> for KeyTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(KeyTypeNAPI::ECDSA_SECP256K1),
            1 => Ok(KeyTypeNAPI::BLS12_381),
            2 => Ok(KeyTypeNAPI::ECDSA_HASH160),
            3 => Ok(KeyTypeNAPI::BIP13_SCRIPT_HASH),
            4 => Ok(KeyTypeNAPI::EDDSA_25519_HASH160),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid key type value",
            )),
        }
    }
}

impl TryFrom<String> for KeyTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "ecdsa_secp256k1" => Ok(KeyTypeNAPI::ECDSA_SECP256K1),
            "bls12_381" => Ok(KeyTypeNAPI::BLS12_381),
            "ecdsa_hash160" => Ok(KeyTypeNAPI::ECDSA_HASH160),
            "bip13_script_hash" => Ok(KeyTypeNAPI::BIP13_SCRIPT_HASH),
            "eddsa_25519_hash160" => Ok(KeyTypeNAPI::EDDSA_25519_HASH160),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid key type value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for KeyTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            KeyTypeNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            KeyTypeNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid key type value",
            ))
        }
    }
}
