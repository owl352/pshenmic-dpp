use dpp::state_transition::StateTransition;
use dpp::state_transition::token_purchase_from_shielded_pool_transition::TokenPurchaseFromShieldedPoolTransition;
use dpp::state_transition::token_purchase_from_shielded_pool_transition::v0::TokenPurchaseFromShieldedPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenPurchaseFromShieldedPoolTransitionNAPI")]
pub struct TokenPurchaseFromShieldedPoolTransitionNAPI(TokenPurchaseFromShieldedPoolTransition);

impl From<TokenPurchaseFromShieldedPoolTransition> for TokenPurchaseFromShieldedPoolTransitionNAPI {
    fn from(value: TokenPurchaseFromShieldedPoolTransition) -> Self {
        Self(value)
    }
}

impl From<TokenPurchaseFromShieldedPoolTransitionNAPI> for TokenPurchaseFromShieldedPoolTransition {
    fn from(value: TokenPurchaseFromShieldedPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenPurchaseFromShieldedPoolTransitionNAPI {
    /// Buys tokens at their direct purchase price with credits from the shielded pool
    #[napi(constructor)]
    pub fn new(
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_contract_position: u16,
        js_token_id: IdentifierLikeNAPI,
        js_token_count: BigIntString,
        js_total_agreed_price: BigIntString,
        js_token_actions: Vec<&SerializedActionNAPI>,
        js_token_anchor: Uint8Array,
        js_token_proof: Uint8Array,
        js_token_binding_signature: Uint8Array,
        js_fee_actions: Vec<&SerializedActionNAPI>,
        js_fee_anchor: Uint8Array,
        js_fee_proof: Uint8Array,
        js_fee_binding_signature: Uint8Array,
        js_credit_amount: BigIntString,
    ) -> Result<TokenPurchaseFromShieldedPoolTransitionNAPI, napi::Error> {
        Ok(TokenPurchaseFromShieldedPoolTransitionNAPI(
            TokenPurchaseFromShieldedPoolTransition::V0(
                TokenPurchaseFromShieldedPoolTransitionV0 {
                    data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                    token_contract_position: js_token_contract_position,
                    token_id: IdentifierNAPI::try_from(js_token_id)?.into(),
                    token_count: js_token_count.try_to_u64()?,
                    total_agreed_price: js_total_agreed_price.try_to_u64()?,
                    token_actions: js_token_actions
                        .into_iter()
                        .map(|a| a.clone().into())
                        .collect(),
                    token_anchor: js_bytes_to_anchor(js_token_anchor)?,
                    token_proof: js_token_proof.to_vec(),
                    token_binding_signature: js_bytes_to_binding_signature(
                        js_token_binding_signature,
                    )?,
                    fee_actions: js_fee_actions
                        .into_iter()
                        .map(|a| a.clone().into())
                        .collect(),
                    fee_anchor: js_bytes_to_anchor(js_fee_anchor)?,
                    fee_proof: js_fee_proof.to_vec(),
                    fee_binding_signature: js_bytes_to_binding_signature(js_fee_binding_signature)?,
                    credit_amount: js_credit_amount.try_to_u64()?,
                },
            ),
        ))
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.data_contract_id.into()
    }

    #[napi(getter, js_name = "tokenContractPosition")]
    pub fn get_token_contract_position(&self) -> u16 {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_contract_position
    }

    #[napi(getter, js_name = "tokenId")]
    pub fn get_token_id(&self) -> IdentifierNAPI {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_id.into()
    }

    #[napi(getter, js_name = "tokenCount")]
    pub fn get_token_count(&self) -> BigIntString {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.token_count)
    }

    #[napi(getter, js_name = "totalAgreedPrice")]
    pub fn get_total_agreed_price(&self) -> BigIntString {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.total_agreed_price)
    }

