use dpp::platform_value::BinaryData;
use dpp::state_transition::StateTransition;
use dpp::state_transition::identity_key_limits_update_transition::IdentityKeyLimitsUpdateTransition;
use dpp::state_transition::identity_key_limits_update_transition::v0::IdentityKeyLimitsUpdateTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "IdentityKeyLimitsUpdateTransitionNAPI")]
pub struct IdentityKeyLimitsUpdateTransitionNAPI(IdentityKeyLimitsUpdateTransition);

impl From<IdentityKeyLimitsUpdateTransition> for IdentityKeyLimitsUpdateTransitionNAPI {
    fn from(value: IdentityKeyLimitsUpdateTransition) -> Self {
        Self(value)
    }
}

impl From<IdentityKeyLimitsUpdateTransitionNAPI> for IdentityKeyLimitsUpdateTransition {
    fn from(value: IdentityKeyLimitsUpdateTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl IdentityKeyLimitsUpdateTransitionNAPI {
    /// Changes the budget and expiry of an identity key (platform v14+). `None` removes a limit
    #[napi(constructor)]
    pub fn new(
        js_identity_id: IdentifierLikeNAPI,
        js_nonce: BigIntString,
        js_key_id: u32,
        js_total_budget: Option<BigIntString>,
        js_expires_at: Option<BigIntString>,
        js_user_fee_increase: Option<u16>,
    ) -> Result<IdentityKeyLimitsUpdateTransitionNAPI, napi::Error> {
        Ok(IdentityKeyLimitsUpdateTransitionNAPI(
            IdentityKeyLimitsUpdateTransition::V0(IdentityKeyLimitsUpdateTransitionV0 {
                identity_id: IdentifierNAPI::try_from(js_identity_id)?.into(),
                nonce: js_nonce.try_to_u64()?,
                key_id: js_key_id,
                total_budget: js_total_budget.map(|v| v.try_to_u64()).transpose()?,
                expires_at: js_expires_at.map(|v| v.try_to_u64()).transpose()?,
                user_fee_increase: js_user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "identityId")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.identity_id.into()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn get_nonce(&self) -> BigIntString {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.nonce)
    }

    #[napi(getter, js_name = "keyId")]
    pub fn get_key_id(&self) -> u32 {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.key_id
    }

    #[napi(getter, js_name = "totalBudget")]
    pub fn get_total_budget(&self) -> Option<BigIntString> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.total_budget.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "expiresAt")]
    pub fn get_expires_at(&self) -> Option<BigIntString> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.expires_at.map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.user_fee_increase
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.signature_public_key_id
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &self.0;
        v0.signature.to_vec().into()
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.identity_id = IdentifierNAPI::try_from(js_identity_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, js_nonce: BigIntString) -> Result<(), napi::Error> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.nonce = js_nonce.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "keyId")]
    pub fn set_key_id(&mut self, js_key_id: u32) {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.key_id = js_key_id;
    }

    #[napi(setter, js_name = "totalBudget")]
    pub fn set_total_budget(
        &mut self,
        js_total_budget: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.total_budget = js_total_budget.map(|v| v.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "expiresAt")]
    pub fn set_expires_at(
        &mut self,
        js_expires_at: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.expires_at = js_expires_at.map(|v| v.try_to_u64()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, js_user_fee_increase: u16) {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.user_fee_increase = js_user_fee_increase;
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, js_signature_public_key_id: u32) {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.signature_public_key_id = js_signature_public_key_id;
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, js_signature: Uint8Array) {
        let IdentityKeyLimitsUpdateTransition::V0(v0) = &mut self.0;
        v0.signature = BinaryData::from(js_signature.to_vec());
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::IdentityKeyLimitsUpdate(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityKeyLimitsUpdateTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::IdentityKeyLimitsUpdate(st) => {
                Ok(IdentityKeyLimitsUpdateTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected IdentityKeyLimitsUpdateTransition",
            )),
        }
    }
}
