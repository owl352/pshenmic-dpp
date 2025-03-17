use base64::Engine;
use base64::prelude::BASE64_STANDARD;
use dpp::util::cbor_serializer::serializable_value_to_cbor;
use pshenmic_dpp_utils::with_serde_to_platform_value;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "objectToCbor")]
pub fn object_to_cbor(object: &JsValue) -> String {
    let value_object = with_serde_to_platform_value(object).unwrap();

    let cbor = serializable_value_to_cbor(&value_object, None).unwrap();

    BASE64_STANDARD.encode(cbor)
}

#[wasm_bindgen(js_name = "cborToObject")]
pub fn cbor_to_object(cbor: String) -> JsValue {
    let base64_bytes = BASE64_STANDARD.decode(cbor).unwrap();

    let cbor: ciborium::Value = ciborium::de::from_reader(base64_bytes.as_slice()).expect("REASON");

    serde_wasm_bindgen::to_value(&cbor).unwrap()
}
