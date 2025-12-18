use dpp::dashcore::hashes::hex::FromHex;
use dpp::dashcore::key::Secp256k1;
use dpp::dashcore::secp256k1::Message;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::dashcore::signer::{CompactSignature, double_sha};
use dpp::dashcore::{Network, PrivateKey, base58};
use js_sys::Uint8Array;
use pshenmic_dpp_enums::network::NetworkWASM;
use pshenmic_dpp_public_key::PublicKeyWASM;
use pshenmic_dpp_utils::{IntoWasm, get_class_type};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone)]
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

    #[wasm_bindgen(constructor)]
    pub fn new(value: &JsValue, js_network: &JsValue) -> Result<PrivateKeyWASM, JsValue> {
        PrivateKeyWASM::from_js_value(value, js_network)
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
    #[wasm_bindgen(js_name = "getNetwork")]
    pub fn get_network(&self) -> String {
        NetworkWASM::from(self.0.network).into()
    }

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

    #[wasm_bindgen(js_name = "sign")]
    pub fn sign(&self, data: &[u8]) -> Result<Vec<u8>, JsValue> {
        let data_hash = double_sha(data);
        self.sign_hash(data_hash)
    }

    #[wasm_bindgen(js_name = "signHash")]
    pub fn sign_hash(&self, data_hash: Vec<u8>) -> Result<Vec<u8>, JsValue> {
        let secp = Secp256k1::new();
        let msg = Message::from_digest(
            data_hash
                .as_slice()
                .try_into()
                .map_err(|_| JsValue::from("Cannot convert data_hash to [u8; 32]"))?,
        );

        let signature = secp
            .sign_ecdsa_recoverable(&msg, &self.0.inner)
            .to_compact_signature(self.0.compressed);

        Ok(signature.to_vec())
    }
}

impl PrivateKeyWASM {
    pub fn network(&self) -> Network {
        self.0.network
    }

    pub fn from_js_value(value: &JsValue, js_network: &JsValue) -> Result<Self, JsValue> {
        match value.is_string() {
            true => {
                let str = value
                    .as_string()
                    .ok_or(JsValue::from_str("Invalid string"))?;

                if str.len() == 64 {
                    // raw hex
                    if js_network.is_undefined() {
                        Err(JsValue::from_str(
                            "You must specify a network when pass private key hex as arguments",
                        ))
                    } else {
                        PrivateKeyWASM::from_hex(&str, js_network)
                    }
                } else {
                    // base58 check
                    let key_base58 = base58::decode_check(&str).map_err(|err| {
                        JsValue::from(format!("Private Key error read wif ({})", err))
                    })?;

                    if key_base58.clone().len() == 33 || key_base58.clone().len() == 34 {
                        PrivateKeyWASM::from_wif(&str)
                    } else {
                        Err(JsValue::from(format!(
                            "Private key decoded wif must be 38 byte length ({})",
                            key_base58.clone().len()
                        )))
                    }
                }
            }
            false => match value.is_object() || value.is_array() {
                true => {
                    if get_class_type(&value) == Ok("PrivateKeyWASM".to_string()) {
                        Ok(value.to_wasm::<PrivateKeyWASM>("PrivateKeyWASM")?.clone())
                    } else {
                        let uint8_array = Uint8Array::from(value.clone());
                        let bytes = uint8_array.to_vec();

                        PrivateKeyWASM::from_bytes(bytes, js_network)
                    }
                }
                false => Err(JsValue::from("Cannot parse private key"))?,
            },
        }
    }
}
