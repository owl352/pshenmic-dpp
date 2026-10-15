use dpp::platform_value::BinaryData;
use dpp::state_transition::StateTransition;
use dpp::state_transition::contract_fee_claim_transition::ContractFeeClaimTransition;
use dpp::state_transition::contract_fee_claim_transition::v0::ContractFeeClaimTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::contract_fee_pot::ContractFeePotNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "ContractFeeClaimTransitionNAPI")]
pub struct ContractFeeClaimTransitionNAPI(ContractFeeClaimTransition);

impl From<ContractFeeClaimTransition> for ContractFeeClaimTransitionNAPI {
    fn from(value: ContractFeeClaimTransition) -> Self {
        Self(value)
    }
}

impl From<ContractFeeClaimTransitionNAPI> for ContractFeeClaimTransition {
    fn from(value: ContractFeeClaimTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ContractFeeClaimTransitionNAPI {
    /// Claims the credits a contract fee pot collected
    #[napi(constructor)]
    pub fn new(
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_identity_contract_nonce: BigIntString,
        js_pot: &DynamicValue,
        js_user_fee_increase: Option<u16>,
    ) -> Result<ContractFeeClaimTransitionNAPI, napi::Error> {
        Ok(ContractFeeClaimTransitionNAPI(
            ContractFeeClaimTransition::V0(ContractFeeClaimTransitionV0 {
                owner_id: IdentifierNAPI::try_from(js_owner_id)?.into(),
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                identity_contract_nonce: js_identity_contract_nonce.try_to_u64()?,
                pot: ContractFeePotNAPI::try_from(js_pot)?.into(),
                user_fee_increase: js_user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "ownerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        v0.owner_id.into()
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        v0.data_contract_id.into()
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.identity_contract_nonce)
    }

    #[napi(getter, js_name = "pot")]
    pub fn get_pot(&self) -> String {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        ContractFeePotNAPI::from(v0.pot.clone()).into()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        v0.user_fee_increase
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        v0.signature_public_key_id
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        let ContractFeeClaimTransition::V0(v0) = &self.0;
        v0.signature.to_vec().into()
    }

    #[napi(setter, js_name = "ownerId")]
    pub fn set_owner_id(&mut self, js_owner_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.owner_id = IdentifierNAPI::try_from(js_owner_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(
        &mut self,
        js_identity_contract_nonce: BigIntString,
    ) -> Result<(), napi::Error> {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "pot")]
    pub fn set_pot(&mut self, js_pot: &DynamicValue) -> Result<(), napi::Error> {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.pot = ContractFeePotNAPI::try_from(js_pot)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, js_user_fee_increase: u16) {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.user_fee_increase = js_user_fee_increase;
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, js_signature_public_key_id: u32) {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.signature_public_key_id = js_signature_public_key_id;
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, js_signature: Uint8Array) {
        let ContractFeeClaimTransition::V0(v0) = &mut self.0;
        v0.signature = BinaryData::from(js_signature.to_vec());
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ContractFeeClaim(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ContractFeeClaimTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::ContractFeeClaim(st) => Ok(ContractFeeClaimTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected ContractFeeClaimTransition",
            )),
        }
    }
}
