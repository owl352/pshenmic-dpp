use dpp::dashcore::{OutPoint, Txid};
use pshenmic_dpp_utils::IntoWasm;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "OutPointWASM")]
#[derive(Clone)]
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

impl TryFrom<JsValue> for OutPointWASM {
    type Error = JsValue;
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        let value = value.to_wasm::<OutPointWASM>("OutPointWASM")?;

        Ok(value.clone())
    }
}

#[wasm_bindgen]
impl OutPointWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(txid_hex: String, vout: u32) -> Result<OutPointWASM, JsValue> {
        let out_point = Txid::from_hex(&txid_hex).map_err(|err| JsValue::from(err.to_string()))?;

        Ok(OutPointWASM(OutPoint {
            txid: out_point,
            vout,
        }))
    }

    #[wasm_bindgen(js_name = "getVOUT")]
    pub fn get_vout(&self) -> u32 {
        self.0.vout
    }

    #[wasm_bindgen(js_name = "getTXID")]
    pub fn get_tx_id(&self) -> String {
        self.0.txid.to_hex()
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Vec<u8> {
        let slice: [u8; 36] = self.0.into();
        slice.to_vec()
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_buffer(js_buffer: Vec<u8>) -> OutPointWASM {
        let mut buffer = [0u8; 36];
        let bytes = js_buffer.as_slice();
        let len = bytes.len();
        buffer[..len].copy_from_slice(bytes);

        OutPointWASM(OutPoint::from(buffer))
    }
}

impl OutPointWASM {
    pub fn vec_from_js_value(js_outpoints: &js_sys::Array) -> Result<Vec<OutPointWASM>, JsValue> {
        let outpoints: Vec<OutPointWASM> = js_outpoints
            .iter()
            .map(|key| OutPointWASM::try_from(key))
            .collect::<Result<Vec<OutPointWASM>, JsValue>>()?;

        Ok(outpoints)
    }
}
