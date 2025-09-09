use crate::tx_in::TxInWASM;
use crate::tx_out::TxOutWASM;
use dpp::dashcore::{Transaction, TxIn, TxOut};
use js_sys::Array;
use pshenmic_dpp_utils::IntoWasm;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "TransactionWASM")]
pub struct TransactionWASM(Transaction);

impl From<Transaction> for TransactionWASM {
    fn from(tx: Transaction) -> Self {
        Self(tx)
    }
}

#[wasm_bindgen]
impl TransactionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TransactionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "TransactionWASM".to_string()
    }

    // TODO: Implement special_transaction_payload
    #[wasm_bindgen(constructor)]
    pub fn new(
        version: u16,
        lock_time: u32,
        js_input: &JsValue,
        js_output: &JsValue,
    ) -> Result<TransactionWASM, JsValue> {
        let input: Vec<TxIn> = js_value_to_tx_input(js_input)?;

        let output: Vec<TxOut> = js_value_to_tx_output(js_output)?;

        Ok(TransactionWASM(Transaction {
            version,
            lock_time,
            input,
            output,
            special_transaction_payload: None,
        }))
    }

    #[wasm_bindgen(getter = "version")]
    pub fn version(&self) -> u16 {
        self.0.version
    }

    #[wasm_bindgen(getter = "lockTime")]
    pub fn lock_time(&self) -> u32 {
        self.0.lock_time
    }

    #[wasm_bindgen(getter = "input")]
    pub fn input(&self) -> Array {
        self.0
            .input
            .iter()
            .map(|el| JsValue::from(TxInWASM::from(el.clone())))
            .collect()
    }

    #[wasm_bindgen(getter = "output")]
    pub fn output(&self) -> Array {
        self.0
            .output
            .iter()
            .map(|el| JsValue::from(TxOutWASM::from(el.clone())))
            .collect()
    }

    #[wasm_bindgen(setter = "version")]
    pub fn set_version(&mut self, version: u16) {
        self.0.version = version
    }

    #[wasm_bindgen(setter = "lockTime")]
    pub fn set_lock_time(&mut self, lock_time: u32) {
        self.0.lock_time = lock_time
    }

    #[wasm_bindgen(setter = "input")]
    pub fn set_input(&mut self, js_input: &JsValue) -> Result<(), JsValue> {
        self.0.input = js_value_to_tx_input(js_input)?;

        Ok(())
    }

    #[wasm_bindgen(setter = "output")]
    pub fn set_output(&mut self, js_output: &JsValue) -> Result<(), JsValue> {
        self.0.output = js_value_to_tx_output(js_output)?;

        Ok(())
    }

    #[wasm_bindgen(js_name = "isCoinBase")]
    pub fn is_coin_base(&self) -> bool {
        self.0.is_coin_base()
    }

    #[wasm_bindgen(js_name = "getTxType")]
    pub fn get_tx_type(&self) -> String {
        self.0.tx_type().to_string()
    }

    #[wasm_bindgen(js_name = "getTxId")]
    pub fn get_tx_id(&self) -> String {
        self.0.txid().to_hex()
    }
}

pub fn js_value_to_tx_input(js_input: &JsValue) -> Result<Vec<TxIn>, JsValue> {
    match js_input.is_undefined() | js_input.is_null() {
        true => Ok::<Vec<TxIn>, JsValue>(Vec::new()),
        false => match js_input.is_array() {
            false => Err(JsValue::from("inputs must be array of TxInWASM"))?,
            true => {
                let in_arr = Array::from(js_input);

                let input: Vec<TxIn> = in_arr
                    .iter()
                    .map(|el| {
                        Ok::<TxIn, JsValue>(el.to_wasm::<TxInWASM>("TxInWASM")?.clone().into())
                    })
                    .collect::<Result<Vec<TxIn>, JsValue>>()?;

                Ok(input)
            }
        },
    }
}

pub fn js_value_to_tx_output(js_output: &JsValue) -> Result<Vec<TxOut>, JsValue> {
    match js_output.is_undefined() | js_output.is_null() {
        true => Ok::<Vec<TxOut>, JsValue>(Vec::new()),
        false => match js_output.is_array() {
            false => Err(JsValue::from("inputs must be array of TxOutWASM"))?,
            true => {
                let out_arr = Array::from(js_output);

                let output: Vec<TxOut> = out_arr
                    .iter()
                    .map(|el| {
                        Ok::<TxOut, JsValue>(el.to_wasm::<TxOutWASM>("TxOutWASM")?.clone().into())
                    })
                    .collect::<Result<Vec<TxOut>, JsValue>>()?;

                Ok(output)
            }
        },
    }
}
