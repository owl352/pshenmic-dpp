use dpp::dashcore::{ScriptBuf, TxOut};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "TxOutWASM")]
#[derive(Clone)]
pub struct TxOutWASM(TxOut);

impl From<TxOut> for TxOutWASM {
    fn from(value: TxOut) -> Self {
        TxOutWASM(value)
    }
}

impl From<TxOutWASM> for TxOut {
    fn from(value: TxOutWASM) -> Self {
        value.0
    }
}

#[wasm_bindgen]
impl TxOutWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(value: u64, script_pubkey_hex: String) -> Result<TxOutWASM, JsValue> {
        Ok(TxOutWASM(TxOut {
            value,
            script_pubkey: ScriptBuf::from_hex(&script_pubkey_hex)
                .map_err(|err| JsValue::from(err.to_string()))?,
        }))
    }

    #[wasm_bindgen(getter = "value")]
    pub fn get_value(&self) -> u64 {
        self.0.value
    }

    #[wasm_bindgen(getter = "scriptPubkeyHex")]
    pub fn get_script_pubkey_hex(&self) -> String {
        self.0.script_pubkey.to_hex_string()
    }

    #[wasm_bindgen(setter = "value")]
    pub fn set_value(&mut self, value: u64) {
        self.0.value = value;
    }

    #[wasm_bindgen(setter = "scriptPubkeyHex")]
    pub fn set_script_pubkey_hex(&mut self, script_pubkey_hex: String) -> Result<(), JsValue> {
        self.0.script_pubkey = ScriptBuf::from_hex(&script_pubkey_hex)
            .map_err(|err| JsValue::from(err.to_string()))?;
        Ok(())
    }
}
