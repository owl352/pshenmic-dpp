use dpp::fee::Credits;
use dpp::prelude::CoreBlockHeight;
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedTotalCreditsWASM")]
pub struct VerifiedTotalCreditsWASM {
    root_hash: RootHash,
    total_credits: Credits,
}

#[wasm_bindgen]
impl VerifiedTotalCreditsWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTotalCreditsWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTotalCreditsWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> Uint8Array {
        Uint8Array::from(self.root_hash.as_slice())
    }

    #[wasm_bindgen(getter = "totalCredits")]
    pub fn total_credits(&self) -> Credits {
        self.total_credits.clone()
    }
}

#[wasm_bindgen(js_name = "verifyTotalCreditsProof")]
pub fn verify_total_credits(
    proof: &Uint8Array,
    core_subsidy_halving_interval: u32,
    activation_core_height: u32,
    current_core_height: u32,
    js_platform_version: &JsValue,
) -> Result<VerifiedTotalCreditsWASM, JsValue> {
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let request_activation_core_height =
        || -> Result<CoreBlockHeight, drive::error::Error> { Ok(activation_core_height) };

    let (root_hash, total_credits) = Drive::verify_total_credits_in_system(
        &proof.to_vec(),
        core_subsidy_halving_interval,
        request_activation_core_height,
        current_core_height,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedTotalCreditsWASM {
        root_hash,
        total_credits,
    })
}
