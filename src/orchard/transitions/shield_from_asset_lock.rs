use dpp::{
    address_funds::PlatformAddress,
    identity::state_transition::AssetLockProved,
    platform_value::BinaryData,
    shielded::SerializedAction,
    state_transition::{
        StateTransition,
        shield_from_asset_lock_transition::{
            ShieldFromAssetLockTransition, v0::ShieldFromAssetLockTransitionV0,
        },
    },
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    asset_lock_proof::AssetLockProofNAPI,
    dynamic_value::{BigIntString, PlatformAddressLikeNAPI, TryToU64},
    orchard::serialized_action::SerializedActionNAPI,
    platform_address::PlatformAddressNAPI,
    state_transition::StateTransitionNAPI,
    utils::WithJsError,
};

#[derive(Debug, Clone)]
#[napi(js_name = "ShieldFromAssetLockTransitionNAPI")]
pub struct ShieldFromAssetLockTransitionNAPI(ShieldFromAssetLockTransition);

impl From<ShieldFromAssetLockTransitionNAPI> for ShieldFromAssetLockTransition {
    fn from(value: ShieldFromAssetLockTransitionNAPI) -> Self {
        value.0
    }
}

impl From<ShieldFromAssetLockTransition> for ShieldFromAssetLockTransitionNAPI {
    fn from(value: ShieldFromAssetLockTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl ShieldFromAssetLockTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_asset_lock_proof: &AssetLockProofNAPI,
        js_actions: Vec<&SerializedActionNAPI>,
        js_value_balance: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
        js_surplus_output: Option<PlatformAddressLikeNAPI>,
    ) -> Result<Self, napi::Error> {
        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let value_balance = js_value_balance.try_to_u64()?;

        let surplus_output: Option<PlatformAddress> = js_surplus_output
            .map(PlatformAddressNAPI::try_from)
            .transpose()?
            .map(Into::into);

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

        Ok(Self(ShieldFromAssetLockTransition::V0(
            ShieldFromAssetLockTransitionV0 {
                asset_lock_proof: js_asset_lock_proof.clone().into(),
                actions,
                value_balance,
                anchor: js_anchor.to_vec().try_into().unwrap(),
                proof: js_proof.to_vec(),
                binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
                surplus_output: surplus_output,
                signature: Default::default(),
            },
        )))
    }

    #[napi(getter, js_name = "assetLockProof")]
    pub fn asset_lock_proof(&self) -> AssetLockProofNAPI {
        self.0.asset_lock_proof().clone().into()
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => {
                st.actions.iter().map(|t| t.clone().into()).collect()
            }
        }
    }

    #[napi(getter, js_name = "valueBalance")]
    pub fn value_balance(&self) -> BigIntString {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => BigIntString::from_u64(st.value_balance),
        }
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => st.anchor.into(),
        }
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => st.proof.into(),
        }
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => st.binding_signature.into(),
        }
    }

    #[napi(getter, js_name = "surplusOutput")]
    pub fn surplus_output(&self) -> Option<PlatformAddressNAPI> {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => st.surplus_output.map(Into::into),
        }
    }

    #[napi(getter, js_name = "signature")]
    pub fn signature(&self) -> Uint8Array {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(st) => st.signature.to_vec().into(),
        }
    }

    #[napi(setter, js_name = "assetLockProof")]
    pub fn set_inputs(
        &mut self,
        js_asset_lock_proof: &AssetLockProofNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_asset_lock_proof(js_asset_lock_proof.clone().into())
            .with_js_error()?;

        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.actions = actions.into_iter().map(|a| a.clone().into()).collect();
                self.0 = ShieldFromAssetLockTransition::V0(st);
            }
        }
    }

    #[napi(setter, js_name = "valueBalance")]
    pub fn set_value_balance(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.value_balance = amount.try_to_u64()?;
                self.0 = ShieldFromAssetLockTransition::V0(st);
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
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.anchor = js_anchor.to_vec().try_into().unwrap();
                self.0 = ShieldFromAssetLockTransition::V0(st);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.proof = proof.to_vec();

                self.0 = ShieldFromAssetLockTransition::V0(st)
            }
        }
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                if js_bindings_signature.len() != 64 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "bindings_signature must be 64 bytes length",
                    ));
                }

                st.binding_signature = js_bindings_signature.to_vec().try_into().unwrap();

                self.0 = ShieldFromAssetLockTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "surplusOutput")]
    pub fn set_surplus_output(
        &mut self,
        js_surplus_output: Option<PlatformAddressLikeNAPI>,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.surplus_output = js_surplus_output
                    .map(PlatformAddressNAPI::try_from)
                    .transpose()?
                    .map(Into::into);

                self.0 = ShieldFromAssetLockTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        match self.0.clone() {
            ShieldFromAssetLockTransition::V0(mut st) => {
                st.signature = BinaryData::new(signature.to_vec());
                self.0 = ShieldFromAssetLockTransition::V0(st);
            }
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::ShieldFromAssetLock(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<ShieldFromAssetLockTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::ShieldFromAssetLock(st) => Ok(ShieldFromAssetLockTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state ShieldFromAssetLockTransition type",
            )),
        }
    }
}
