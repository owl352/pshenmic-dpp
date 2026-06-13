use dpp::{
    address_funds::PlatformAddress,
    shielded::SerializedAction,
    state_transition::{
        StateTransition,
        unshield_transition::{
            UnshieldTransition, accessors::UnshieldTransitionAccessorsV0, v0::UnshieldTransitionV0,
        },
    },
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, PlatformAddressLikeNAPI, TryToU64},
    orchard::serialized_action::SerializedActionNAPI,
    platform_address::PlatformAddressNAPI,
    state_transition::StateTransitionNAPI,
};

#[derive(Debug, Clone)]
#[napi(js_name = "UnshieldTransitionNAPI")]
pub struct UnshieldTransitionNAPI(UnshieldTransition);

impl From<UnshieldTransitionNAPI> for UnshieldTransition {
    fn from(value: UnshieldTransitionNAPI) -> Self {
        value.0
    }
}

impl From<UnshieldTransition> for UnshieldTransitionNAPI {
    fn from(value: UnshieldTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl UnshieldTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_output_address: PlatformAddressLikeNAPI,
        js_actions: Vec<&SerializedActionNAPI>,
        js_unshielding_amount: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
    ) -> Result<Self, napi::Error> {
        let output_address: PlatformAddress =
            PlatformAddressNAPI::try_from(js_output_address)?.into();

        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let unshielding_amount: u64 = js_unshielding_amount.try_to_u64()?;

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

        Ok(Self(UnshieldTransition::V0(UnshieldTransitionV0 {
            output_address,
            actions,
            unshielding_amount,
            anchor: js_anchor.to_vec().try_into().unwrap(),
            proof: js_proof.to_vec(),
            binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
        })))
    }

    #[napi(getter, js_name = "outputAddress")]
    pub fn output_address(&self) -> PlatformAddressNAPI {
        self.0.output_address().clone().into()
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0.actions().iter().map(|t| t.clone().into()).collect()
    }

    #[napi(getter, js_name = "unshieldingAmount")]
    pub fn unshielding_amount(&self) -> BigIntString {
        match self.0.clone() {
            UnshieldTransition::V0(st) => BigIntString::from_u64(st.unshielding_amount),
        }
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        match self.0.clone() {
            UnshieldTransition::V0(st) => st.anchor.into(),
        }
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        match self.0.clone() {
            UnshieldTransition::V0(st) => st.proof.into(),
        }
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        match self.0.clone() {
            UnshieldTransition::V0(st) => st.binding_signature.into(),
        }
    }

    #[napi(setter, js_name = "outputAddress")]
    pub fn set_output_address(
        &mut self,
        js_output_address: PlatformAddressLikeNAPI,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            UnshieldTransition::V0(mut st) => {
                st.output_address = PlatformAddressNAPI::try_from(js_output_address)?.into();
                self.0 = UnshieldTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        match self.0.clone() {
            UnshieldTransition::V0(mut st) => {
                st.actions = actions.into_iter().map(|a| a.clone().into()).collect();
                self.0 = UnshieldTransition::V0(st);
            }
        }
    }

    #[napi(setter, js_name = "unshieldingAmount")]
    pub fn set_unshielding_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        match self.0.clone() {
            UnshieldTransition::V0(mut st) => {
                st.unshielding_amount = amount.try_to_u64()?;
                self.0 = UnshieldTransition::V0(st);
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
            UnshieldTransition::V0(mut st) => {
                st.anchor = js_anchor.to_vec().try_into().unwrap();
                self.0 = UnshieldTransition::V0(st);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        match self.0.clone() {
            UnshieldTransition::V0(mut st) => {
                st.proof = proof.to_vec();

                self.0 = UnshieldTransition::V0(st)
            }
        }
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            UnshieldTransition::V0(mut st) => {
                if js_bindings_signature.len() != 64 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "bindings_signature must be 64 bytes length",
                    ));
                }

                st.binding_signature = js_bindings_signature.to_vec().try_into().unwrap();

                self.0 = UnshieldTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::Unshield(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<UnshieldTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::Unshield(st) => Ok(UnshieldTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state UnshieldTransition type",
            )),
        }
    }
}
