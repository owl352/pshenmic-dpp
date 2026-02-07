use dpp::tokens::contract_info::TokenContractInfo;
use dpp::tokens::contract_info::v0::TokenContractInfoV0Accessors;
use drive::drive::Drive;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Clone)]
#[napi(js_name = "TokenContractInfoNAPI")]
pub struct TokenContractInfoNAPI(TokenContractInfo);

impl From<TokenContractInfo> for TokenContractInfoNAPI {
    fn from(contract_info: TokenContractInfo) -> Self {
        Self(contract_info)
    }
}

#[napi]
impl TokenContractInfoNAPI {
    #[napi(getter, js_name = "contractId")]
    pub fn contract_id(&self) -> IdentifierNAPI {
        self.0.contract_id().into()
    }

    #[napi(getter, js_name = "tokenContractPosition")]
    pub fn token_contract_position(&self) -> u16 {
        self.0.token_contract_position()
    }
}

#[napi(js_name = "VerifiedTokenContractInfoNAPI")]
pub struct VerifiedTokenContractInfoNAPI {
    pub root_hash: Uint8Array,
    contract_info: Option<TokenContractInfoNAPI>,
}

#[napi]
impl VerifiedTokenContractInfoNAPI {
    #[napi(getter, js_name = "contractInfo")]
    pub fn get_contract_info(&self) -> Option<TokenContractInfoNAPI> {
        self.contract_info.clone()
    }
}

#[napi(js_name = "verifyTokenContractInfoProof")]
pub fn verify_token_contract_info(
    proof: Uint8Array,
    js_token_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedTokenContractInfoNAPI, napi::Error> {
    let token_id = IdentifierNAPI::try_from(js_token_id)?;
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, contract_info_option) = Drive::verify_token_contract_info(
        &proof.to_vec(),
        token_id.to_slice(),
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedTokenContractInfoNAPI {
        root_hash: root_hash.into(),
        contract_info: contract_info_option.map(Into::into),
    })
}
