use dpp::state_transition::batch_transition::token_set_price_for_direct_purchase_transition::TokenSetPriceForDirectPurchaseTransitionV0;
use dpp::state_transition::batch_transition::TokenSetPriceForDirectPurchaseTransition;
use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::token_set_price_for_direct_purchase_transition::v0::v0_methods::TokenSetPriceForDirectPurchaseTransitionV0Methods;
use dpp::tokens::token_pricing_schedule::TokenPricingSchedule;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::batch::token_pricing_schedule::TokenPricingScheduleNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenSetPriceForDirectPurchaseTransitionNAPI")]
pub struct TokenSetPriceForDirectPurchaseTransitionNAPI(TokenSetPriceForDirectPurchaseTransition);

impl From<TokenSetPriceForDirectPurchaseTransition>
    for TokenSetPriceForDirectPurchaseTransitionNAPI
{
    fn from(transition: TokenSetPriceForDirectPurchaseTransition) -> Self {
        TokenSetPriceForDirectPurchaseTransitionNAPI(transition)
    }
}

impl From<TokenSetPriceForDirectPurchaseTransitionNAPI>
    for TokenSetPriceForDirectPurchaseTransition
{
    fn from(transition: TokenSetPriceForDirectPurchaseTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenSetPriceForDirectPurchaseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_price: Option<&TokenPricingScheduleNAPI>,
        public_note: Option<String>,
    ) -> TokenSetPriceForDirectPurchaseTransitionNAPI {
        let price: Option<TokenPricingSchedule> = js_price.map(|p| p.clone().into());

        TokenSetPriceForDirectPurchaseTransitionNAPI(TokenSetPriceForDirectPurchaseTransition::V0(
            TokenSetPriceForDirectPurchaseTransitionV0 {
                base: base.clone().into(),
                price,
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

    #[napi(getter, js_name = "price")]
    pub fn get_price(&self) -> Option<TokenPricingScheduleNAPI> {
        self.0.price().map(|p| p.clone().into())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "price")]
    pub fn set_price(&mut self, js_price: Option<&TokenPricingScheduleNAPI>) {
        self.0.set_price(js_price.map(|p| p.clone().into()))
    }
}
