use dpp::identity::KeyType;
use wasm_bindgen::prelude::wasm_bindgen;

#[allow(non_camel_case_types)]
#[wasm_bindgen(js_name = "KeyType")]
pub enum KeyTypeWASM {
  ECDSA_SECP256K1 = 0,
  BLS12_381 = 1,
  ECDSA_HASH160 = 2,
  BIP13_SCRIPT_HASH = 3,
  EDDSA_25519_HASH160 = 4,
}

impl From<KeyTypeWASM> for KeyType {
  fn from(key_type: KeyTypeWASM) -> Self {
    match key_type {
      KeyTypeWASM::ECDSA_SECP256K1 => KeyType::ECDSA_SECP256K1,
      KeyTypeWASM::BLS12_381 => KeyType::BLS12_381,
      KeyTypeWASM::ECDSA_HASH160 => KeyType::ECDSA_HASH160,
      KeyTypeWASM::BIP13_SCRIPT_HASH => KeyType::BIP13_SCRIPT_HASH,
      KeyTypeWASM::EDDSA_25519_HASH160 => KeyType::EDDSA_25519_HASH160,
    }
  }
}

impl From<KeyType> for KeyTypeWASM {
  fn from(key_type: KeyType) -> Self {
    match key_type {
      KeyType::ECDSA_SECP256K1 => KeyTypeWASM::ECDSA_SECP256K1,
      KeyType::BLS12_381 => KeyTypeWASM::BLS12_381,
      KeyType::ECDSA_HASH160 => KeyTypeWASM::ECDSA_HASH160,
      KeyType::BIP13_SCRIPT_HASH => KeyTypeWASM::BIP13_SCRIPT_HASH,
      KeyType::EDDSA_25519_HASH160 => KeyTypeWASM::EDDSA_25519_HASH160,
    }
  }
}