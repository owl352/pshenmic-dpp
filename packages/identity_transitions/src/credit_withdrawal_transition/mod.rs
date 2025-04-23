use dpp::identity::KeyID;
use dpp::identity::state_transition::OptionallyAssetLockProved;
use dpp::platform_value::Identifier;
use dpp::prelude::{IdentityNonce, UserFeeIncrease};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_credit_withdrawal_transition::IdentityCreditWithdrawalTransition;
use dpp::state_transition::identity_credit_withdrawal_transition::accessors::IdentityCreditWithdrawalTransitionAccessorsV0;
use dpp::state_transition::identity_credit_withdrawal_transition::v0::IdentityCreditWithdrawalTransitionV0;
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use pshenmic_dpp_asset_lock_proof::AssetLockProofWASM;
use pshenmic_dpp_core_script::CoreScriptWASM;
use pshenmic_dpp_enums::keys::purpose::PurposeWASM;
use pshenmic_dpp_enums::withdrawal::PoolingWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::WithJsError;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityCreditWithdrawalTransitionWASM")]
pub struct IdentityCreditWithdrawalTransitionWASM(IdentityCreditWithdrawalTransition);

#[wasm_bindgen]
impl IdentityCreditWithdrawalTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        js_identity_id: JsValue,
        amount: u64,
        core_fee_per_byte: u32,
        js_pooling: JsValue,
        output_script: CoreScriptWASM,
        nonce: Option<IdentityNonce>,
        user_fee_increase: Option<UserFeeIncrease>,
    ) -> Result<IdentityCreditWithdrawalTransitionWASM, JsValue> {
        let pooling = PoolingWASM::try_from(js_pooling)?;
        let identity_id: Identifier = IdentifierWASM::try_from(js_identity_id)?.into();

        Ok(IdentityCreditWithdrawalTransitionWASM(
            IdentityCreditWithdrawalTransition::V0(IdentityCreditWithdrawalTransitionV0 {
                identity_id,
                amount,
                core_fee_per_byte,
                pooling: pooling.into(),
                output_script: output_script.into(),
                nonce: nonce.unwrap_or(0),
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[wasm_bindgen(getter = "outputScript")]
    pub fn get_output_script(&self) -> Option<CoreScriptWASM> {
        match self.0.output_script() {
            None => None,
            Some(script) => Some(script.into()),
        }
    }

    #[wasm_bindgen(getter = "pooling")]
    pub fn get_pooling(&self) -> String {
        PoolingWASM::from(self.0.pooling()).into()
    }

    #[wasm_bindgen(getter = "identityId")]
    pub fn get_identity_id(&self) -> IdentifierWASM {
        IdentifierWASM::from(self.0.identity_id())
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(getter = "nonce")]
    pub fn get_nonce(&self) -> IdentityNonce {
        self.0.nonce()
    }

    #[wasm_bindgen(getter = "amount")]
    pub fn get_amount(&self) -> u64 {
        self.0.amount()
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

    #[wasm_bindgen(setter = "outputScript")]
    pub fn set_output_script(&mut self, script: Option<CoreScriptWASM>) {
        match script {
            None => self.0.set_output_script(None),
            Some(script) => self.set_output_script(Some(script.into())),
        }
    }

    #[wasm_bindgen(setter = "pooling")]
    pub fn set_pooling(&mut self, js_pooling: JsValue) -> Result<(), JsValue> {
        let pooling: PoolingWASM = PoolingWASM::try_from(js_pooling)?;
        Ok(self.0.set_pooling(pooling.into()))
    }

    #[wasm_bindgen(setter = "identityId")]
    pub fn set_identity_id(&mut self, js_identity_id: JsValue) -> Result<(), JsValue> {
        let identity_id = IdentifierWASM::try_from(js_identity_id)?;

        Ok(self.0.set_identity_id(identity_id.into()))
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase);
    }

    #[wasm_bindgen(setter = "nonce")]
    pub fn set_nonce(&mut self, nonce: IdentityNonce) {
        self.0.set_nonce(nonce)
    }

    #[wasm_bindgen(setter = "amount")]
    pub fn set_amount(&mut self, amount: u64) {
        self.0.set_amount(amount)
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
    pub fn from_bytes(
        bytes: Vec<u8>,
        version: u8,
    ) -> Result<IdentityCreditWithdrawalTransitionWASM, JsValue> {
        let rs_transition =
            IdentityCreditWithdrawalTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error()?;

        Ok(IdentityCreditWithdrawalTransitionWASM(rs_transition))
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: StateTransitionWASM,
    ) -> Result<IdentityCreditWithdrawalTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.into();

        match rs_st {
            StateTransition::IdentityCreditWithdrawal(st) => {
                Ok(IdentityCreditWithdrawalTransitionWASM(st))
            }
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }
}
