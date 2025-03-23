use crate::create_transition::IdentityCreateTransitionWASM;
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_credit_transfer_transition::IdentityCreditTransferTransition;
use dpp::state_transition::identity_credit_transfer_transition::accessors::IdentityCreditTransferTransitionAccessorsV0;
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::{WithJsError, identifier_from_js_value};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = IdentityCreditTransferWASM)]
pub struct IdentityCreditTransferWASM(IdentityCreditTransferTransition);

#[wasm_bindgen]
impl IdentityCreditTransferWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        amount: u64,
        js_sender: JsValue,
        js_recipient: JsValue,
        nonce: u64,
        platform_version_wasm: Option<PlatformVersionWASM>,
    ) -> Self {
        let rs_transfer_transition_creation = IdentityCreditTransferTransition::default_versioned(
            &platform_version_wasm.unwrap_or_default().into(),
        )
        .with_js_error();

        let mut rs_transition = match rs_transfer_transition_creation {
            Ok(rs_transition) => rs_transition,
            Err(err) => wasm_bindgen::throw_val(err),
        };

        let sender = match identifier_from_js_value(&js_sender) {
            Ok(sender) => sender,
            Err(err) => wasm_bindgen::throw_val(err),
        };

        let recipient = match identifier_from_js_value(&js_recipient) {
            Ok(recipient) => recipient,
            Err(err) => wasm_bindgen::throw_val(err),
        };

        rs_transition.set_recipient_id(recipient);
        rs_transition.set_identity_id(sender);
        rs_transition.set_amount(amount);
        rs_transition.set_nonce(nonce);

        IdentityCreditTransferWASM(rs_transition)
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityCreditTransferWASM, JsValue> {
        let rs_transition =
            IdentityCreditTransferTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error();

        match rs_transition {
            Ok(transition) => Ok(IdentityCreditTransferWASM(transition)),
            Err(err) => wasm_bindgen::throw_val(err),
        }
    }

    #[wasm_bindgen(js_name = "setRecipientId")]
    pub fn set_recipient_id(&mut self, js_recipient: JsValue) {
        let recipient = match identifier_from_js_value(&js_recipient) {
            Ok(recipient) => recipient,
            Err(err) => wasm_bindgen::throw_val(err),
        };

        self.0.set_recipient_id(recipient)
    }

    #[wasm_bindgen(js_name = "setIdentityId")]
    pub fn set_identity_id(&mut self, js_sender: JsValue) {
        let sender = match identifier_from_js_value(&js_sender) {
            Ok(sender) => sender,
            Err(err) => wasm_bindgen::throw_val(err),
        };

        self.0.set_identity_id(sender)
    }

    #[wasm_bindgen(js_name = "setAmount")]
    pub fn set_amount(&mut self, amount: u64) {
        self.0.set_amount(amount)
    }

    #[wasm_bindgen(js_name = "setNonce")]
    pub fn set_nonce(&mut self, nonce: u64) {
        self.0.set_nonce(nonce)
    }

    #[wasm_bindgen(js_name = "setSignature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature_bytes(signature)
    }

    #[wasm_bindgen(js_name = "setSignaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, public_key_id: u32) {
        self.0.set_signature_public_key_id(public_key_id)
    }

    #[wasm_bindgen(js_name = "setUserFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, amount: u16) {
        self.0.set_user_fee_increase(amount)
    }

    #[wasm_bindgen(js_name = "getSignature")]
    pub fn get_signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.signable_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "getSignaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[wasm_bindgen(js_name = "getUserFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(js_name = "getRecipientId")]
    pub fn get_recipient_id(&self) -> String {
        self.0.recipient_id().to_string(Base58)
    }

    #[wasm_bindgen(js_name = "getIdentityId")]
    pub fn get_identity_id(&self) -> String {
        self.0.identity_id().to_string(Base58)
    }

    #[wasm_bindgen(js_name = "getAmount")]
    pub fn get_amount(&self) -> u64 {
        self.0.amount()
    }

    #[wasm_bindgen(js_name = "getNonce")]
    pub fn get_nonce(&self) -> u64 {
        self.0.nonce()
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn from_state_transition(
        st: StateTransitionWASM,
    ) -> Result<IdentityCreditTransferWASM, JsValue> {
        let rs_st: StateTransition = st.into();

        match rs_st {
            StateTransition::IdentityCreditTransfer(st) => Ok(IdentityCreditTransferWASM(st)),
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }
}

impl IdentityCreditTransferWASM {
    pub fn set_signature_binary_data(&mut self, data: BinaryData) {
        self.0.set_signature(data)
    }
}
