use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::TokenBurnTransition;
use dpp::state_transition::batch_transition::token_burn_transition::TokenBurnTransitionV0;
use dpp::state_transition::batch_transition::token_burn_transition::v0::v0_methods::TokenBurnTransitionV0Methods;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{TryToU64, Uint64String};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenBurnTransitionNAPI")]
pub struct TokenBurnTransitionNAPI(TokenBurnTransition);

impl From<TokenBurnTransition> for TokenBurnTransitionNAPI {
    fn from(transition: TokenBurnTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenBurnTransitionNAPI> for TokenBurnTransition {
    fn from(transition: TokenBurnTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenBurnTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        burn_amount: Uint64String,
        public_note: Option<String>,
    ) -> Result<TokenBurnTransitionNAPI, napi::Error> {
        Ok(TokenBurnTransitionNAPI(TokenBurnTransition::V0(
            TokenBurnTransitionV0 {
                base: base.clone().into(),
                burn_amount: burn_amount.try_to_u64()?,
                public_note,
            },
        )))
    }

    #[napi(getter, js_name = "burnAmount")]
    pub fn get_burn_amount(&self) -> Uint64String {
        Uint64String::from_u64(self.0.burn_amount())
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        self.clone().0.public_note_owned()
    }

    #[napi(setter, js_name = "burnAmount")]
    pub fn set_burn_amount(&mut self, amount: Uint64String) -> Result<(), napi::Error> {
        self.0.set_burn_amount(amount.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }
}
