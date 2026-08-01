use dpp::{
    shielded::{SerializedAction, compute_shielded_withdrawal_fee},
    state_transition::{
        StateTransition,
        shielded_withdrawal_transition::{
            ShieldedWithdrawalTransition, accessors::ShieldedWithdrawalTransitionAccessorsV0,
            v0::ShieldedWithdrawalTransitionV0,
        },
    },
    version::PlatformVersion,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    core_script::CoreScriptNAPI,
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::{platform_version::PlatformVersionNAPI, pooling::PoolingNAPI},
    orchard::serialized_action::SerializedActionNAPI,
    state_transition::StateTransitionNAPI,
    utils::{WithJsError, js_bytes_to_anchor, js_bytes_to_binding_signature},
};

#[derive(Debug, Clone)]
#[napi(js_name = "ShieldedWithdrawalTransitionNAPI")]
pub struct ShieldedWithdrawalTransitionNAPI(ShieldedWithdrawalTransition);

impl From<ShieldedWithdrawalTransitionNAPI> for ShieldedWithdrawalTransition {
    fn from(value: ShieldedWithdrawalTransitionNAPI) -> Self {
        value.0
    }
}

impl From<ShieldedWithdrawalTransition> for ShieldedWithdrawalTransitionNAPI {
    fn from(value: ShieldedWithdrawalTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl ShieldedWithdrawalTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_actions: Vec<&SerializedActionNAPI>,
        js_unshielding_amount: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
        core_fee_per_byte: u32,
        js_pooling: &DynamicValue,
        js_output_script: &CoreScriptNAPI,
    ) -> Result<Self, napi::Error> {
        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let unshielding_amount: u64 = js_unshielding_amount.try_to_u64()?;

        let pooling = PoolingNAPI::try_from(js_pooling)?;

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

        Ok(Self(ShieldedWithdrawalTransition::V0(
            ShieldedWithdrawalTransitionV0 {
                actions,
                unshielding_amount,
                anchor: js_anchor.to_vec().try_into().unwrap(),
                proof: js_proof.to_vec(),
                binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
                core_fee_per_byte,
                pooling: pooling.into(),
                output_script: js_output_script.clone().into(),
            },
        )))
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0.actions().iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "unshieldingAmount")]
    pub fn unshielding_amount(&self) -> BigIntString {
        BigIntString::from_u64(self.0.unshielding_amount())
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

    #[napi(getter, js_name = "coreFeePerByte")]
    pub fn core_fee_per_byte(&self) -> u32 {
        self.0.core_fee_per_byte()
    }

    #[napi(getter, js_name = "pooling")]
    pub fn pooling(&self) -> String {
        PoolingNAPI::from(self.0.pooling()).into()
    }

    #[napi(getter, js_name = "outputScript")]
    pub fn output_script(&self) -> CoreScriptNAPI {
        self.0.output_script().clone().into()
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        self.0
            .set_actions(actions.into_iter().map(|a| a.clone().into()).collect());
    }

    #[napi(setter, js_name = "unshieldingAmount")]
    pub fn set_unshielding_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        self.0.set_unshielding_amount(amount.try_to_u64()?);

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

    #[napi(setter, js_name = "coreFeePerByte")]
    pub fn set_core_fee_per_byte(&mut self, core_fee_per_byte: u32) {
        self.0.set_core_fee_per_byte(core_fee_per_byte);
    }

    #[napi(setter, js_name = "pooling")]
    pub fn set_pooling(&mut self, js_pooling: &DynamicValue) -> Result<(), napi::Error> {
        self.0
            .set_pooling(PoolingNAPI::try_from(js_pooling)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "outputScript")]
    pub fn set_output_script(&mut self, output_script: &CoreScriptNAPI) {
        self.0.set_output_script(output_script.clone().into());
    }

    #[napi(js_name = "computeMinimumFee")]
    pub fn compute_minimum_fee(
        js_num_actions: u32,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        compute_shielded_withdrawal_fee(js_num_actions as usize, &platform_version)
            .map(BigIntString::from_u64)
            .with_js_error()
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ShieldedWithdrawal(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ShieldedWithdrawalTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::ShieldedWithdrawal(st) => Ok(ShieldedWithdrawalTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state ShieldedWithdrawalTransition type",
            )),
        }
    }
}
