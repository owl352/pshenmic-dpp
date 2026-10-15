use dpp::state_transition::batch_transition::TokenDirectPurchaseToPoolTransition;
use dpp::state_transition::batch_transition::token_direct_purchase_to_pool_transition::TokenDirectPurchaseToPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{BigIntString, TryToU64};
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenDirectPurchaseToPoolTransitionNAPI")]
pub struct TokenDirectPurchaseToPoolTransitionNAPI(TokenDirectPurchaseToPoolTransition);

impl From<TokenDirectPurchaseToPoolTransition> for TokenDirectPurchaseToPoolTransitionNAPI {
    fn from(value: TokenDirectPurchaseToPoolTransition) -> Self {
        Self(value)
    }
}

impl From<TokenDirectPurchaseToPoolTransitionNAPI> for TokenDirectPurchaseToPoolTransition {
    fn from(value: TokenDirectPurchaseToPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenDirectPurchaseToPoolTransitionNAPI {
    /// Buys tokens at their direct purchase price into the token shielded pool
    #[napi(constructor)]
    pub fn new(
        js_base: &TokenBaseTransitionNAPI,
        js_token_count: BigIntString,
        js_total_agreed_price: BigIntString,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
    ) -> Result<TokenDirectPurchaseToPoolTransitionNAPI, napi::Error> {
        Ok(TokenDirectPurchaseToPoolTransitionNAPI(
            TokenDirectPurchaseToPoolTransition::V0(TokenDirectPurchaseToPoolTransitionV0 {
                base: js_base.clone().into(),
                token_count: js_token_count.try_to_u64()?,
                total_agreed_price: js_total_agreed_price.try_to_u64()?,
                actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
                anchor: js_bytes_to_anchor(js_anchor)?,
                proof: js_proof.to_vec(),
                binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
            }),
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        v0.base.clone().into()
    }

    #[napi(getter, js_name = "tokenCount")]
    pub fn get_token_count(&self) -> BigIntString {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.token_count)
    }

    #[napi(getter, js_name = "totalAgreedPrice")]
    pub fn get_total_agreed_price(&self) -> BigIntString {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.total_agreed_price)
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, js_base: &TokenBaseTransitionNAPI) {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.base = js_base.clone().into();
    }

    #[napi(setter, js_name = "tokenCount")]
    pub fn set_token_count(&mut self, js_token_count: BigIntString) -> Result<(), napi::Error> {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.token_count = js_token_count.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "totalAgreedPrice")]
    pub fn set_total_agreed_price(
        &mut self,
        js_total_agreed_price: BigIntString,
    ) -> Result<(), napi::Error> {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.total_agreed_price = js_total_agreed_price.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenDirectPurchaseToPoolTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }
}
