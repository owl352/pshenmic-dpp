use dpp::platform_value::BinaryData;
use dpp::state_transition::StateTransition;
use dpp::state_transition::contract_user_moderation_transition::ContractUserModerationTransition;
use dpp::state_transition::contract_user_moderation_transition::v0::ContractUserModerationTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{serde_from_js, serde_to_js};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "ContractUserModerationTransitionNAPI")]
pub struct ContractUserModerationTransitionNAPI(ContractUserModerationTransition);

impl From<ContractUserModerationTransition> for ContractUserModerationTransitionNAPI {
    fn from(value: ContractUserModerationTransition) -> Self {
        Self(value)
    }
}

impl From<ContractUserModerationTransitionNAPI> for ContractUserModerationTransition {
    fn from(value: ContractUserModerationTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ContractUserModerationTransitionNAPI {
    /// A moderator action on a contract user or document. The action is a plain object tagged with `$type`
    #[napi(constructor)]
    pub fn new(
        js_owner_id: IdentifierLikeNAPI,
        js_data_contract_id: IdentifierLikeNAPI,
        js_identity_contract_nonce: BigIntString,
        js_action: &DynamicValue,
        js_user_fee_increase: Option<u16>,
    ) -> Result<ContractUserModerationTransitionNAPI, napi::Error> {
        Ok(ContractUserModerationTransitionNAPI(
            ContractUserModerationTransition::V0(ContractUserModerationTransitionV0 {
                owner_id: IdentifierNAPI::try_from(js_owner_id)?.into(),
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                identity_contract_nonce: js_identity_contract_nonce.try_to_u64()?,
                action: serde_from_js(js_action)?,
                user_fee_increase: js_user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "ownerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        v0.owner_id.into()
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        v0.data_contract_id.into()
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        BigIntString::from_u64(v0.identity_contract_nonce)
    }

    #[napi(getter, js_name = "action")]
    pub fn get_action(&self) -> Result<DynamicValue, napi::Error> {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        serde_to_js(&v0.action)
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        v0.user_fee_increase
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        v0.signature_public_key_id
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        let ContractUserModerationTransition::V0(v0) = &self.0;
        v0.signature.to_vec().into()
    }

    #[napi(setter, js_name = "ownerId")]
    pub fn set_owner_id(&mut self, js_owner_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.owner_id = IdentifierNAPI::try_from(js_owner_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.data_contract_id = IdentifierNAPI::try_from(js_data_contract_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(
        &mut self,
        js_identity_contract_nonce: BigIntString,
    ) -> Result<(), napi::Error> {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.identity_contract_nonce = js_identity_contract_nonce.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "action")]
    pub fn set_action(&mut self, js_action: &DynamicValue) -> Result<(), napi::Error> {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.action = serde_from_js(js_action)?;
        Ok(())
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, js_user_fee_increase: u16) {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.user_fee_increase = js_user_fee_increase;
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, js_signature_public_key_id: u32) {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.signature_public_key_id = js_signature_public_key_id;
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, js_signature: Uint8Array) {
        let ContractUserModerationTransition::V0(v0) = &mut self.0;
        v0.signature = BinaryData::from(js_signature.to_vec());
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ContractUserModeration(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ContractUserModerationTransitionNAPI, napi::Error> {
        match StateTransition::from(st.clone()) {
            StateTransition::ContractUserModeration(st) => {
                Ok(ContractUserModerationTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected ContractUserModerationTransition",
            )),
        }
    }
}
