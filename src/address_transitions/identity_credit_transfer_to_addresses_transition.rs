use dpp::platform_value::string_encoding::{Encoding, decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::IdentityCreditTransferToAddressesTransition;
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::accessors::IdentityCreditTransferToAddressesTransitionAccessorsV0;
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::v0::IdentityCreditTransferToAddressesTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike,
    StateTransitionSingleSigned,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::address_transitions::entities::output_address::OutputAddressNAPI;
use crate::address_transitions::utils::js_outputs_to_outputs;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityCreditTransferToAddressesTransitionNAPI")]
pub struct IdentityCreditTransferToAddressesTransitionNAPI(
    IdentityCreditTransferToAddressesTransition,
);

impl From<IdentityCreditTransferToAddressesTransitionNAPI>
    for IdentityCreditTransferToAddressesTransition
{
    fn from(t: IdentityCreditTransferToAddressesTransitionNAPI) -> Self {
        t.0
    }
}

impl From<IdentityCreditTransferToAddressesTransition>
    for IdentityCreditTransferToAddressesTransitionNAPI
{
    fn from(value: IdentityCreditTransferToAddressesTransition) -> Self {
        IdentityCreditTransferToAddressesTransitionNAPI(value)
    }
}

#[napi]
impl IdentityCreditTransferToAddressesTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_identifier: IdentifierLikeNAPI,
        js_recipients: Vec<&OutputAddressNAPI>,
        nonce: BigIntString,
        user_fee_increase: u16,
    ) -> Result<Self, napi::Error> {
        let identifier = IdentifierNAPI::try_from(js_identifier)?;

        let addresses = js_outputs_to_outputs(js_recipients)?;

        Ok(IdentityCreditTransferToAddressesTransitionNAPI(
            IdentityCreditTransferToAddressesTransition::V0(
                IdentityCreditTransferToAddressesTransitionV0 {
                    identity_id: identifier.into(),
                    recipient_addresses: addresses,
                    nonce: nonce.try_to_u64()?,
                    user_fee_increase,
                    signature_public_key_id: 0,
                    signature: Default::default(),
                },
            ),
        ))
    }

    #[napi(getter, js_name = "identityId")]
    pub fn identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id().into()
    }

    #[napi(getter, js_name = "recipientAddresses")]
    pub fn recipient_addresses(&self) -> Vec<OutputAddressNAPI> {
        let rs_addresses = self.0.recipient_addresses();

        rs_addresses
            .iter()
            .map(|(address, credits)| OutputAddressNAPI {
                address: address.clone().into(),
                credits: BigIntString::from_u64(credits.clone()),
            })
            .collect()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.nonce())
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(getter, js_name = "signature")]
    pub fn signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;

        Ok(self.0.set_identity_id(identity_id.into()))
    }

    #[napi(setter, js_name = "recipientAddresses")]
    pub fn set_recipient_addresses(
        &mut self,
        js_addresses: Vec<&OutputAddressNAPI>,
    ) -> Result<(), napi::Error> {
        let addresses = js_outputs_to_outputs(js_addresses)?;

        Ok(self.0.set_recipient_addresses(addresses))
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_nonce(nonce.try_to_u64()?);

        Ok(())
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: u32) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
    }

    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(data: Uint8Array) -> Result<Self, napi::Error> {
        Ok(Self(
            IdentityCreditTransferToAddressesTransition::deserialize_from_bytes(
                data.to_vec().as_slice(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(data: String) -> Result<Self, napi::Error> {
        Ok(Self(
            IdentityCreditTransferToAddressesTransition::deserialize_from_bytes(
                decode(&data, Encoding::Hex)
                    .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "Invalid hex string"))?
                    .as_slice(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(data: String) -> Result<Self, napi::Error> {
        Ok(Self(
            IdentityCreditTransferToAddressesTransition::deserialize_from_bytes(
                decode(&data, Encoding::Base64)
                    .map_err(|_| {
                        napi::Error::new(napi::Status::InvalidArg, "Invalid Base64 string")
                    })?
                    .as_slice(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityCreditTransferToAddressesTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreditTransferToAddresses(st) => {
                Ok(IdentityCreditTransferToAddressesTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state IdentityCreditTransferToAddresses type",
            )),
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }
}
