use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::TokenClaimTransition;
use dpp::state_transition::batch_transition::token_claim_transition::TokenClaimTransitionV0;
use dpp::state_transition::batch_transition::token_claim_transition::v0::v0_methods::TokenClaimTransitionV0Methods;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::DynamicValue;
use crate::enums::distribution_type::TokenDistributionTypeNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenClaimTransitionNAPI")]
pub struct TokenClaimTransitionNAPI(TokenClaimTransition);

impl From<TokenClaimTransition> for TokenClaimTransitionNAPI {
    fn from(transition: TokenClaimTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenClaimTransitionNAPI> for TokenClaimTransition {
    fn from(transition: TokenClaimTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenClaimTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_distribution_type: &DynamicValue,
        public_note: Option<String>,
    ) -> Result<TokenClaimTransitionNAPI, napi::Error> {
        let distribution_type = TokenDistributionTypeNAPI::try_from(js_distribution_type)?;

        Ok(TokenClaimTransitionNAPI(TokenClaimTransition::V0(
            TokenClaimTransitionV0 {
                base: base.clone().into(),
                distribution_type: distribution_type.into(),
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

    #[napi(getter, js_name = "distributionType")]
    pub fn get_distribution_type(&self) -> String {
        TokenDistributionTypeNAPI::from(self.0.distribution_type()).into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "distributionType")]
    pub fn set_distribution_type(
        &mut self,
        js_distribution_type: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let distribution_type = TokenDistributionTypeNAPI::try_from(js_distribution_type)?;

        Ok(self.0.set_distribution_type(distribution_type.into()))
    }
}
