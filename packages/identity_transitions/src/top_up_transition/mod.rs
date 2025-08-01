use dpp::identifier::Identifier;
use dpp::identity::state_transition::{AssetLockProved, OptionallyAssetLockProved};
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::UserFeeIncrease;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_topup_transition::IdentityTopUpTransition;
use dpp::state_transition::identity_topup_transition::accessors::IdentityTopUpTransitionAccessorsV0;
use dpp::state_transition::identity_topup_transition::v0::IdentityTopUpTransitionV0;
use dpp::state_transition::{StateTransition, StateTransitionLike};
use pshenmic_dpp_asset_lock_proof::AssetLockProofWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "IdentityTopUpTransitionWASM")]
#[derive(Clone)]
pub struct IdentityTopUpTransitionWASM(IdentityTopUpTransition);

#[wasm_bindgen]
impl IdentityTopUpTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "IdentityTopUpTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "IdentityTopUpTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        asset_lock_proof: &AssetLockProofWASM,
        js_identity_id: JsValue,
        user_fee_increase: UserFeeIncrease,
    ) -> Result<IdentityTopUpTransitionWASM, JsValue> {
        let identity_id: Identifier = IdentifierWASM::try_from(js_identity_id)?.into();

        Ok(IdentityTopUpTransitionWASM(IdentityTopUpTransition::V0(
            IdentityTopUpTransitionV0 {
                asset_lock_proof: asset_lock_proof.clone().into(),
                identity_id,
                user_fee_increase,
                signature: Default::default(),
            },
        )))
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

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(getter = "identityIdentifier")]
    pub fn get_identity_identifier(&self) -> IdentifierWASM {
        self.0.identity_id().clone().into()
    }

    #[wasm_bindgen(getter = "assetLockProof")]
    pub fn get_asset_lock_proof(&self) -> AssetLockProofWASM {
        self.0.asset_lock_proof().clone().into()
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase);
    }

    #[wasm_bindgen(setter = "identityIdentifier")]
    pub fn set_identity_identifier(
        &mut self,
        js_identity_identifier: &JsValue,
    ) -> Result<(), JsValue> {
        let identity_identifier: Identifier =
            IdentifierWASM::try_from(js_identity_identifier)?.into();
        Ok(self.0.set_identity_id(identity_identifier.clone().into()))
    }

    #[wasm_bindgen(setter = "assetLockProof")]
    pub fn set_asset_lock_proof(
        &mut self,
        asset_lock_proof: &AssetLockProofWASM,
    ) -> Result<(), JsValue> {
        self.0
            .set_asset_lock_proof(asset_lock_proof.clone().into())
            .with_js_error()
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.signable_bytes().with_js_error()
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature_bytes(signature)
    }

    #[wasm_bindgen(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, JsValue> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Hex,
        ))
    }

    #[wasm_bindgen(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, JsValue> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Base64,
        ))
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityTopUpTransitionWASM, JsValue> {
        let rs_transition =
            IdentityTopUpTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(IdentityTopUpTransitionWASM(rs_transition))
    }

    #[wasm_bindgen(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityTopUpTransitionWASM, JsValue> {
        IdentityTopUpTransitionWASM::from_bytes(decode(hex.as_str(), Hex).map_err(JsError::from)?)
    }

    #[wasm_bindgen(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityTopUpTransitionWASM, JsValue> {
        IdentityTopUpTransitionWASM::from_bytes(
            decode(base64.as_str(), Base64).map_err(JsError::from)?,
        )
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionWASM,
    ) -> Result<IdentityTopUpTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityTopUp(st) => Ok(IdentityTopUpTransitionWASM(st)),
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }
}
