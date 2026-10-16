use dpp::state_transition::StateTransition;
use dpp::state_transition::identity_top_up_from_shielded_pool_transition::IdentityTopUpFromShieldedPoolTransition;
use dpp::state_transition::identity_top_up_from_shielded_pool_transition::v0::IdentityTopUpFromShieldedPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "IdentityTopUpFromShieldedPoolTransitionNAPI")]
pub struct IdentityTopUpFromShieldedPoolTransitionNAPI(IdentityTopUpFromShieldedPoolTransition);

impl From<IdentityTopUpFromShieldedPoolTransition> for IdentityTopUpFromShieldedPoolTransitionNAPI {
    fn from(value: IdentityTopUpFromShieldedPoolTransition) -> Self {
        Self(value)
    }
}

impl From<IdentityTopUpFromShieldedPoolTransitionNAPI> for IdentityTopUpFromShieldedPoolTransition {
    fn from(value: IdentityTopUpFromShieldedPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl IdentityTopUpFromShieldedPoolTransitionNAPI {
    /// Tops up an identity with credits spent from the shielded pool
    #[napi(constructor)]
    pub fn new(
        js_identity_id: IdentifierLikeNAPI,
        js_actions: Vec<&SerializedActionNAPI>,
        js_top_up_amount: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
    ) -> Result<IdentityTopUpFromShieldedPoolTransitionNAPI, napi::Error> {
        Ok(IdentityTopUpFromShieldedPoolTransitionNAPI(
            IdentityTopUpFromShieldedPoolTransition::V0(
                IdentityTopUpFromShieldedPoolTransitionV0 {
                    identity_id: IdentifierNAPI::try_from(js_identity_id)?.into(),
                    actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
                    top_up_amount: js_top_up_amount.try_to_u64()?,
                    anchor: js_bytes_to_anchor(js_anchor)?,
                    proof: js_proof.to_vec(),
                    binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
                },
            ),
        ))
    }

    #[napi(getter, js_name = "identityId")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.identity_id.into()
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "topUpAmount")]
    pub fn get_top_up_amount(&self) -> BigIntString {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.top_up_amount)
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.identity_id = IdentifierNAPI::try_from(js_identity_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "topUpAmount")]
    pub fn set_top_up_amount(&mut self, js_top_up_amount: BigIntString) -> Result<(), napi::Error> {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.top_up_amount = js_top_up_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let IdentityTopUpFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::IdentityTopUpFromShieldedPool(
            self.0.clone(),
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityTopUpFromShieldedPoolTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::IdentityTopUpFromShieldedPool(st) => {
                Ok(IdentityTopUpFromShieldedPoolTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected IdentityTopUpFromShieldedPoolTransition",
            )),
        }
    }
}