    #[napi(getter, js_name = "tokenActions")]
    pub fn get_token_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "tokenAnchor")]
    pub fn get_token_anchor(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_anchor.to_vec().into()
    }

    #[napi(getter, js_name = "tokenProof")]
    pub fn get_token_proof(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_proof.clone().into()
    }

    #[napi(getter, js_name = "tokenBindingSignature")]
    pub fn get_token_binding_signature(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.token_binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "feeActions")]
    pub fn get_fee_actions(&self) -> Vec<SerializedActionNAPI> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.fee_actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "feeAnchor")]
    pub fn get_fee_anchor(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.fee_anchor.to_vec().into()
    }

    #[napi(getter, js_name = "feeProof")]
    pub fn get_fee_proof(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.fee_proof.clone().into()
    }

    #[napi(getter, js_name = "feeBindingSignature")]
    pub fn get_fee_binding_signature(&self) -> Uint8Array {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        v0.fee_binding_signature.to_vec().into()
    }

    #[napi(getter, js_name = "creditAmount")]
    pub fn get_credit_amount(&self) -> BigIntString {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.credit_amount)
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "tokenContractPosition")]
    pub fn set_token_contract_position(&mut self, js_token_contract_position: u16) {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_contract_position = js_token_contract_position;
    }

    #[napi(setter, js_name = "tokenId")]
    pub fn set_token_id(&mut self, js_token_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_id = IdentifierNAPI::try_from(js_token_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "tokenCount")]
    pub fn set_token_count(&mut self, js_token_count: BigIntString) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_count = js_token_count.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "totalAgreedPrice")]
    pub fn set_total_agreed_price(
        &mut self,
        js_total_agreed_price: BigIntString,
    ) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.total_agreed_price = js_total_agreed_price.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "tokenActions")]
    pub fn set_token_actions(&mut self, js_token_actions: Vec<&SerializedActionNAPI>) {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_actions = js_token_actions
            .into_iter()
            .map(|a| a.clone().into())
            .collect();
    }

    #[napi(setter, js_name = "tokenAnchor")]
    pub fn set_token_anchor(&mut self, js_token_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_anchor = js_bytes_to_anchor(js_token_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "tokenProof")]
    pub fn set_token_proof(&mut self, js_token_proof: Uint8Array) {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_proof = js_token_proof.to_vec();
    }

    #[napi(setter, js_name = "tokenBindingSignature")]
    pub fn set_token_binding_signature(
        &mut self,
        js_token_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.token_binding_signature = js_bytes_to_binding_signature(js_token_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "feeActions")]
    pub fn set_fee_actions(&mut self, js_fee_actions: Vec<&SerializedActionNAPI>) {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.fee_actions = js_fee_actions
            .into_iter()
            .map(|a| a.clone().into())
            .collect();
    }

    #[napi(setter, js_name = "feeAnchor")]
    pub fn set_fee_anchor(&mut self, js_fee_anchor: Uint8Array) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.fee_anchor = js_bytes_to_anchor(js_fee_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "feeProof")]
    pub fn set_fee_proof(&mut self, js_fee_proof: Uint8Array) {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.fee_proof = js_fee_proof.to_vec();
    }

    #[napi(setter, js_name = "feeBindingSignature")]
    pub fn set_fee_binding_signature(
        &mut self,
        js_fee_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.fee_binding_signature = js_bytes_to_binding_signature(js_fee_binding_signature)?;
        Ok(())
    }

    #[napi(setter, js_name = "creditAmount")]
    pub fn set_credit_amount(&mut self, js_credit_amount: BigIntString) -> Result<(), napi::Error> {
        let TokenPurchaseFromShieldedPoolTransition::V0(v0) = &mut self.0;
        v0.credit_amount = js_credit_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::TokenPurchaseFromShieldedPool(
            self.0.clone(),
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<TokenPurchaseFromShieldedPoolTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::TokenPurchaseFromShieldedPool(st) => {
                Ok(TokenPurchaseFromShieldedPoolTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected TokenPurchaseFromShieldedPoolTransition",
            )),
        }
    }
}
