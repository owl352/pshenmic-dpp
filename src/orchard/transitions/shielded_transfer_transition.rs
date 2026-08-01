use dpp::{
    shielded::{SerializedAction, compute_minimum_shielded_fee},
    state_transition::{
        StateTransition,
        shielded_transfer_transition::{
            ShieldedTransferTransition, accessors::ShieldedTransferTransitionAccessorsV0,
            v0::ShieldedTransferTransitionV0,
        },
    },
    version::PlatformVersion,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    orchard::serialized_action::SerializedActionNAPI,
    state_transition::StateTransitionNAPI,
    utils::{WithJsError, js_bytes_to_anchor, js_bytes_to_binding_signature},
};

#[derive(Debug, Clone)]
#[napi(js_name = "ShieldedTransferTransitionNAPI")]
pub struct ShieldedTransferTransitionNAPI(ShieldedTransferTransition);

impl From<ShieldedTransferTransitionNAPI> for ShieldedTransferTransition {
    fn from(value: ShieldedTransferTransitionNAPI) -> Self {
        value.0
    }
}

impl From<ShieldedTransferTransition> for ShieldedTransferTransitionNAPI {
    fn from(value: ShieldedTransferTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl ShieldedTransferTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_actions: Vec<&SerializedActionNAPI>,
        js_value_balance: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
    ) -> Result<Self, napi::Error> {
        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let value_balance: u64 = js_value_balance.try_to_u64()?;

        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }

        if js_bindings_signature.len() != 64 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "bindings_signature must be 64 bytes length",
            ));
        }

        Ok(Self(ShieldedTransferTransition::V0(
            ShieldedTransferTransitionV0 {
                actions,
                value_balance,
                anchor: js_anchor.to_vec().try_into().unwrap(),
                proof: js_proof.to_vec(),
                binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
            },
        )))
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0.actions().iter().map(|t| t.clone().into()).collect()
    }

    #[napi(getter, js_name = "valueBalance")]
    pub fn value_balance(&self) -> BigIntString {
        BigIntString::from_u64(self.0.value_balance())
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        self.0.anchor().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        self.0.proof().to_vec().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        self.0.binding_signature().into()
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        self.0
            .set_actions(actions.into_iter().map(|a| a.clone().into()).collect());
    }

    #[napi(setter, js_name = "valueBalance")]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        self.0.set_value_balance(amount.try_to_u64()?);

        Ok(())
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        self.0.set_anchor(js_bytes_to_anchor(js_anchor)?);

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        self.0.set_proof(proof.to_vec());
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        self.0
            .set_binding_signature(js_bytes_to_binding_signature(js_bindings_signature)?);

        Ok(())
    }

    #[napi(js_name = "computeMinimumFee")]
    pub fn compute_minimum_fee(
        js_num_actions: u32,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        compute_minimum_shielded_fee(js_num_actions as usize, &platform_version)
            .map(BigIntString::from_u64)
            .with_js_error()
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ShieldedTransfer(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ShieldedTransferTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::ShieldedTransfer(st) => Ok(ShieldedTransferTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state ShieldedTransferTransition type",
            )),
        }
    }
}
