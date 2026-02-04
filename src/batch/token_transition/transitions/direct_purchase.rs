use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::token_direct_purchase_transition::TokenDirectPurchaseTransitionV0;
use dpp::state_transition::batch_transition::token_direct_purchase_transition::v0::v0_methods::TokenDirectPurchaseTransitionV0Methods;
use dpp::state_transition::batch_transition::TokenDirectPurchaseTransition;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{TryToU64, Uint64String};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenDirectPurchaseTransitionNAPI")]
pub struct TokenDirectPurchaseTransitionNAPI(TokenDirectPurchaseTransition);

impl From<TokenDirectPurchaseTransitionNAPI> for TokenDirectPurchaseTransition {
    fn from(transition: TokenDirectPurchaseTransitionNAPI) -> Self {
        transition.0
    }
}

impl From<TokenDirectPurchaseTransition> for TokenDirectPurchaseTransitionNAPI {
    fn from(transition: TokenDirectPurchaseTransition) -> Self {
        TokenDirectPurchaseTransitionNAPI(transition)
    }
}

#[napi]
impl TokenDirectPurchaseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        token_count: Uint64String,
        total_agreed_price: Uint64String,
    ) -> Result<Self, napi::Error> {
        Ok(TokenDirectPurchaseTransitionNAPI(
            TokenDirectPurchaseTransition::V0(TokenDirectPurchaseTransitionV0 {
                base: base.clone().into(),
                token_count: token_count.try_to_u64()?,
                total_agreed_price: total_agreed_price.try_to_u64()?,
            }),
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "tokenCount")]
    pub fn get_token_count(&self) -> Uint64String {
        Uint64String::from_u64(self.0.token_count())
    }

    #[napi(getter, js_name = "totalAgreedPrice")]
    pub fn get_total_agreed_price(&self) -> Uint64String {
        Uint64String::from_u64(self.0.total_agreed_price())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "tokenCount")]
    pub fn set_token_count(&mut self, token_count: Uint64String) -> Result<(), napi::Error> {
        self.0.set_token_count(token_count.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "totalAgreedPrice")]
    pub fn set_total_agreed_price(
        &mut self,
        total_agreed_price: Uint64String,
    ) -> Result<(), napi::Error> {
        self.0
            .set_total_agreed_price(total_agreed_price.try_to_u64()?);
        Ok(())
    }
}
