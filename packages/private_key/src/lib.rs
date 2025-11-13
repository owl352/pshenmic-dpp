use dpp::dashcore::PrivateKey;
use dpp::dashcore::hashes::hex::FromHex;
use dpp::dashcore::key::Secp256k1;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use pshenmic_dpp_enums::network::NetworkWASM;
use pshenmic_dpp_public_key::PublicKeyWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "PrivateKeyWASM")]
pub struct PrivateKeyWASM(PrivateKey);

#[wasm_bindgen]
impl PrivateKeyWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "PrivateKeyWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "PrivateKeyWASM".to_string()
    }

    #[wasm_bindgen(js_name = "fromWIF")]
    pub fn from_wif(wif: &str) -> Result<Self, JsValue> {
        let pk = PrivateKey::from_wif(wif).map_err(|err| JsValue::from_str(&*err.to_string()));

        match pk {
            Ok(pk) => Ok(PrivateKeyWASM(pk)),
            Err(err) => Err(err),
        }
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>, js_network: &JsValue) -> Result<Self, JsValue> {
        let network = NetworkWASM::try_from(js_network.clone())?;

        let fixed_bytes: [u8; 32] = bytes
            .as_slice()
            .try_into()
            .map_err(|_| JsValue::from("Cannot parse private key from hex"))?;

        let pk = PrivateKey::from_byte_array(&fixed_bytes, network.into())
            .map_err(|err| JsValue::from_str(&*err.to_string()))?;

        Ok(PrivateKeyWASM(pk))
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(hex_key: &str, js_network: &JsValue) -> Result<Self, JsValue> {
        let bytes = Vec::from_hex(hex_key).map_err(|err| JsValue::from(err.to_string()))?;

        PrivateKeyWASM::from_bytes(bytes, js_network)
    }

    #[wasm_bindgen(js_name = "getPublicKey")]
    pub fn get_public_key(&self) -> PublicKeyWASM {
        let secp = Secp256k1::new();

        let public_key = self.0.public_key(&secp);

        public_key.into()
    }
}

#[wasm_bindgen]
impl PrivateKeyWASM {
    #[wasm_bindgen(js_name = "WIF")]
    pub fn get_wif(&self) -> String {
        self.0.to_wif()
    }

    #[wasm_bindgen(js_name = "bytes")]
    pub fn get_bytes(&self) -> Vec<u8> {
        self.0.to_bytes()
    }

    #[wasm_bindgen(js_name = "hex")]
    pub fn get_hex(&self) -> String {
        self.0.to_bytes().to_hex_string(Case::Upper)
    }

    #[wasm_bindgen(js_name = "getPublicKeyHash")]
    pub fn get_public_key_hash(&self) -> String {
        let secp = Secp256k1::new();

        self.0.public_key(&secp).pubkey_hash().to_hex()
    }
}
