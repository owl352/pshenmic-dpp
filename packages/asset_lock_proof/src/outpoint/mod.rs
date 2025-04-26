use dpp::dashcore::OutPoint;
use dpp::dashcore::consensus::deserialize;
use dpp::dashcore::hashes::Hash;
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

    #[wasm_bindgen(js_name = "getVOUT")]
    pub fn get_vout(self) -> u32 {
        self.0.vout
    }

    #[wasm_bindgen(js_name = "getTXID")]
    pub fn get_tx_id(self) -> Vec<u8> {
        self.0.txid.as_byte_array().to_vec()
    }
    
    #[wasm_bindgen(js_name = "fromBuffer")]
    pub fn from_buffer(js_buffer: Vec<u8>) -> OutPointWASM {
        let mut buffer = [0u8;36];
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
