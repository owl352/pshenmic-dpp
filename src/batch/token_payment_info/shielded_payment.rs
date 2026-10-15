use dpp::tokens::token_payment_info::v1::TokenShieldedPayment;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, TryToU64};
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::utils::{js_bytes_to_anchor, js_bytes_to_binding_signature};

/// The spend bundle paying a document's token cost out of the token's shielded pool
#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenShieldedPaymentNAPI")]
pub struct TokenShieldedPaymentNAPI(TokenShieldedPayment);

impl From<TokenShieldedPayment> for TokenShieldedPaymentNAPI {
    fn from(value: TokenShieldedPayment) -> Self {
        Self(value)
    }
}

impl From<TokenShieldedPaymentNAPI> for TokenShieldedPayment {
    fn from(value: TokenShieldedPaymentNAPI) -> Self {
        value.0
    }
}

#[napi]
impl TokenShieldedPaymentNAPI {
    #[napi(constructor)]
    pub fn new(
        js_amount: BigIntString,
        js_actions: Vec<&SerializedActionNAPI>,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
    ) -> Result<TokenShieldedPaymentNAPI, napi::Error> {
        Ok(TokenShieldedPaymentNAPI(TokenShieldedPayment {
            amount: js_amount.try_to_u64()?,
            actions: js_actions.into_iter().map(|a| a.clone().into()).collect(),
            anchor: js_bytes_to_anchor(js_anchor)?,
            proof: js_proof.to_vec(),
            binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
        }))
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        BigIntString::from_u64(self.0.amount)
    }

    #[napi(getter, js_name = "actions")]
    pub fn get_actions(&self) -> Vec<SerializedActionNAPI> {
        self.0.actions.iter().map(|a| a.clone().into()).collect()
    }

    #[napi(getter, js_name = "anchor")]
    pub fn get_anchor(&self) -> Uint8Array {
        self.0.anchor.to_vec().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn get_proof(&self) -> Uint8Array {
        self.0.proof.clone().into()
    }

    #[napi(getter, js_name = "bindingsSignature")]
    pub fn get_binding_signature(&self) -> Uint8Array {
        self.0.binding_signature.to_vec().into()
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, js_amount: BigIntString) -> Result<(), napi::Error> {
        self.0.amount = js_amount.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "actions")]
    pub fn set_actions(&mut self, js_actions: Vec<&SerializedActionNAPI>) {
        self.0.actions = js_actions.into_iter().map(|a| a.clone().into()).collect();
    }

    #[napi(setter, js_name = "anchor")]
    pub fn set_anchor(&mut self, js_anchor: Uint8Array) -> Result<(), napi::Error> {
        self.0.anchor = js_bytes_to_anchor(js_anchor)?;
        Ok(())
    }

    #[napi(setter, js_name = "proof")]
    pub fn set_proof(&mut self, js_proof: Uint8Array) {
        self.0.proof = js_proof.to_vec();
    }

    #[napi(setter, js_name = "bindingsSignature")]
    pub fn set_binding_signature(
        &mut self,
        js_binding_signature: Uint8Array,
    ) -> Result<(), napi::Error> {
        self.0.binding_signature = js_bytes_to_binding_signature(js_binding_signature)?;
        Ok(())
    }
}
