use dpp::bls_signatures::vsss_rs::elliptic_curve::ff::BitViewSized;
use dpp::dashcore::consensus::deserialize;
use dpp::dashcore::hashes::Hash;
use dpp::dashcore::{OutPoint, Txid};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "OutPointWASM")]
pub struct OutPointWASM(OutPoint);

impl From<OutPoint> for OutPointWASM {
    fn from(outpoint: OutPoint) -> Self {
        OutPointWASM(outpoint)
    }
}

impl From<OutPointWASM> for OutPoint {
    fn from(outpoint: OutPointWASM) -> Self {
        outpoint.0
    }
}

#[wasm_bindgen]
impl OutPointWASM {
    pub fn new(raw_out_point: Vec<u8>, vout: u32) -> Result<OutPointWASM, JsValue> {
        let out_point = deserialize(raw_out_point.as_slice());

        match out_point {
            Ok(out_point) => Ok(OutPointWASM(OutPoint {
                txid: out_point,
                vout,
            })),
            Err(_) => Err(JsValue::from_str("cannot deserialize outpoint")),
        }
    }

    pub fn get_vout(self) -> u32 {
        self.0.vout
    }

    pub fn get_tx_id(self) -> Vec<u8> {
        self.0.txid.as_byte_array().to_vec()
    }
}
