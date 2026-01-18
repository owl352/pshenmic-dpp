use dpp::address_funds::PlatformAddress;
use dpp::fee::Credits;
use dpp::identity::KeyID;
use dpp::prelude::{IdentityNonce, UserFeeIncrease};
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::IdentityCreditTransferToAddressesTransition;
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::accessors::IdentityCreditTransferToAddressesTransitionAccessorsV0;
use dpp::state_transition::identity_credit_transfer_to_addresses_transition::v0::IdentityCreditTransferToAddressesTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike,
    StateTransitionSingleSigned,
};
use js_sys::Array;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_platform_address::PlatformAddressWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::IntoWasm;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "RecipientAddressWASM")]
pub struct RecipientAddressWASM {
    #[wasm_bindgen(getter_with_clone)]
    pub address: PlatformAddressWASM,
    pub amount: Credits,
}

#[wasm_bindgen]
impl RecipientAddressWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "RecipientAddressWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "RecipientAddressWASM".to_string()
    }
}

#[wasm_bindgen(js_name = "IdentityCreditTransferToAddressesTransitionWASM")]
pub struct IdentityCreditTransferToAddressesTransitionWASM(
    IdentityCreditTransferToAddressesTransition,
);

impl From<IdentityCreditTransferToAddressesTransitionWASM>
    for IdentityCreditTransferToAddressesTransition
{
    fn from(t: IdentityCreditTransferToAddressesTransitionWASM) -> Self {
        t.0
    }
}

impl From<IdentityCreditTransferToAddressesTransition>
    for IdentityCreditTransferToAddressesTransitionWASM
{
    fn from(value: IdentityCreditTransferToAddressesTransition) -> Self {
        IdentityCreditTransferToAddressesTransitionWASM(value)
    }
}

#[wasm_bindgen]
impl IdentityCreditTransferToAddressesTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "IdentityCreditTransferToAddressesTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "IdentityCreditTransferToAddressesTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        js_identifier: &JsValue,
        js_addresses: &JsValue,
        nonce: IdentityNonce,
        user_fee_increase: UserFeeIncrease,
    ) -> Result<Self, JsValue> {
        let identifier = IdentifierWASM::try_from(js_identifier)?;

        let addresses_array = Array::from(js_addresses);

        let addresses: BTreeMap<PlatformAddress, Credits> = addresses_array
            .iter()
            .map(|js_address| {
                let address = js_address
                    .to_wasm::<RecipientAddressWASM>("RecipientAddressWASM")?
                    .clone();

                Ok::<(PlatformAddress, u64), JsValue>((
                    address.address.into(),
                    address.amount.clone(),
                ))
            })
            .collect::<Result<BTreeMap<PlatformAddress, Credits>, JsValue>>()?;

        Ok(IdentityCreditTransferToAddressesTransitionWASM(
            IdentityCreditTransferToAddressesTransition::V0(
                IdentityCreditTransferToAddressesTransitionV0 {
                    identity_id: identifier.into(),
                    recipient_addresses: addresses,
                    nonce,
                    user_fee_increase,
                    signature_public_key_id: 0,
                    signature: Default::default(),
                },
            ),
        ))
    }

    #[wasm_bindgen(getter = "identityId")]
    pub fn identity_id(&self) -> IdentifierWASM {
        self.0.identity_id().into()
    }

    #[wasm_bindgen(getter = "recipientAddresses")]
    pub fn recipient_addresses(&self) -> Vec<RecipientAddressWASM> {
        let rs_addresses = self.0.recipient_addresses();

        rs_addresses
            .iter()
            .map(|(address, credits)| RecipientAddressWASM {
                address: address.clone().into(),
                amount: credits.clone(),
            })
            .collect()
    }

    #[wasm_bindgen(getter = "nonce")]
    pub fn nonce(&self) -> IdentityNonce {
        self.0.nonce()
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(getter = "signaturePublicKeyId")]
    pub fn signature_public_key_id(&self) -> KeyID {
        self.0.signature_public_key_id()
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn signature(&self) -> Vec<u8> {
        self.0.signature().to_vec()
    }

    #[wasm_bindgen(setter = "identityId")]
    pub fn set_identity_id(&mut self, js_identity_id: &JsValue) -> Result<(), JsValue> {
        let identity_id = IdentifierWASM::try_from(js_identity_id)?;

        Ok(self.0.set_identity_id(identity_id.into()))
    }

    #[wasm_bindgen(setter = "recipientAddresses")]
    pub fn set_recipient_addresses(&mut self, js_addresses: &JsValue) -> Result<(), JsValue> {
        let addresses_array = Array::from(js_addresses);

        let addresses: BTreeMap<PlatformAddress, Credits> = addresses_array
            .iter()
            .map(|js_address| {
                let address = js_address
                    .to_wasm::<RecipientAddressWASM>("RecipientAddressWASM")?
                    .clone();

                Ok::<(PlatformAddress, u64), JsValue>((
                    address.address.into(),
                    address.amount.clone(),
                ))
            })
            .collect::<Result<BTreeMap<PlatformAddress, Credits>, JsValue>>()?;

        Ok(self.0.set_recipient_addresses(addresses))
    }

    #[wasm_bindgen(setter = "nonce")]
    pub fn set_nonce(&mut self, nonce: IdentityNonce) {
        self.0.set_nonce(nonce)
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[wasm_bindgen(setter = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: KeyID) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, signature: Vec<u8>) {
        self.0.set_signature_bytes(signature)
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionWASM,
    ) -> Result<IdentityCreditTransferToAddressesTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreditTransferToAddresses(st) => {
                Ok(IdentityCreditTransferToAddressesTransitionWASM(st))
            }
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }
}
