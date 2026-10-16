use dpp::platform_value::BinaryData;
use dpp::state_transition::StateTransition;
use dpp::state_transition::shield_from_identity_transition::ShieldFromIdentityTransition;
use dpp::state_transition::shield_from_identity_transition::v0::ShieldFromIdentityTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "ShieldFromIdentityTransitionNAPI")]
pub struct ShieldFromIdentityTransitionNAPI(ShieldFromIdentityTransition);

impl From<ShieldFromIdentityTransition> for ShieldFromIdentityTransitionNAPI {
    fn from(value: ShieldFromIdentityTransition) -> Self {
        Self(value)
    }
}

impl From<ShieldFromIdentityTransitionNAPI> for ShieldFromIdentityTransition {
    fn from(value: ShieldFromIdentityTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ShieldFromIdentityTransitionNAPI {
    /// Moves identity credits into the shielded pool
    #[napi(constructor)]
    pub fn new(
        js_identity_id: IdentifierLikeNAPI,
        js_amount: BigIntString,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
        js_nonce: BigIntString,
        js_user_fee_increase: Option<u16>,
    ) -> Result<ShieldFromIdentityTransitionNAPI, napi::Error> {
        Ok(ShieldFromIdentityTransitionNAPI(
            ShieldFromIdentityTransition::V0(ShieldFromIdentityTransitionV0 {
                identity_id: IdentifierNAPI::try_from(js_identity_id)?.into(),
                amount: js_amount.try_to_u64()?,
                actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
                anchor: js_bytes_to_anchor(js_anchor)?,
                proof: js_proof.to_vec(),
                binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
                nonce: js_nonce.try_to_u64()?,
                user_fee_increase: js_user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "identityId")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.identity_id.into()
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.amount)
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn get_nonce(&self) -> BigIntString {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.nonce)
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.user_fee_increase
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.signature_public_key_id
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        let ShieldFromIdentityTransition::V0(v0) = &self.0;
        v0.signature.to_vec().into()
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.identity_id = IdentifierNAPI::try_from(js_identity_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, js_amount: BigIntString) -> Result<(), napi::Error> {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.amount = js_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, js_nonce: BigIntString) -> Result<(), napi::Error> {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.nonce = js_nonce.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, js_user_fee_increase: u16) {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.user_fee_increase = js_user_fee_increase;
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, js_signature_public_key_id: u32) {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.signature_public_key_id = js_signature_public_key_id;
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, js_signature: Uint8Array) {
        let ShieldFromIdentityTransition::V0(v0) = &mut self.0;
        v0.signature = BinaryData::from(js_signature.to_vec());
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ShieldFromIdentity(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ShieldFromIdentityTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::ShieldFromIdentity(st) => Ok(ShieldFromIdentityTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected ShieldFromIdentityTransition",
            )),
        }
    }
}
