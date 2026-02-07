use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::token_emergency_action_transition::TokenEmergencyActionTransitionV0;
use dpp::state_transition::batch_transition::token_emergency_action_transition::v0::v0_methods::TokenEmergencyActionTransitionV0Methods;
use dpp::state_transition::batch_transition::TokenEmergencyActionTransition;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::DynamicValue;
use crate::enums::emergency_action::TokenEmergencyActionNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenEmergencyActionTransitionNAPI")]
pub struct TokenEmergencyActionTransitionNAPI(TokenEmergencyActionTransition);

impl From<TokenEmergencyActionTransitionNAPI> for TokenEmergencyActionTransition {
    fn from(transition: TokenEmergencyActionTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<TokenEmergencyActionTransition> for TokenEmergencyActionTransitionNAPI {
    fn from(transition: TokenEmergencyActionTransition) -> Self {
        TokenEmergencyActionTransitionNAPI(transition)
    }
}

#[napi]
impl TokenEmergencyActionTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        emergency_action: &DynamicValue,
        public_note: Option<String>,
    ) -> Result<TokenEmergencyActionTransitionNAPI, napi::Error> {
        Ok(TokenEmergencyActionTransitionNAPI(
            TokenEmergencyActionTransition::V0(TokenEmergencyActionTransitionV0 {
                base: base.clone().into(),
                emergency_action: TokenEmergencyActionNAPI::try_from(emergency_action)?.into(),
                public_note,
            }),
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

    #[napi(getter, js_name = "emergencyAction")]
    pub fn get_emergency_action(&self) -> String {
        TokenEmergencyActionNAPI::from(self.0.emergency_action()).into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "emergencyAction")]
    pub fn set_emergency_action(&mut self, action: &DynamicValue) -> Result<(), napi::Error> {
        self.0
            .set_emergency_action(TokenEmergencyActionNAPI::try_from(action)?.into());
        Ok(())
    }
}
