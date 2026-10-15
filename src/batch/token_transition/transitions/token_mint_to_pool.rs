use dpp::state_transition::batch_transition::TokenMintToPoolTransition;
use dpp::state_transition::batch_transition::token_mint_to_pool_transition::TokenMintToPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{BigIntString, TryToU64};
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenMintToPoolTransitionNAPI")]
pub struct TokenMintToPoolTransitionNAPI(TokenMintToPoolTransition);

impl From<TokenMintToPoolTransition> for TokenMintToPoolTransitionNAPI {
    fn from(value: TokenMintToPoolTransition) -> Self {
        Self(value)
    }
}

impl From<TokenMintToPoolTransitionNAPI> for TokenMintToPoolTransition {
    fn from(value: TokenMintToPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenMintToPoolTransitionNAPI {
    /// Mints tokens directly into the token shielded pool
    #[napi(constructor)]
    pub fn new(
        js_base: &TokenBaseTransitionNAPI,
        js_amount: BigIntString,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
        js_public_note: Option<String>,
    ) -> Result<TokenMintToPoolTransitionNAPI, napi::Error> {
        Ok(TokenMintToPoolTransitionNAPI(
            TokenMintToPoolTransition::V0(TokenMintToPoolTransitionV0 {
                base: js_base.clone().into(),
                amount: js_amount.try_to_u64()?,
                actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
                anchor: js_bytes_to_anchor(js_anchor)?,
                proof: js_proof.to_vec(),
                binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
                public_note: js_public_note,
            }),
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.base.clone().into()
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.amount)
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        let TokenMintToPoolTransition::V0(v0) = &self.0;
        v0.public_note.clone()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, js_base: &TokenBaseTransitionNAPI) {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.base = js_base.clone().into();
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, js_amount: BigIntString) -> Result<(), napi::Error> {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.amount = js_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, js_public_note: Option<String>) {
        let TokenMintToPoolTransition::V0(v0) = &mut self.0;
        v0.public_note = js_public_note;
    }
}
