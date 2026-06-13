use dpp::{
    shielded::SerializedAction,
    state_transition::{
        StateTransition,
        shielded_transfer_transition::{
            ShieldedTransferTransition, accessors::ShieldedTransferTransitionAccessorsV0,
            v0::ShieldedTransferTransitionV0,
        },
    },
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, TryToU64},
    orchard::serialized_action::SerializedActionNAPI,
    state_transition::StateTransitionNAPI,
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
        match self.0.clone() {
            ShieldedTransferTransition::V0(st) => BigIntString::from_u64(st.value_balance),
        }
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldedTransferTransition::V0(st) => st.anchor.into(),
        }
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldedTransferTransition::V0(st) => st.proof.into(),
        }
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldedTransferTransition::V0(st) => st.binding_signature.into(),
        }
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        match self.0.clone() {
            ShieldedTransferTransition::V0(mut st) => {
                st.actions = actions.into_iter().map(|a| a.clone().into()).collect();
                self.0 = ShieldedTransferTransition::V0(st);
            }
        }
    }

    #[napi(setter, js_name = "valueBalance")]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldedTransferTransition::V0(mut st) => {
                st.value_balance = amount.try_to_u64()?;
                self.0 = ShieldedTransferTransition::V0(st);
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
            ShieldedTransferTransition::V0(mut st) => {
                st.anchor = js_anchor.to_vec().try_into().unwrap();
                self.0 = ShieldedTransferTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        match self.0.clone() {
            ShieldedTransferTransition::V0(mut st) => {
                st.proof = proof.to_vec();

                self.0 = ShieldedTransferTransition::V0(st)
            }
        }
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldedTransferTransition::V0(mut st) => {
                if js_bindings_signature.len() != 64 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "bindings_signature must be 64 bytes length",
                    ));
                }

                st.binding_signature = js_bindings_signature.to_vec().try_into().unwrap();

                self.0 = ShieldedTransferTransition::V0(st)
            }
        }

        Ok(())
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
