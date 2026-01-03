use dpp::dashcore::{OutPoint, Txid};
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "OutPointNAPI")]
#[derive(Clone)]
pub struct OutPointNAPI(OutPoint);

impl From<OutPoint> for OutPointNAPI {
    fn from(outpoint: OutPoint) -> Self {
        OutPointNAPI(outpoint)
    }
}

impl From<OutPointNAPI> for OutPoint {
    fn from(outpoint: OutPointNAPI) -> Self {
        outpoint.0
    }
}

#[napi]
impl OutPointNAPI {
    #[napi(constructor)]
    pub fn new(txid_hex: String, vout: u32) -> Result<OutPointNAPI, napi::Error> {
        let out_point = Txid::from_hex(&txid_hex)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Ok(OutPointNAPI(OutPoint {
            txid: out_point,
            vout,
        }))
    }

    #[napi(js_name = "getVOUT")]
    pub fn get_vout(&self) -> u32 {
        self.0.vout
    }

    #[napi(js_name = "getTXID")]
    pub fn get_tx_id(&self) -> String {
        self.0.txid.to_hex()
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        let slice: [u8; 36] = self.0.into();
        slice.to_vec().into()
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> String {
        let slice: [u8; 36] = self.0.into();

        encode(slice.as_slice(), Hex)
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> String {
        let slice: [u8; 36] = self.0.into();

        encode(slice.as_slice(), Base64)
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_buffer: Uint8Array) -> OutPointNAPI {
        let bytes_vec = js_buffer.to_vec();
        let mut buffer = [0u8; 36];
        let bytes = bytes_vec.as_slice();
        let len = bytes.len();
        buffer[..len].copy_from_slice(bytes);

        OutPointNAPI(OutPoint::from(buffer))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<OutPointNAPI, napi::Error> {
        Ok(OutPointNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        ))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<OutPointNAPI, napi::Error> {
        Ok(OutPointNAPI::from_bytes(
            decode(base64.as_str(), Base64)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        ))
    }
}
