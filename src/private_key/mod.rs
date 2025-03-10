use dpp::dashcore::{PrivateKey};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "PrivateKeyWASM")]
pub struct PrivateKeyWASM{
  private_key: PrivateKey
}

#[wasm_bindgen]
impl PrivateKeyWASM {
  #[wasm_bindgen(js_name = "new")]
  pub fn new(wif: &str) -> Self {
    let pk = PrivateKey::from_wif(wif)
      .expect("Unable to parse private key");
    
    PrivateKeyWASM{
      private_key: pk
    }
  }
}

impl PrivateKeyWASM {
  pub fn get_key(&self) -> PrivateKey {
    self.private_key
  }

  pub fn get_key_inner(&self) -> [u8; 32] {
    self.private_key.inner.secret_bytes()
  }
}

#[wasm_bindgen]
impl PrivateKeyWASM {
  #[wasm_bindgen(js_name = "getKeyWIF")]
  pub fn get_key_wif(&self) -> String {
    self.private_key.to_wif()
  }
}