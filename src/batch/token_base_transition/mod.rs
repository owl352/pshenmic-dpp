use dpp::group::GroupStateTransitionInfo;
use dpp::state_transition::batch_transition::token_base_transition::TokenBaseTransition;
use dpp::state_transition::batch_transition::token_base_transition::v0::TokenBaseTransitionV0;
use dpp::state_transition::batch_transition::token_base_transition::v0::v0_methods::TokenBaseTransitionV0Methods;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64},
    group_state_transition_info::GroupStateTransitionInfoNAPI,
    identifier::IdentifierNAPI,
};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenBaseTransitionNAPI")]
pub struct TokenBaseTransitionNAPI(TokenBaseTransition);

impl From<TokenBaseTransition> for TokenBaseTransitionNAPI {
    fn from(t: TokenBaseTransition) -> Self {
        TokenBaseTransitionNAPI(t)
    }
}

impl From<TokenBaseTransitionNAPI> for TokenBaseTransition {
    fn from(t: TokenBaseTransitionNAPI) -> Self {
        t.0
    }
}

#[napi]
impl TokenBaseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        identity_contract_nonce: BigIntString,
        token_contract_position: u16,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_id: IdentifierLikeNAPI,
        js_using_group_info: Option<&GroupStateTransitionInfoNAPI>,
    ) -> Result<TokenBaseTransitionNAPI, napi::Error> {
        let using_group_info: Option<GroupStateTransitionInfo> =
            js_using_group_info.map(|info| info.clone().into());

        Ok(TokenBaseTransitionNAPI(TokenBaseTransition::V0(
            TokenBaseTransitionV0 {
                identity_contract_nonce: identity_contract_nonce.try_to_u64()?,
                token_contract_position,
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                token_id: IdentifierNAPI::try_from(js_token_id)?.into(),
                using_group_info,
            },
        )))
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_contract_nonce())
    }

    #[napi(getter, js_name = "tokenContractPosition")]
    pub fn get_token_contract_position(&self) -> u16 {
        self.0.token_contract_position()
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        self.0.data_contract_id().into()
    }

    #[napi(getter, js_name = "tokenId")]
    pub fn get_token_id(&self) -> IdentifierNAPI {
        self.0.token_id().into()
    }

    #[napi(getter, js_name = "usingGroupInfo")]
    pub fn get_using_group_info(&self) -> Option<GroupStateTransitionInfoNAPI> {
        self.0.using_group_info().map(|info| info.clone().into())
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(
        &mut self,
        identity_contract_nonce: BigIntString,
    ) -> Result<(), napi::Error> {
        self.0
            .set_identity_contract_nonce(identity_contract_nonce.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "tokenContractPosition")]
    pub fn set_token_contract_position(&mut self, pos: u16) {
        self.0.set_token_contract_position(pos)
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_identifier: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_data_contract_id(IdentifierNAPI::try_from(js_identifier)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "tokenId")]
    pub fn set_token_id(&mut self, js_identifier: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0
            .set_token_id(IdentifierNAPI::try_from(js_identifier)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "usingGroupInfo")]
    pub fn set_using_group_info(
        &mut self,
        js_using_group_info: Option<&GroupStateTransitionInfoNAPI>,
    ) -> Result<(), napi::Error> {
        self.0
            .set_using_group_info(js_using_group_info.map(|info| info.clone().into()));
        Ok(())
    }
}
