use dpp::{
    address_funds::{AddressFundsFeeStrategyStep, AddressWitness},
    shielded::SerializedAction,
    state_transition::{
        StateTransition, StateTransitionHasUserFeeIncrease, StateTransitionWitnessSigned,
        shield_transition::{ShieldTransition, v0::ShieldTransitionV0},
    },
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    address_transitions::entities::{
        address_funds_fee_step::AddressFundsFeeStrategyStepNAPI, input_address::InputAddressNAPI,
    },
    dynamic_value::{BigIntString, TryToU64},
    orchard::serialized_action::SerializedActionNAPI,
    platform_address::address_witness::AddressWitnessNAPI,
    state_transition::StateTransitionNAPI,
    utils::js_inputs_to_inputs,
};

#[derive(Debug, Clone)]
#[napi(js_name = "ShieldTransitionNAPI")]
pub struct ShieldTransitionNAPI(ShieldTransition);

impl From<ShieldTransitionNAPI> for ShieldTransition {
    fn from(value: ShieldTransitionNAPI) -> Self {
        value.0
    }
}

impl From<ShieldTransition> for ShieldTransitionNAPI {
    fn from(value: ShieldTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl ShieldTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_inputs: Vec<&InputAddressNAPI>,
        js_actions: Vec<&SerializedActionNAPI>,
        js_amount: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        user_fee_increase: u16,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
    ) -> Result<Self, napi::Error> {
        let inputs = js_inputs_to_inputs(js_inputs)?;

        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();
        let fee_strategy: Vec<AddressFundsFeeStrategyStep> = js_fee_strategy
            .into_iter()
            .map(|s| s.clone().into())
            .collect();
        let input_witnesses: Vec<AddressWitness> = js_input_witnesses
            .into_iter()
            .map(|w| w.clone().into())
            .collect();

        let amount: u64 = js_amount.try_to_u64()?;

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

        Ok(Self(ShieldTransition::V0(ShieldTransitionV0 {
            inputs,
            actions,
            amount,
            anchor: js_anchor.to_vec().try_into().unwrap(),
            proof: js_proof.to_vec(),
            binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
            fee_strategy,
            user_fee_increase,
            input_witnesses,
        })))
    }

    #[napi(getter, js_name = "inputs")]
    pub fn inputs(&self) -> Vec<InputAddressNAPI> {
        self.0
            .inputs()
            .iter()
            .map(|(address, (nonce, credits))| InputAddressNAPI {
                address: address.clone().into(),
                nonce: nonce.clone(),
                credits: BigIntString::from_u64(credits.clone()),
            })
            .collect()
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => shield_transition_v0
                .actions
                .iter()
                .map(|t| t.clone().into())
                .collect(),
        }
    }

    #[napi(getter, js_name = "amount")]
    pub fn amount(&self) -> BigIntString {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => {
                BigIntString::from_u64(shield_transition_v0.amount)
            }
        }
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => shield_transition_v0.anchor.into(),
        }
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => shield_transition_v0.proof.into(),
        }
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => {
                shield_transition_v0.binding_signature.into()
            }
        }
    }

    #[napi(getter, js_name = "feeStrategy")]
    pub fn fee_strategy(&self) -> Vec<AddressFundsFeeStrategyStepNAPI> {
        match self.0.clone() {
            ShieldTransition::V0(shield_transition_v0) => shield_transition_v0
                .fee_strategy
                .iter()
                .map(|s| s.clone().into())
                .collect(),
        }
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "inputWitnesses")]
    pub fn input_witnesses(&self) -> Vec<AddressWitnessNAPI> {
        self.0
            .witnesses()
            .iter()
            .map(|w| w.clone().into())
            .collect()
    }

    #[napi(setter, js_name = "inputs")]
    pub fn set_inputs(&mut self, js_inputs: Vec<&InputAddressNAPI>) -> Result<(), napi::Error> {
        self.0.set_inputs(js_inputs_to_inputs(js_inputs)?);
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                shield_transition_v0.actions =
                    actions.into_iter().map(|a| a.clone().into()).collect();
                self.0 = ShieldTransition::V0(shield_transition_v0);
            }
        }
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                shield_transition_v0.amount = amount.try_to_u64()?;
                self.0 = ShieldTransition::V0(shield_transition_v0);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        if js_anchor.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "anchor must be 32 bytes length",
            ));
        }

        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                shield_transition_v0.anchor = js_anchor.to_vec().try_into().unwrap();
                self.0 = ShieldTransition::V0(shield_transition_v0);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                shield_transition_v0.proof = proof.to_vec();

                self.0 = ShieldTransition::V0(shield_transition_v0)
            }
        }
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                if js_bindings_signature.len() != 64 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "bindings_signature must be 64 bytes length",
                    ));
                }

                shield_transition_v0.binding_signature =
                    js_bindings_signature.to_vec().try_into().unwrap();

                self.0 = ShieldTransition::V0(shield_transition_v0)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "feeStrategy")]
    pub fn set_fee_strategy(&mut self, fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>) {
        match self.0.clone() {
            ShieldTransition::V0(mut shield_transition_v0) => {
                shield_transition_v0.fee_strategy =
                    fee_strategy.into_iter().map(|s| s.clone().into()).collect();

                self.0 = ShieldTransition::V0(shield_transition_v0);
            }
        }
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase);
    }

    #[napi(setter, js_name = "inputWitnesses")]
    pub fn set_input_witnesses(&mut self, js_input_witnesses: Vec<&AddressWitnessNAPI>) {
        self.0.set_witnesses(
            js_input_witnesses
                .into_iter()
                .map(|w| w.clone().into())
                .collect(),
        )
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::Shield(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ShieldTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::Shield(st) => Ok(ShieldTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state ShieldTransition type",
            )),
        }
    }
}
