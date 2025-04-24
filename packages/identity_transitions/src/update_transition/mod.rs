use crate::public_key_in_creation::IdentityPublicKeyInCreationWASM;
use dpp::identity::KeyID;
use dpp::identity::state_transition::OptionallyAssetLockProved;
use dpp::prelude::{IdentityNonce, Revision, UserFeeIncrease};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use dpp::state_transition::identity_update_transition::accessors::IdentityUpdateTransitionAccessorsV0;
use dpp::state_transition::identity_update_transition::v0::IdentityUpdateTransitionV0;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use pshenmic_dpp_asset_lock_proof::AssetLockProofWASM;
use pshenmic_dpp_enums::keys::purpose::PurposeWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityUpdateTransitionWASM")]
#[derive(Clone)]
pub struct IdentityUpdateTransitionWASM(IdentityUpdateTransition);

#[wasm_bindgen]
impl IdentityUpdateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        identity_id: IdentifierWASM,
        revision: Revision,
        nonce: IdentityNonce,
        user_fee_increase: Option<UserFeeIncrease>,
    ) -> IdentityUpdateTransitionWASM {
        IdentityUpdateTransitionWASM(IdentityUpdateTransition::V0(IdentityUpdateTransitionV0 {
            identity_id: identity_id.into(),
            revision,
            nonce,
            add_public_keys: vec![],
            disable_public_keys: vec![],
            user_fee_increase: user_fee_increase.unwrap_or(0),
            signature_public_key_id: 0,
            signature: Default::default(),
        }))
    }

    #[wasm_bindgen(getter = "revision")]
    pub fn get_revision(&self) -> Revision {
        self.0.revision()
    }

    #[wasm_bindgen(getter = "nonce")]
    pub fn get_nonce(&self) -> IdentityNonce {
        self.0.nonce()
    }

    #[wasm_bindgen(getter = "identityIdentifier")]
    pub fn get_identity_identifier(&self) -> IdentifierWASM {
        self.0.identity_id().into()
    }

    #[wasm_bindgen(js_name = "getPurposeRequirement")]
    pub fn get_purpose_requirement(&self) -> Vec<String> {
        self.0
            .purpose_requirement()
            .iter()
            .map(|purpose| PurposeWASM::from(purpose.clone()).into())
            .collect()
    }

    #[wasm_bindgen(js_name = "getModifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Vec<IdentifierWASM> {
        self.0
            .modified_data_ids()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[wasm_bindgen(js_name = "getOptionalAssetLockProof")]
    pub fn get_optional_asset_lock_proof(&self) -> JsValue {
        match self.0.optional_asset_lock_proof() {
            Some(asset_lock) => JsValue::from(AssetLockProofWASM::from(asset_lock.clone())),
            None => JsValue::null(),
        }
    }

    #[wasm_bindgen(getter = "publicKeyIdsToDisable")]
    pub fn get_public_key_ids_to_disable(&self) -> Vec<KeyID> {
        self.0.public_key_ids_to_disable().to_vec()
    }

    #[wasm_bindgen(getter = "publicKeyIdsToAdd")]
    pub fn get_public_key_ids_to_add(&self) -> Vec<IdentityPublicKeyInCreationWASM> {
        self.0
            .public_keys_to_add()
            .to_vec()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(setter = "revision")]
    pub fn set_revision(&mut self, revision: Revision) {
        self.0.set_revision(revision);
    }

    #[wasm_bindgen(setter = "nonce")]
    pub fn set_nonce(&mut self, nonce: IdentityNonce) {
        self.0.set_nonce(nonce);
    }

    #[wasm_bindgen(setter = "identityIdentifier")]
    pub fn set_identity_identifier(&mut self, identity_id: &IdentifierWASM) {
        self.0.set_identity_id(identity_id.clone().into());
    }

    #[wasm_bindgen(setter = "publicKeyIdsToAdd")]
    pub fn set_public_key_ids_to_add(
        &mut self,
        public_key_ids: Vec<IdentityPublicKeyInCreationWASM>,
    ) {
        let keys: Vec<IdentityPublicKeyInCreation> =
            public_key_ids.iter().map(|id| id.clone().into()).collect();

        self.0.set_public_keys_to_add(keys)
    }

    #[wasm_bindgen(setter = "publicKeyIdsToDisable")]
    pub fn set_public_key_ids_to_disable(&mut self, public_keys: Vec<KeyID>) {
        self.0.set_public_key_ids_to_disable(public_keys)
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.signable_bytes().with_js_error()
    }

    #[wasm_bindgen(getter = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> KeyID {
        self.0.signature_public_key_id()
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature_bytes(signature)
    }

    #[wasm_bindgen(setter = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, signature_public_key_id: KeyID) {
        self.0.set_signature_public_key_id(signature_public_key_id)
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityUpdateTransitionWASM, JsValue> {
        let rs_transition =
            IdentityUpdateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(IdentityUpdateTransitionWASM(rs_transition))
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: StateTransitionWASM,
    ) -> Result<IdentityUpdateTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.into();

        match rs_st {
            StateTransition::IdentityUpdate(st) => Ok(IdentityUpdateTransitionWASM(st)),
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }
}
