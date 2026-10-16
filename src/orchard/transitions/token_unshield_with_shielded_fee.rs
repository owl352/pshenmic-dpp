use dpp::state_transition::StateTransition;
use dpp::state_transition::token_unshield_with_shielded_fee_transition::TokenUnshieldWithShieldedFeeTransition;
use dpp::state_transition::token_unshield_with_shielded_fee_transition::v0::TokenUnshieldWithShieldedFeeTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenUnshieldWithShieldedFeeTransitionNAPI")]
pub struct TokenUnshieldWithShieldedFeeTransitionNAPI(TokenUnshieldWithShieldedFeeTransition);

impl From<TokenUnshieldWithShieldedFeeTransition> for TokenUnshieldWithShieldedFeeTransitionNAPI {
    fn from(value: TokenUnshieldWithShieldedFeeTransition) -> Self {
        Self(value)
    }
}

impl From<TokenUnshieldWithShieldedFeeTransitionNAPI> for TokenUnshieldWithShieldedFeeTransition {
    fn from(value: TokenUnshieldWithShieldedFeeTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenUnshieldWithShieldedFeeTransitionNAPI {
    /// Unshields tokens to an identity, paying the fee from the credit shielded pool
    #[napi(constructor)]
    pub fn new(
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_token_id: IdentifierLikeNAPI,
        js_recipient_id: IdentifierLikeNAPI,
        js_amount: BigIntString,
        js_token_actions: Vec<&SerializedActionNAPI>,
        js_token_anchor: Uint8Array,
        js_token_proof: Uint8Array,
        js_token_binding_signature: Uint8Array,
        js_fee_actions: Vec<&SerializedActionNAPI>,
        js_fee_anchor: Uint8Array,
        js_fee_proof: Uint8Array,
        js_fee_binding_signature: Uint8Array,
        js_credit_amount: BigIntString,
    ) -> Result<TokenUnshieldWithShieldedFeeTransitionNAPI, napi::Error> {
        Ok(TokenUnshieldWithShieldedFeeTransitionNAPI(
            TokenUnshieldWithShieldedFeeTransition::V0(TokenUnshieldWithShieldedFeeTransitionV0 {
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                token_contract_position: js_token_contract_position,
                token_id: IdentifierNAPI::try_from(js_token_id)?.into(),
                recipient_id: IdentifierNAPI::try_from(js_recipient_id)?.into(),
                amount: js_amount.try_to_u64()?,
                token_actions: js_token_actions
                    .into_iter()
                    .map(|a| a.clone().into())
                    .collect(),
                token_anchor: js_bytes_to_anchor(js_token_anchor)?,
                token_proof: js_token_proof.to_vec(),
                token_binding_signature: js_bytes_to_binding_signature(js_token_binding_signature)?,
                fee_actions: js_fee_actions
                    .into_iter()
                    .map(|a| a.clone().into())
                    .collect(),
                fee_anchor: js_bytes_to_anchor(js_fee_anchor)?,
                fee_proof: js_fee_proof.to_vec(),
                fee_binding_signature: js_bytes_to_binding_signature(js_fee_binding_signature)?,
                credit_amount: js_credit_amount.try_to_u64()?,
            }),
        ))
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.data_contract_id.into()
    }

    #[napi(getter, js_name = "tokenContractPosition")]
    pub fn get_token_contract_position(&self) -> u16 {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_contract_position
    }

    #[napi(getter, js_name = "tokenId")]
    pub fn get_token_id(&self) -> IdentifierNAPI {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_id.into()
    }

    #[napi(getter, js_name = "recipientId")]
    pub fn get_recipient_id(&self) -> IdentifierNAPI {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.recipient_id.into()
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.amount)
    }

    #[napi(getter, js_name = "tokenActions")]
    pub fn get_token_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "tokenAnchor")]
    pub fn get_token_anchor(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_anchor.to_vec().into()
    }

    #[napi(getter, js_name = "tokenProof")]
    pub fn get_token_proof(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_proof.clone().into()
    }

    #[napi(getter, js_name = "tokenBindingSignature")]
    pub fn get_token_binding_signature(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.token_binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "feeActions")]
    pub fn get_fee_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.fee_actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "feeAnchor")]
    pub fn get_fee_anchor(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.fee_anchor.to_vec().into()
    }

    #[napi(getter, js_name = "feeProof")]
    pub fn get_fee_proof(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.fee_proof.clone().into()
    }

    #[napi(getter, js_name = "feeBindingSignature")]
    pub fn get_fee_binding_signature(&self) -> Uint8Array {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        v0.fee_binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "creditAmount")]
    pub fn get_credit_amount(&self) -> BigIntString {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.credit_amount)
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "tokenContractPosition")]
    pub fn set_token_contract_position(&mut self, js_token_contract_position: u16) {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_contract_position = js_token_contract_position;
    }

    #[napi(setter, js_name = "tokenId")]
    pub fn set_token_id(&mut self, js_token_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_id = IdentifierNAPI::try_from(js_token_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "recipientId")]
    pub fn set_recipient_id(
        &mut self,
        js_recipient_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.recipient_id = IdentifierNAPI::try_from(js_recipient_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, js_amount: BigIntString) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.amount = js_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "tokenActions")]
    pub fn set_token_actions(&mut self, js_token_actions: Vec<&SerializedActionNAPI>) {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_actions = js_token_actions
            .into_iter()
            .map(|a| a.clone().into())
            .collect();
    }

    #[napi(setter, js_name = "tokenAnchor")]
    pub fn set_token_anchor(&mut self, js_token_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_anchor = js_bytes_to_anchor(js_token_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "tokenProof")]
    pub fn set_token_proof(&mut self, js_token_proof: Uint8Array) {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_proof = js_token_proof.to_vec();
    }

    #[napi(setter, js_name = "tokenBindingSignature")]
    pub fn set_token_binding_signature(
        &mut self,
        js_token_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.token_binding_signature = js_bytes_to_binding_signature(js_token_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "feeActions")]
    pub fn set_fee_actions(&mut self, js_fee_actions: Vec<&SerializedActionNAPI>) {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.fee_actions = js_fee_actions
            .into_iter()
            .map(|a| a.clone().into())
            .collect();
    }

    #[napi(setter, js_name = "feeAnchor")]
    pub fn set_fee_anchor(&mut self, js_fee_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.fee_anchor = js_bytes_to_anchor(js_fee_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "feeProof")]
    pub fn set_fee_proof(&mut self, js_fee_proof: Uint8Array) {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.fee_proof = js_fee_proof.to_vec();
    }

    #[napi(setter, js_name = "feeBindingSignature")]
    pub fn set_fee_binding_signature(
        &mut self,
        js_fee_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.fee_binding_signature = js_bytes_to_binding_signature(js_fee_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "creditAmount")]
    pub fn set_credit_amount(&mut self, js_credit_amount: BigIntString) -> Result<(), napi::Error> {
        let TokenUnshieldWithShieldedFeeTransition::V0(v0) = &mut self.0;
        v0.credit_amount = js_credit_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::TokenUnshieldWithShieldedFee(
            self.0.clone(),
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<TokenUnshieldWithShieldedFeeTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::TokenUnshieldWithShieldedFee(st) => {
                Ok(TokenUnshieldWithShieldedFeeTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected TokenUnshieldWithShieldedFeeTransition",
            )),
        }
    }
}
