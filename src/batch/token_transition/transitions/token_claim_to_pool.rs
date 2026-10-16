use dpp::state_transition::batch_transition::TokenClaimToPoolTransition;
use dpp::state_transition::batch_transition::token_claim_to_pool_transition::TokenClaimToPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::enums::distribution_type::TokenDistributionTypeNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenClaimToPoolTransitionNAPI")]
pub struct TokenClaimToPoolTransitionNAPI(TokenClaimToPoolTransition);

impl From<TokenClaimToPoolTransition> for TokenClaimToPoolTransitionNAPI {
    fn from(value: TokenClaimToPoolTransition) -> Self {
        Self(value)
    }
}

impl From<TokenClaimToPoolTransitionNAPI> for TokenClaimToPoolTransition {
    fn from(value: TokenClaimToPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenClaimToPoolTransitionNAPI {
    /// Claims a token distribution into the token shielded pool
    #[napi(constructor)]
    pub fn new(
        js_base: &TokenBaseTransitionNAPI,
        js_distribution_type: &DynamicValue,
        js_claim_up_to: Option<BigIntString>,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
        js_public_note: Option<String>,
    ) -> Result<TokenClaimToPoolTransitionNAPI, napi::Error> {
        Ok(TokenClaimToPoolTransitionNAPI(
            TokenClaimToPoolTransition::V0(TokenClaimToPoolTransitionV0 {
                base: js_base.clone().into(),
                distribution_type: TokenDistributionTypeNAPI::try_from(js_distribution_type)?
                    .into(),
                claim_up_to: js_claim_up_to.map(|v| v.try_to_u64()).transpose()?,
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
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.base.clone().into()
    }

    #[napi(getter, js_name = "distributionType")]
    pub fn get_distribution_type(&self) -> String {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        TokenDistributionTypeNAPI::from(v0.distribution_type).into()
    }

    #[napi(getter, js_name = "claimUpTo")]
    pub fn get_claim_up_to(&self) -> Option<BigIntString> {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.claim_up_to.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        let TokenClaimToPoolTransition::V0(v0) = &self.0;
        v0.public_note.clone()
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, js_base: &TokenBaseTransitionNAPI) {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.base = js_base.clone().into();
    }

    #[napi(setter, js_name = "distributionType")]
    pub fn set_distribution_type(
        &mut self,
        js_distribution_type: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.distribution_type = TokenDistributionTypeNAPI::try_from(js_distribution_type)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "claimUpTo")]
    pub fn set_claim_up_to(
        &mut self,
        js_claim_up_to: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.claim_up_to = js_claim_up_to.map(|v| v.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, js_public_note: Option<String>) {
        let TokenClaimToPoolTransition::V0(v0) = &mut self.0;
        v0.public_note = js_public_note;
    }
}
