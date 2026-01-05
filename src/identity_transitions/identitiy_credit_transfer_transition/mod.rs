use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::prelude::Identifier;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::identity_credit_transfer_transition::IdentityCreditTransferTransition;
use dpp::state_transition::identity_credit_transfer_transition::accessors::IdentityCreditTransferTransitionAccessorsV0;
use dpp::state_transition::identity_credit_transfer_transition::v0::IdentityCreditTransferTransitionV0;
use dpp::state_transition::{StateTransition, StateTransitionIdentitySigned, StateTransitionLike};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{IdentifierLikeNAPI, Uint64String};
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityCreditTransferNAPI")]
#[derive(Clone)]
pub struct IdentityCreditTransferNAPI(IdentityCreditTransferTransition);

#[napi]
impl IdentityCreditTransferNAPI {
    #[napi(constructor)]
    pub fn new(
        js_sender: IdentifierLikeNAPI,
        amount: Uint64String,
        js_recipient: IdentifierLikeNAPI,
        nonce: Uint64String,
        user_fee_increase: Option<u16>,
    ) -> Result<IdentityCreditTransferNAPI, napi::Error> {
        let sender: Identifier = IdentifierNAPI::try_from(js_sender)?.into();

        let recipient: Identifier = IdentifierNAPI::try_from(js_recipient)?.into();

        Ok(IdentityCreditTransferNAPI(
            IdentityCreditTransferTransition::V0(IdentityCreditTransferTransitionV0 {
                identity_id: sender,
                recipient_id: recipient,
                amount: amount.try_into()?,
                nonce: nonce.try_into()?,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<IdentityCreditTransferNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let rs_transition =
            IdentityCreditTransferTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error()?;

        Ok(IdentityCreditTransferNAPI(rs_transition))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityCreditTransferNAPI, napi::Error> {
        IdentityCreditTransferNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        )
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(hex: String) -> Result<IdentityCreditTransferNAPI, napi::Error> {
        IdentityCreditTransferNAPI::from_bytes(
            decode(hex.as_str(), Base64)
                .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?
                .into(),
        )
    }

    #[napi(setter, js_name = "recipientId")]
    pub fn set_recipient_id(
        &mut self,
        js_recipient: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_recipient_id(IdentifierNAPI::try_from(js_recipient)?.into()))
    }

    #[napi(setter, js_name = "senderId")]
    pub fn set_sender_id(&mut self, js_sender: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_identity_id(IdentifierNAPI::try_from(js_sender)?.into()))
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, amount: Uint64String) -> Result<(), napi::Error> {
        self.0.set_amount(amount.try_into()?);

        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: Uint64String) -> Result<(), napi::Error> {
        self.0.set_nonce(nonce.try_into()?);

        Ok(())
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, public_key_id: u32) {
        self.0.set_signature_public_key_id(public_key_id)
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, amount: u16) {
        self.0.set_user_fee_increase(amount)
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "recipientId")]
    pub fn get_recipient_id(&self) -> IdentifierNAPI {
        self.0.recipient_id().into()
    }

    #[napi(getter, js_name = "senderId")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id().into()
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> Uint64String {
        self.0.amount().into()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn get_nonce(&self) -> Uint64String {
        self.0.nonce().into()
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityCreditTransferNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreditTransfer(st) => Ok(IdentityCreditTransferNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type",
            )),
        }
    }
}

impl IdentityCreditTransferNAPI {
    pub fn set_signature_binary_data(&mut self, data: BinaryData) {
        self.0.set_signature(data)
    }
}
