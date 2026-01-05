use dpp::dashcore::Transaction;
use napi_derive::napi;

use crate::asset_lock_proof::{tx_in::TxInNAPI, tx_out::TxOutNAPI};

#[napi(js_name = "TransactionNAPI")]
pub struct TransactionNAPI(Transaction);

impl From<Transaction> for TransactionNAPI {
    fn from(tx: Transaction) -> Self {
        Self(tx)
    }
}

#[napi]
impl TransactionNAPI {
    // TODO: Implement special_transaction_payload
    #[napi(constructor)]
    pub fn new(
        version: u16,
        lock_time: u32,
        js_input: Vec<&TxInNAPI>,
        js_output: Vec<&TxOutNAPI>,
    ) -> TransactionNAPI {
        TransactionNAPI(Transaction {
            version,
            lock_time,
            input: js_input.into_iter().map(|el| el.clone().into()).collect(),
            output: js_output.into_iter().map(|el| el.clone().into()).collect(),
            special_transaction_payload: None,
        })
    }

    #[napi(getter, js_name = "version")]
    pub fn version(&self) -> u16 {
        self.0.version
    }

    #[napi(getter, js_name = "lockTime")]
    pub fn lock_time(&self) -> u32 {
        self.0.lock_time
    }

    #[napi(getter, js_name = "input")]
    pub fn input(&self) -> Vec<TxInNAPI> {
        self.0
            .input
            .iter()
            .map(|el| TxInNAPI::from(el.clone()))
            .collect()
    }

    #[napi(getter, js_name = "output")]
    pub fn output(&self) -> Vec<TxOutNAPI> {
        self.0
            .output
            .iter()
            .map(|el| TxOutNAPI::from(el.clone()))
            .collect()
    }

    #[napi(setter, js_name = "version")]
    pub fn set_version(&mut self, version: u16) {
        self.0.version = version
    }

    #[napi(setter, js_name = "lockTime")]
    pub fn set_lock_time(&mut self, lock_time: u32) {
        self.0.lock_time = lock_time
    }

    #[napi(setter, js_name = "input")]
    pub fn set_input(&mut self, js_input: Vec<&TxInNAPI>) {
        self.0.input = js_input.into_iter().map(|el| el.clone().into()).collect();
    }

    #[napi(setter, js_name = "output")]
    pub fn set_output(&mut self, js_output: Vec<&TxOutNAPI>) {
        self.0.output = js_output.into_iter().map(|el| el.clone().into()).collect();
    }

    #[napi(js_name = "isCoinBase")]
    pub fn is_coin_base(&self) -> bool {
        self.0.is_coin_base()
    }

    #[napi(js_name = "getTxType")]
    pub fn get_tx_type(&self) -> String {
        self.0.tx_type().to_string()
    }

    #[napi(js_name = "getTxId")]
    pub fn get_tx_id(&self) -> String {
        self.0.txid().to_hex()
    }
}
