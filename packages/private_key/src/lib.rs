use dpp::dashcore::PrivateKey;
use dpp::dashcore::hashes::hex::FromHex;
use dpp::dashcore::key::Secp256k1;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use pshenmic_dpp_enums::network::NetworkWASM;
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
    pub fn from_bytes(bytes: Vec<u8>, js_network: JsValue) -> Result<Self, JsValue> {
        let network = NetworkWASM::try_from(js_network)?;

        let pk = PrivateKey::from_slice(bytes.as_slice(), network.into())
            .map_err(|err| JsValue::from_str(&*err.to_string()))?;

        Ok(PrivateKeyWASM(pk))
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(hex_key: &str, js_network: JsValue) -> Result<Self, JsValue> {
        let network = NetworkWASM::try_from(js_network)?;

        let bytes = Vec::from_hex(hex_key).map_err(|err| JsValue::from(err.to_string()))?;

        let pk = PrivateKey::from_slice(bytes.as_slice(), network.into())
            .map_err(|err| JsValue::from_str(&*err.to_string()))?;

        Ok(PrivateKeyWASM(pk))
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
