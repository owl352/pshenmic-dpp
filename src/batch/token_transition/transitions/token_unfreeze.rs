use dpp::identifier::Identifier;
use dpp::state_transition::batch_transition::token_unfreeze_transition::TokenUnfreezeTransitionV0;
use dpp::state_transition::batch_transition::TokenUnfreezeTransition;
use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::token_unfreeze_transition::v0::v0_methods::TokenUnfreezeTransitionV0Methods;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenUnFreezeTransitionNAPI")]
pub struct TokenUnFreezeTransitionNAPI(TokenUnfreezeTransition);

impl From<TokenUnfreezeTransition> for TokenUnFreezeTransitionNAPI {
    fn from(transition: TokenUnfreezeTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenUnFreezeTransitionNAPI> for TokenUnfreezeTransition {
    fn from(transition: TokenUnFreezeTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenUnFreezeTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_frozen_identity_id: IdentifierLikeNAPI,
        public_note: Option<String>,
    ) -> Result<TokenUnFreezeTransitionNAPI, napi::Error> {
        let frozen_identity_id: Identifier =
            IdentifierNAPI::try_from(js_frozen_identity_id)?.into();

        Ok(TokenUnFreezeTransitionNAPI(TokenUnfreezeTransition::V0(
            TokenUnfreezeTransitionV0 {
                base: base.clone().into(),
                frozen_identity_id,
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
