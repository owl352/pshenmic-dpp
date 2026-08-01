use dpp::{
    shielded::{SerializedAction, compute_shielded_identity_create_fee},
    state_transition::{
        StateTransition,
        identity_create_from_shielded_pool_transition::{
            IdentityCreateFromShieldedPoolTransition,
            accessors::IdentityCreateFromShieldedPoolTransitionAccessorsV0,
            v0::IdentityCreateFromShieldedPoolTransitionV0,
        },
        public_key_in_creation::IdentityPublicKeyInCreation,
    },
    version::PlatformVersion,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, IdentifierLikeNAPI, PlatformAddressLikeNAPI, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI,
    orchard::serialized_action::SerializedActionNAPI,
    platform_address::PlatformAddressNAPI,
    state_transition::StateTransitionNAPI,
    utils::{WithJsError, js_bytes_to_anchor, js_bytes_to_binding_signature},
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
        self.0.set_public_keys(
            js_public_keys
                .into_iter()
                .map(|k| k.clone().into())
                .collect(),
        );
    }

    #[napi(setter, js_name = "denomination")]
    pub fn set_denomination(&mut self, denomination: BigIntString) -> Result<(), napi::Error> {
        self.0.set_denomination(denomination.try_to_u64()?);

        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, actions: Vec<&SerializedActionNAPI>) {
        self.0
            .set_actions(actions.into_iter().map(|a| a.clone().into()).collect());
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

    #[napi(setter, js_name = "sendToAddressOnCreationFailure")]
    pub fn set_send_to_address_on_creation_failure(
        &mut self,
        js_address: PlatformAddressLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.0.set_send_to_address_on_creation_failure(
            PlatformAddressNAPI::try_from(js_address)?.into(),
        );

        Ok(())
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0
            .set_identity_id(IdentifierNAPI::try_from(js_id)?.into());

        Ok(())
    }

    #[napi(js_name = "computeMinimumFee")]
    pub fn compute_minimum_fee(
        js_num_actions: u32,
        js_num_keys: u32,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        compute_shielded_identity_create_fee(
            js_num_actions as usize,
            js_num_keys as usize,
            &platform_version,
        )
        .map(BigIntString::from_u64)
        .with_js_error()
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
