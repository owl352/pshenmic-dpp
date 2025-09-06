use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedContractWASM")]
pub struct VerifiedContractWASM {
    root_hash: RootHash,
    data_contract: Option<DataContractWASM>,
}

#[wasm_bindgen]
impl VerifiedContractWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedContractWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedContractWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "dataContract")]
    pub fn data_contract(&self) -> Option<DataContractWASM> {
        self.data_contract.clone()
    }
}

#[wasm_bindgen(js_name = "verifyContractProof")]
pub fn verify_contract(
    proof: &Uint8Array,
    contract_known_keeps_history: Option<bool>,
    is_proof_subset: bool,
    in_multiple_contract_proof_form: bool,
    js_contract_id: &JsValue,
    js_platform_version: &JsValue,
) -> Result<VerifiedContractWASM, JsValue> {
    let contract_id = IdentifierWASM::try_from(js_contract_id.clone())?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, contract_option) = Drive::verify_contract(
        &proof.to_vec(),
        contract_known_keeps_history,
        is_proof_subset,
        in_multiple_contract_proof_form,
        contract_id.to_slice(),
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedContractWASM {
        root_hash,
        data_contract: contract_option.map(DataContractWASM::from),
    })
}
