use dpp::identity::Purpose;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "Purpose")]
pub enum PurposeWASM {
    AUTHENTICATION = 0,
    ENCRYPTION = 1,
    DECRYPTION = 2,
    TRANSFER = 3,
    SYSTEM = 4,
    VOTING = 5,
    OWNER = 6,
}

impl From<PurposeWASM> for Purpose {
    fn from(purpose: PurposeWASM) -> Self {
        match purpose {
            PurposeWASM::AUTHENTICATION => Purpose::AUTHENTICATION,
            PurposeWASM::ENCRYPTION => Purpose::ENCRYPTION,
            PurposeWASM::DECRYPTION => Purpose::DECRYPTION,
            PurposeWASM::TRANSFER => Purpose::TRANSFER,
            PurposeWASM::SYSTEM => Purpose::SYSTEM,
            PurposeWASM::VOTING => Purpose::VOTING,
            PurposeWASM::OWNER => Purpose::OWNER,
        }
    }
}

impl From<Purpose> for PurposeWASM {
    fn from(purpose: Purpose) -> Self {
        match purpose {
            Purpose::AUTHENTICATION => PurposeWASM::AUTHENTICATION,
            Purpose::ENCRYPTION => PurposeWASM::ENCRYPTION,
            Purpose::DECRYPTION => PurposeWASM::DECRYPTION,
            Purpose::TRANSFER => PurposeWASM::TRANSFER,
            Purpose::SYSTEM => PurposeWASM::SYSTEM,
            Purpose::VOTING => PurposeWASM::VOTING,
            Purpose::OWNER => PurposeWASM::OWNER,
        }
    }
}
