use dpp::identifier::Identifier;
use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::token_freeze_transition::TokenFreezeTransitionV0;
use dpp::state_transition::batch_transition::token_freeze_transition::v0::v0_methods::TokenFreezeTransitionV0Methods;
use dpp::state_transition::batch_transition::TokenFreezeTransition;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenFreezeTransitionNAPI")]
pub struct TokenFreezeTransitionNAPI(TokenFreezeTransition);

impl From<TokenFreezeTransitionNAPI> for TokenFreezeTransition {
    fn from(transition: TokenFreezeTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<TokenFreezeTransition> for TokenFreezeTransitionNAPI {
    fn from(transition: TokenFreezeTransition) -> Self {
        Self(transition)
    }
}

#[napi]
impl TokenFreezeTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_identity_to_freeze_id: IdentifierLikeNAPI,
        public_note: Option<String>,
    ) -> Result<TokenFreezeTransitionNAPI, napi::Error> {
        let identity_to_freeze_id: Identifier =
            IdentifierNAPI::try_from(js_identity_to_freeze_id)?.into();

        Ok(TokenFreezeTransitionNAPI(TokenFreezeTransition::V0(
            TokenFreezeTransitionV0 {
                base: base.clone().into(),
                identity_to_freeze_id,
                public_note,
            },
        )))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        self.clone().0.public_note_owned()
    }

    #[napi(getter, js_name = "frozenIdentityId")]
    pub fn get_frozen_identity_id(&self) -> IdentifierNAPI {
        self.0.frozen_identity_id().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "frozenIdentityId")]
    pub fn set_frozen_identity_id(
        &mut self,
        js_frozen_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_frozen_identity_id(IdentifierNAPI::try_from(js_frozen_identity_id)?.into());
        Ok(())
    }
}
