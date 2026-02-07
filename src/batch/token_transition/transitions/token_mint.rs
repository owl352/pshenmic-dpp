use dpp::prelude::Identifier;
use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::TokenMintTransition;
use dpp::state_transition::batch_transition::token_mint_transition::TokenMintTransitionV0;
use dpp::state_transition::batch_transition::token_mint_transition::v0::v0_methods::TokenMintTransitionV0Methods;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::token_configuration::TokenConfigurationNAPI;
use crate::utils::WithJsError;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenMintTransitionNAPI")]
pub struct TokenMintTransitionNAPI(TokenMintTransition);

impl From<TokenMintTransition> for TokenMintTransitionNAPI {
    fn from(transition: TokenMintTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenMintTransitionNAPI> for TokenMintTransition {
    fn from(transition: TokenMintTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenMintTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_issued_to_identity_id: Option<IdentifierLikeNAPI>,
        amount: BigIntString,
        public_note: Option<String>,
    ) -> Result<TokenMintTransitionNAPI, napi::Error> {
        let issued_to_identity_id: Option<Identifier> = js_issued_to_identity_id
            .map(IdentifierNAPI::try_from)
            .transpose()?
            .map(Into::into);

        Ok(TokenMintTransitionNAPI(TokenMintTransition::V0(
            TokenMintTransitionV0 {
                base: base.clone().into(),
                issued_to_identity_id,
                amount: amount.try_to_u64()?,
                public_note,
            },
        )))
    }

    #[napi(getter, js_name = issuedToIdentityId)]
    pub fn issued_to_identity_id(&self) -> Option<IdentifierNAPI> {
        match self.0.issued_to_identity_id() {
            None => None,
            Some(id) => Some(id.into()),
        }
    }

    #[napi(getter, js_name = amount)]
    pub fn get_amount(&self) -> BigIntString {
        BigIntString::from_u64(self.0.amount())
    }

    #[napi(getter, js_name = base)]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = publicNote)]
    pub fn get_public_note(&self) -> Option<String> {
        self.clone().0.public_note_owned()
    }

    #[napi(js_name = getRecipitnId)]
    pub fn recipient_id(
        &self,
        config: &TokenConfigurationNAPI,
    ) -> Result<IdentifierNAPI, napi::Error> {
        Ok(self
            .0
            .recipient_id(&config.clone().into())
            .with_js_error()?
            .into())
    }

    #[napi(setter, js_name = issuedToIdentityId)]
    pub fn set_issued_to_identity_id(
        &mut self,
        js_id: Option<IdentifierLikeNAPI>,
    ) -> Result<(), napi::Error> {
        self.0.set_issued_to_identity_id(
            js_id
                .map(IdentifierNAPI::try_from)
                .transpose()?
                .map(Into::into),
        );

        Ok(())
    }

    #[napi(setter, js_name = amount)]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        self.0.set_amount(amount.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = base)]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = publicNote)]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }
}
