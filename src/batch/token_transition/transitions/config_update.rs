use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::TokenConfigUpdateTransition;
use dpp::state_transition::batch_transition::token_config_update_transition::TokenConfigUpdateTransitionV0;
use dpp::state_transition::batch_transition::token_config_update_transition::v0::v0_methods::TokenConfigUpdateTransitionV0Methods;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::token_configuration_change_item::TokenConfigurationChangeItemNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenConfigUpdateTransitionNAPI")]
pub struct TokenConfigUpdateTransitionNAPI(TokenConfigUpdateTransition);

impl From<TokenConfigUpdateTransitionNAPI> for TokenConfigUpdateTransition {
    fn from(transition: TokenConfigUpdateTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<TokenConfigUpdateTransition> for TokenConfigUpdateTransitionNAPI {
    fn from(transition: TokenConfigUpdateTransition) -> Self {
        TokenConfigUpdateTransitionNAPI(transition)
    }
}

#[napi]
impl TokenConfigUpdateTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        update_token_configuration_item: &TokenConfigurationChangeItemNAPI,
        public_note: Option<String>,
    ) -> TokenConfigUpdateTransitionNAPI {
        TokenConfigUpdateTransitionNAPI(TokenConfigUpdateTransition::V0(
            TokenConfigUpdateTransitionV0 {
                base: base.clone().into(),
                update_token_configuration_item: update_token_configuration_item.clone().into(),
                public_note,
            },
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        self.clone().0.public_note_owned()
    }

    #[napi(getter, js_name = "updateTokenConfigurationItem")]
    pub fn get_update_token_configuration_item(&self) -> TokenConfigurationChangeItemNAPI {
        self.0.update_token_configuration_item().clone().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "updateTokenConfigurationItem")]
    pub fn set_update_token_configuration_item(&mut self, item: &TokenConfigurationChangeItemNAPI) {
        self.0
            .set_update_token_configuration_item(item.clone().into())
    }
}
