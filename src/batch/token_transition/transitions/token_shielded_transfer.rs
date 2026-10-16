use dpp::state_transition::batch_transition::TokenShieldedTransferTransition;
use dpp::state_transition::batch_transition::token_shielded_transfer_transition::TokenShieldedTransferTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenShieldedTransferTransitionNAPI")]
pub struct TokenShieldedTransferTransitionNAPI(TokenShieldedTransferTransition);

impl From<TokenShieldedTransferTransition> for TokenShieldedTransferTransitionNAPI {
    fn from(value: TokenShieldedTransferTransition) -> Self {
        Self(value)
    }
}

impl From<TokenShieldedTransferTransitionNAPI> for TokenShieldedTransferTransition {
    fn from(value: TokenShieldedTransferTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenShieldedTransferTransitionNAPI {
    /// Transfers tokens inside the token shielded pool
    #[napi(constructor)]
    pub fn new(
        js_base: &TokenBaseTransitionNAPI,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
    ) -> Result<TokenShieldedTransferTransitionNAPI, napi::Error> {
        Ok(TokenShieldedTransferTransitionNAPI(
            TokenShieldedTransferTransition::V0(TokenShieldedTransferTransitionV0 {
                base: js_base.clone().into(),
                actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
                anchor: js_bytes_to_anchor(js_anchor)?,
                proof: js_proof.to_vec(),
                binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
            }),
        ))
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        let TokenShieldedTransferTransition::V0(v0) = &self.0;
        v0.base.clone().into()
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenShieldedTransferTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let TokenShieldedTransferTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let TokenShieldedTransferTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let TokenShieldedTransferTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, js_base: &TokenBaseTransitionNAPI) {
        let TokenShieldedTransferTransition::V0(v0) = &mut self.0;
        v0.base = js_base.clone().into();
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let TokenShieldedTransferTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenShieldedTransferTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let TokenShieldedTransferTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenShieldedTransferTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }
}
