use dpp::{
    shielded::SerializedAction,
    state_transition::{
        StateTransition,
        identity_create_from_shielded_pool_transition::{
            IdentityCreateFromShieldedPoolTransition,
            accessors::IdentityCreateFromShieldedPoolTransitionAccessorsV0,
            v0::IdentityCreateFromShieldedPoolTransitionV0,
        },
        public_key_in_creation::IdentityPublicKeyInCreation,
    },
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, IdentifierLikeNAPI, PlatformAddressLikeNAPI, TryToU64},
    identifier::IdentifierNAPI,
    identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI,
    orchard::serialized_action::SerializedActionNAPI,
    platform_address::PlatformAddressNAPI,
    state_transition::StateTransitionNAPI,
};

#[derive(Debug, Clone)]
#[napi(js_name = "IdentityCreateFromShieldedPoolTransitionNAPI")]
pub struct IdentityCreateFromShieldedPoolTransitionNAPI(IdentityCreateFromShieldedPoolTransition);

impl From<IdentityCreateFromShieldedPoolTransitionNAPI>
    for IdentityCreateFromShieldedPoolTransition
{
    fn from(value: IdentityCreateFromShieldedPoolTransitionNAPI) -> Self {
        value.0
    }
}

impl From<IdentityCreateFromShieldedPoolTransition>
    for IdentityCreateFromShieldedPoolTransitionNAPI
{
    fn from(value: IdentityCreateFromShieldedPoolTransition) -> Self {
        Self(value)
    }
}

#[napi]
impl IdentityCreateFromShieldedPoolTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>,
        js_denomination: BigIntString,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_bindings_signature: Uint8Array,
        js_send_to_address_on_creation_failure: PlatformAddressLikeNAPI,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<Self, napi::Error> {
        let denomination = js_denomination.try_to_u64()?;

        let public_keys: Vec<IdentityPublicKeyInCreation> = js_public_keys
            .into_iter()
            .map(|k| k.clone().into())
            .collect();
        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let send_to_address_on_creation_failure: PlatformAddressNAPI =
            js_send_to_address_on_creation_failure.try_into()?;

        let identity_id: IdentifierNAPI = js_identity_id.try_into()?;

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

        Ok(Self(IdentityCreateFromShieldedPoolTransition::V0(
            IdentityCreateFromShieldedPoolTransitionV0 {
                public_keys,
                denomination,
                actions,
                anchor: js_anchor.to_vec().try_into().unwrap(),
                proof: js_proof.to_vec(),
                binding_signature: js_bindings_signature.to_vec().try_into().unwrap(),
                send_to_address_on_creation_failure: send_to_address_on_creation_failure.into(),
                identity_id: identity_id.into(),
            },
        )))
    }

    #[napi(getter, js_name = "publicKeys")]
    pub fn public_keys(&self) -> Vec<IdentityPublicKeyInCreationNAPI> {
        self.0
            .public_keys()
            .iter()
            .map(|k| k.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "denomination")]
    pub fn denomination(&self) -> BigIntString {
        BigIntString::from_u64(self.0.denomination())
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0.actions().iter().map(|t| t.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(st) => st.anchor.into(),
        }
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(st) => st.proof.into(),
        }
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn bindings_signature(&self) -> Uint8Array {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(st) => st.binding_signature.into(),
        }
    }

    #[napi(getter, js_name = "sendToAddressOnCreationFailure")]
    pub fn send_to_address_on_creation_failure(&self) -> PlatformAddressNAPI {
        self.0.send_to_address_on_creation_failure().clone().into()
    }

    #[napi(getter, js_name = "identityId")]
    pub fn identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id().clone().into()
    }

    #[napi(setter, js_name = "publicKeys")]
    pub fn set_public_keys(&mut self, js_public_keys: Vec<&IdentityPublicKeyInCreationNAPI>) {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.public_keys = js_public_keys
                    .into_iter()
                    .map(|k| k.clone().into())
                    .collect()
            }
        }
    }

    #[napi(setter, js_name = "denomination")]
    pub fn set_denomination(&mut self, denomination: BigIntString) -> Result<(), napi::Error> {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.denomination = denomination.try_to_u64()?;
                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.actions = actions.into_iter().map(|a| a.clone().into()).collect();
                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st);
            }
        }
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
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.anchor = js_anchor.to_vec().try_into().unwrap();
                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st);
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, proof: Uint8Array) {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.proof = proof.to_vec();

                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st)
            }
        }
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_bindings_signature(
        &mut self,
        js_bindings_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                if js_bindings_signature.len() != 64 {
                    return Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "bindings_signature must be 64 bytes length",
                    ));
                }

                st.binding_signature = js_bindings_signature.to_vec().try_into().unwrap();

                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "sendToAddressOnCreationFailure")]
    pub fn set_send_to_address_on_creation_failure(
        &mut self,
        js_address: PlatformAddressLikeNAPI,
    ) -> Result<(), napi::Error> {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.send_to_address_on_creation_failure =
                    PlatformAddressNAPI::try_from(js_address)?.into();

                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        match self.0.clone() {
            IdentityCreateFromShieldedPoolTransition::V0(mut st) => {
                st.identity_id = IdentifierNAPI::try_from(js_id)?.into();

                self.0 = IdentityCreateFromShieldedPoolTransition::V0(st)
            }
        }

        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::IdentityCreateFromShieldedPool(
            self.0.clone(),
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityCreateFromShieldedPoolTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreateFromShieldedPool(st) => {
                Ok(IdentityCreateFromShieldedPoolTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state IdentityCreateFromShieldedPool type",
            )),
        }
    }
}
