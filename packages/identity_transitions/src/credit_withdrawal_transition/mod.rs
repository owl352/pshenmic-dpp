use dpp::identity::KeyID;
use dpp::platform_value::Identifier;
use dpp::prelude::{IdentityNonce, UserFeeIncrease};
use dpp::serialization::Signable;
use dpp::state_transition::identity_credit_withdrawal_transition::IdentityCreditWithdrawalTransition;
use dpp::state_transition::identity_credit_withdrawal_transition::v0::IdentityCreditWithdrawalTransitionV0;
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use pshenmic_dpp_core_script::CoreScriptWASM;
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
