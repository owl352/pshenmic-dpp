pub mod address_witness;

use dpp::address_funds::PlatformAddress;
use dpp::version::PlatformVersion;
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, PlatformAddressLikeNAPI, TryToU64},
    enums::network::NetworkNAPI,
    enums::platform_version::PlatformVersionNAPI,
    utils::WithJsError,
};

/// Bytes GroveDB charges when a platform address balance entry is created.
///
/// Not a dpp constant: it is the size the node's own fee regression suite pins down — a transfer
/// to one address that is not in state is charged 6_075_000 credits of storage, which is this
/// many bytes at `storage_disk_usage_credit_per_byte` (27_000). Paying an address that already
/// exists only updates a sum item and adds no bytes.
const PLATFORM_ADDRESS_STORAGE_BYTES: u64 = 225;

#[derive(Clone)]
#[napi(js_name = "PlatformAddressNAPI")]
pub struct PlatformAddressNAPI(PlatformAddress);

impl From<PlatformAddress> for PlatformAddressNAPI {
    fn from(platform: PlatformAddress) -> Self {
        Self(platform)
    }
}

impl From<PlatformAddressNAPI> for PlatformAddress {
    fn from(platform: PlatformAddressNAPI) -> Self {
        platform.0
    }
}

impl TryFrom<Either<&PlatformAddressNAPI, &DynamicValue>> for PlatformAddressNAPI {
    type Error = napi::Error;

    fn try_from(value: Either<&PlatformAddressNAPI, &DynamicValue>) -> Result<Self, Self::Error> {
        match value {
            Either::A(addr) => Ok(addr.clone()),
            Either::B(dyn_val) => {
                if dyn_val.is_string() {
                    PlatformAddressNAPI::from_bech32m(dyn_val.as_string().unwrap())
                } else if dyn_val.is_uint_8_array() {
                    PlatformAddressNAPI::from_bytes(dyn_val.as_bytes().unwrap().clone().into())
                } else {
                    Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Invalid Platform Address value. Must be bech32m string or bytes.",
                    ))
                }
            }
        }
    }
}

#[napi]
impl PlatformAddressNAPI {
    #[napi(constructor)]
    pub fn new(address: PlatformAddressLikeNAPI) -> Result<PlatformAddressNAPI, napi::Error> {
        PlatformAddressNAPI::try_from(address)
    }

    #[napi(js_name = "bytes")]
    pub fn address(&self) -> Uint8Array {
        Uint8Array::from(self.0.to_bytes())
    }

    /// Storage fee GroveDB charges for creating balance entries for addresses that are not in
    /// state yet.
    ///
    /// Minimum fees price a transition as if every one of its outputs pays a fresh address, but
    /// the fee actually charged is metered: paying an address that already exists writes no new
    /// bytes and costs (close to) nothing in storage, while every address created costs
    /// `PLATFORM_ADDRESS_STORAGE_BYTES` at the disk rate. Add this to a processing estimate when
    /// you know how many of your outputs are new.
    #[napi(js_name = "estimateStorageFeeForNewAddresses")]
    pub fn estimate_storage_fee_for_new_addresses(
        js_address_count: u32,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> BigIntString {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        BigIntString::from_u64(
            PLATFORM_ADDRESS_STORAGE_BYTES
                .saturating_mul(
                    platform_version
                        .fee_version
                        .storage
                        .storage_disk_usage_credit_per_byte,
                )
                .saturating_mul(js_address_count as u64),
        )
    }

    #[napi(js_name = "toAddress")]
    pub fn to_address(&self, js_network: &DynamicValue) -> Result<String, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        Ok(self.0.to_address_with_network(network.into()).to_string())
    }

    #[napi(js_name = "toBech32m")]
    pub fn to_bech32m(&self, js_network: &DynamicValue) -> Result<String, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        Ok(self.0.to_bech32m_string(network.into()).to_string())
    }

    #[napi(js_name = "isP2PKH")]
    pub fn is_p2pkh(&self) -> bool {
        self.0.is_p2pkh()
    }

    #[napi(js_name = "isP2SH")]
    pub fn is_p2sh(&self) -> bool {
        self.0.is_p2sh()
    }

    #[napi(js_name = "hash")]
    pub fn hash(&self) -> Uint8Array {
        self.0.hash().to_vec().into()
    }

    #[napi(js_name = "fromBech32m")]
    pub fn from_bech32m(bech32m: String) -> Result<Self, napi::Error> {
        Ok(PlatformAddressNAPI(
            PlatformAddress::from_bech32m_string(bech32m.as_str()).with_js_error()?,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        Ok(PlatformAddressNAPI(
            PlatformAddress::from_bytes(bytes.to_vec().as_slice()).with_js_error()?,
        ))
    }
}
