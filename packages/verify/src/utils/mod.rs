use js_sys::Array;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;

pub fn js_identities_to_rs_vec(js_ids: &JsValue) -> Result<Vec<IdentifierWASM>, JsValue> {
    let js_ids_array = Array::from(js_ids);

    let mut ids_array: Vec<IdentifierWASM> = Vec::new();

    for js_id in js_ids_array.iter() {
        ids_array.push(IdentifierWASM::try_from(&js_id)?)
    }

    Ok(ids_array)
}

pub fn js_identities_to_rs_vec_of_slices(js_ids: &JsValue) -> Result<Vec<[u8; 32]>, JsValue> {
    match js_ids.is_array() {
        false => Err(JsValue::from("ids should be array")),
        true => {
            let ids = js_identities_to_rs_vec(js_ids)?;

            Ok(ids.iter().map(|id| id.to_slice()).collect())
        }
    }
}
