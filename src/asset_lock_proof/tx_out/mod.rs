use dpp::dashcore::{ScriptBuf, TxOut};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "TxOutNAPI")]
#[derive(Clone)]
pub struct TxOutNAPI(TxOut);

impl From<TxOut> for TxOutNAPI {
    fn from(value: TxOut) -> Self {
        TxOutNAPI(value)
    }
}

impl From<TxOutNAPI> for TxOut {
    fn from(value: TxOutNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TxOutNAPI {
    #[napi(constructor)]
    pub fn new(
        js_value: DynamicValue,
        script_pubkey: DynamicValue,
    ) -> Result<TxOutNAPI, napi::Error> {
        let value: u64 = js_value.try_into()?;

        let tx_out: TxOut = match script_pubkey {
            DynamicValue::Bytes(script_pubkey) => Ok(TxOut {
                value,
                script_pubkey: ScriptBuf::from_bytes(script_pubkey.to_vec()),
            }),
            DynamicValue::Text(script_pubkey) => Ok(TxOut {
                value,
                script_pubkey: ScriptBuf::from_hex(&script_pubkey).map_err(|err| {
                    napi::Error::new(napi::Status::GenericFailure, err.to_string())
                })?,
            }),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot parse script pub key",
            )),
        }?;

        Ok(TxOutNAPI(tx_out))
    }

    #[napi(getter, js_name = "value")]
    pub fn get_value(&self) -> DynamicValue {
        DynamicValue::Uint64(self.0.value.into())
    }

    #[napi(getter, js_name = "scriptPubKeyHex")]
    pub fn get_script_pubkey_hex(&self) -> String {
        self.0.script_pubkey.to_hex_string()
    }

    #[napi(getter, js_name = "scriptPubKeyBytes")]
    pub fn get_script_pubkey_bytes(&self) -> Uint8Array {
        self.0.script_pubkey.to_bytes().into()
    }

    #[napi(setter, js_name = "value")]
    pub fn set_value(&mut self, value: DynamicValue) -> Result<(), napi::Error> {
        self.0.value = value.try_into()?;

        Ok(())
    }

    #[napi(setter, js_name = "scriptPubKeyHex")]
    pub fn set_script_pubkey_hex(&mut self, script_pubkey_hex: String) -> Result<(), napi::Error> {
        self.0.script_pubkey = ScriptBuf::from_hex(&script_pubkey_hex)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;
        Ok(())
    }

    #[napi(setter, js_name = "scriptPubKeyBytes")]
    pub fn set_script_pubkey_bytes(&mut self, script_pubkey_bytes: Uint8Array) {
        self.0.script_pubkey = ScriptBuf::from_bytes(script_pubkey_bytes.to_vec());
    }

    #[napi(js_name = "getScriptPubKeyASM")]
    pub fn get_script_pubkey_asm(&self) -> String {
        self.0.script_pubkey.to_asm_string()
    }
}
