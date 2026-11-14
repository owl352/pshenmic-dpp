use dpp::{address_funds::PlatformAddress, bincode, fee::Credits, prelude::AddressNonce};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, PlatformAddressLikeNAPI, TryToU64};
use crate::platform_address::PlatformAddressNAPI;

#[derive(Clone)]
#[napi(js_name = "InputAddressNAPI")]
pub struct InputAddressNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) nonce: u32,
    pub(crate) credits: BigIntString,
}

#[napi]
impl InputAddressNAPI {
    #[napi(constructor)]
    pub fn new(
        address: PlatformAddressLikeNAPI,
        nonce: u32,
        credits: BigIntString,
    ) -> Result<Self, napi::Error> {
        Ok(InputAddressNAPI {
            address: PlatformAddressNAPI::try_from(address)?,
            nonce,
            credits,
        })
    }

    /// Bincode encoding of the domain input `(PlatformAddress, (AddressNonce,
    /// Credits))` — the exact shape `js_inputs_to_inputs` feeds the builder.
    /// There is no standalone `InputAddress` domain type; the tuple's components
    /// carry the consensus `Encode`/`DecodeUntrusted` derives.
    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Result<Uint8Array, napi::Error> {
        let input: (PlatformAddress, (AddressNonce, Credits)) = (
            self.address.clone().into(),
            (self.nonce, self.credits.try_to_u64()?),
        );

        let config = bincode::config::standard().with_big_endian();

        Ok(bincode::encode_to_vec(input, config)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
            .into())
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        let config = bincode::config::standard().with_big_endian();

        let ((address, (nonce, credits)), _) = bincode::decode_from_slice_untrusted::<
            (PlatformAddress, (AddressNonce, Credits)),
            _,
        >(&bytes.to_vec(), config)
        .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Ok(InputAddressNAPI {
            address: address.into(),
            nonce,
            credits: BigIntString::from_u64(credits),
        })
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn nonce(&self) -> u32 {
        self.nonce
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> BigIntString {
        self.credits.clone()
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, address: PlatformAddressLikeNAPI) -> Result<(), napi::Error> {
        self.address = PlatformAddressNAPI::try_from(address)?;

        Ok(())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: u32) {
        self.nonce = nonce
    }

    #[napi(setter, js_name = "credits")]
    pub fn set_credits(&mut self, credits: BigIntString) {
        self.credits = credits
    }
}
