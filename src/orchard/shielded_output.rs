use dpp::{
    address_funds::OrchardAddress,
    shielded::{MEMO_SIZE, ShieldedMemo},
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, TryToU64},
    orchard::{memo::ShieldedMemoNAPI, orchard_address::OrchardAddressNAPI},
};

/// One output of a multi-output shielded transfer: the Orchard address that
/// receives the note, its value in credits, and the memo carried inside the
/// note's encrypted ciphertext.
///
/// The single-recipient builders take the recipient, amount and memo as three
/// flat arguments; fanning out to N recipients needs them grouped, so each
/// output carries its own memo rather than sharing one across the bundle.
#[derive(Clone)]
#[napi(js_name = "ShieldedOutputNAPI")]
pub struct ShieldedOutputNAPI {
    address: OrchardAddress,
    amount: u64,
    memo: ShieldedMemo,
}

impl ShieldedOutputNAPI {
    /// The output in the form the Orchard builder consumes.
    pub(crate) fn to_parts(&self) -> (OrchardAddress, u64, [u8; MEMO_SIZE]) {
        (self.address, self.amount, self.memo.to_bytes())
    }
}

#[napi]
impl ShieldedOutputNAPI {
    /// The memo crosses the base <-> shielded instance boundary as bytes:
    /// `ShieldedMemoNAPI` is base-kept, so its wrapped napi object cannot be
    /// recovered from this (shielded) instance's per-Env wrap map.
    #[napi(constructor)]
    pub fn new(
        js_address: &OrchardAddressNAPI,
        js_amount: BigIntString,
        js_memo: Uint8Array,
    ) -> Result<Self, napi::Error> {
        Ok(ShieldedOutputNAPI {
            address: js_address.into(),
            amount: js_amount.try_to_u64()?,
            memo: ShieldedMemoNAPI::from_bytes(js_memo)?.into(),
        })
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> OrchardAddressNAPI {
        self.address.into()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, js_address: &OrchardAddressNAPI) {
        self.address = js_address.into();
    }

    #[napi(getter, js_name = "amount")]
    pub fn amount(&self) -> BigIntString {
        BigIntString::from_u64(self.amount)
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, js_amount: BigIntString) -> Result<(), napi::Error> {
        self.amount = js_amount.try_to_u64()?;

        Ok(())
    }

    /// The memo as bytes, so the JS wrapper can re-wrap it into a base-typed
    /// `ShieldedMemoWASM` (a shielded-instance raw would leak across the
    /// boundary).
    #[napi(getter, js_name = "memo")]
    pub fn memo(&self) -> Uint8Array {
        self.memo.to_bytes().into()
    }

    #[napi(setter, js_name = "memo")]
    pub fn set_memo(&mut self, js_memo: Uint8Array) -> Result<(), napi::Error> {
        self.memo = ShieldedMemoNAPI::from_bytes(js_memo)?.into();

        Ok(())
    }
}
