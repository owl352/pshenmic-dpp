use dpp::shielded::{MEMO_PAYLOAD_SIZE, MEMO_SIZE, ShieldedMemo};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[napi(js_name = "ShieldedMemoNAPI")]
#[derive(Clone)]
pub struct ShieldedMemoNAPI(ShieldedMemo);

impl From<ShieldedMemo> for ShieldedMemoNAPI {
    fn from(value: ShieldedMemo) -> Self {
        ShieldedMemoNAPI(value)
    }
}

impl From<ShieldedMemoNAPI> for ShieldedMemo {
    fn from(value: ShieldedMemoNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ShieldedMemoNAPI {
    #[napi(js_name = "fromString")]
    pub fn from_string(value: String) -> Result<Self, napi::Error> {
        // Delegate so the length rule stays defined in exactly one place.
        ShieldedMemo::text(value)
            .map(ShieldedMemoNAPI)
            .map_err(|error| napi::Error::new(napi::Status::InvalidArg, error.to_string()))
    }

    #[napi(js_name = "empty")]
    pub fn empty() -> ShieldedMemoNAPI {
        ShieldedMemoNAPI(ShieldedMemo::Empty)
    }

    /// A payment reference (protocol version 15): what the payment is for, in a value
    /// the payee chose and gave to the payer (an invoice or order number), padded on
    /// the right with zero bytes. 1 to 32 bytes; an empty or all-zero reference is
    /// refused.
    #[napi(js_name = "fromPaymentRef")]
    pub fn from_payment_ref(reference: Uint8Array) -> Result<Self, napi::Error> {
        ShieldedMemo::payment_ref(reference.to_vec().as_slice())
            .map(ShieldedMemoNAPI)
            .map_err(|error| napi::Error::new(napi::Status::InvalidArg, error.to_string()))
    }

    /// The 32-byte reference of a `PaymentRef` memo, or `None` for another kind.
    #[napi(getter, js_name = "paymentRef")]
    pub fn payment_ref(&self) -> Option<Uint8Array> {
        match &self.0 {
            ShieldedMemo::PaymentRef(reference) => Some(reference.to_vec().into()),
            _ => None,
        }
    }

    #[napi(js_name = "other")]
    pub fn other(kind: u32, payload: Uint8Array) -> Result<Self, napi::Error> {
        if payload.len() != MEMO_PAYLOAD_SIZE {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!(
                    "Memo payload must be exactly {MEMO_PAYLOAD_SIZE} bytes, got {}",
                    payload.len()
                ),
            ));
        }

        Ok(ShieldedMemoNAPI(ShieldedMemo::Other {
            kind,
            payload: payload.to_vec().as_slice().try_into().unwrap(),
        }))
    }

    #[napi(js_name = "toString")]
    pub fn to_string(&self) -> Result<String, napi::Error> {
        match &self.0 {
            ShieldedMemo::Empty => Ok(String::new()),
            ShieldedMemo::Text(text) => Ok(text.clone()),
            ShieldedMemo::PaymentRef(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "memo is a payment reference, not text; use paymentRef or toBytes instead",
            )),
            ShieldedMemo::Other { kind, .. } => Err(napi::Error::new(
                napi::Status::GenericFailure,
                format!("memo of kind {kind} is not text; use toBytes instead"),
            )),
        }
    }

    #[napi(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.0.to_bytes().clone().into()
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        let fixed: [u8; MEMO_SIZE] = bytes.to_vec().as_slice().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::InvalidArg,
                format!(
                    "ShieldedMemo bytes must be exactly {MEMO_SIZE} bytes, got {}",
                    bytes.len()
                ),
            )
        })?;

        Ok(ShieldedMemoNAPI(ShieldedMemo::from_bytes(&fixed)))
    }
}
