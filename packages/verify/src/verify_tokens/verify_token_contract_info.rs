use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::data_contract::TokenContractPosition;
use dpp::tokens::contract_info::TokenContractInfo;
use dpp::tokens::contract_info::v0::TokenContractInfoV0Accessors;
use drive::drive::Drive;
use drive::verify::RootHash;
use js_sys::Uint8Array;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "TokenContractInfoWASM")]
pub struct TokenContractInfoWASM(TokenContractInfo);

impl From<TokenContractInfo> for TokenContractInfoWASM {
    fn from(contract_info: TokenContractInfo) -> Self {
        Self(contract_info)
    }
}

#[wasm_bindgen]
impl TokenContractInfoWASM {
    #[wasm_bindgen(js_name = "contractId")]
    pub fn contract_id(&self) -> IdentifierWASM {
        self.0.contract_id().into()
    }

    #[wasm_bindgen(js_name = "tokenContractPosition")]
    pub fn token_contract_position(&self) -> TokenContractPosition {
        self.0.token_contract_position()
    }
}

#[wasm_bindgen(js_name = "VerifiedTokenContractInfoWSAM")]
pub struct VerifiedTokenContractInfoWASM {
    root_hash: RootHash,
    contract_info: Option<TokenContractInfoWASM>,
}

#[wasm_bindgen]
impl VerifiedTokenContractInfoWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedTokenContractInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedTokenContractInfoWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "contractInfo")]
    pub fn get_contract_info(&self) -> Option<TokenContractInfoWASM> {
        self.contract_info.clone()
    }
}

#[wasm_bindgen(js_name = "verifyTokenContractInfo")]
pub fn verify_token_contract_info(
    proof: &Uint8Array,
    js_token_id: &JsValue,
    verify_subset_of_proof: bool,
    js_platform_version: &JsValue,
) -> Result<VerifiedTokenContractInfoWASM, JsValue> {
    let token_id = IdentifierWASM::try_from(js_token_id)?;
    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let (root_hash, contract_info_option) = Drive::verify_token_contract_info(
        &proof.to_vec(),
        token_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedTokenContractInfoWASM {
        root_hash,
        contract_info: contract_info_option.map(Into::into),
    })
}
