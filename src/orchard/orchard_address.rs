use dpp::address_funds::{ORCHARD_ADDRESS_SIZE, OrchardAddress};
use grovedb_commitment_tree::{FullViewingKey, Scope, SpendingKey};
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;
use zip32::AccountId;

use crate::{dynamic_value::DynamicValue, enums::network::NetworkNAPI, utils::WithJsError};

/// Derives an Orchard `FullViewingKey` from a BIP-39 seed via ZIP-32
/// (`m/32'/coin_type'/account'`, all hardened). `coin_type` is SLIP-44
/// (Dash = 5, testnets = 1).
fn full_viewing_key_from_seed(
    seed: &[u8],
    coin_type: u32,
    account: u32,
) -> Result<FullViewingKey, napi::Error> {
    let account_id = AccountId::try_from(account).map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "account must be a non-hardened index (< 2^31)",
        )
    })?;

    let spending_key = SpendingKey::from_zip32_seed(seed, coin_type, account_id).map_err(|e| {
        napi::Error::new(
            napi::Status::InvalidArg,
            format!("failed to derive Orchard spending key from seed: {e:?}"),
        )
    })?;

    Ok(FullViewingKey::from(&spending_key))
}

#[derive(Clone)]
#[napi(js_name = "OrchardAddressNAPI")]
pub struct OrchardAddressNAPI(OrchardAddress);

impl From<OrchardAddress> for OrchardAddressNAPI {
    fn from(value: OrchardAddress) -> Self {
        OrchardAddressNAPI(value)
    }
}

impl From<OrchardAddressNAPI> for OrchardAddress {
    fn from(value: OrchardAddressNAPI) -> Self {
        value.0
    }
}

impl From<&OrchardAddressNAPI> for OrchardAddress {
    fn from(value: &OrchardAddressNAPI) -> Self {
        value.0.clone()
    }
}

impl TryFrom<Either<&OrchardAddressNAPI, &DynamicValue>> for OrchardAddressNAPI {
    type Error = napi::Error;

    fn try_from(value: Either<&OrchardAddressNAPI, &DynamicValue>) -> Result<Self, Self::Error> {
        match value {
            Either::A(addr) => Ok(addr.clone()),
            Either::B(dyn_val) => {
                if dyn_val.is_string() {
                    OrchardAddressNAPI::from_bech32m(dyn_val.as_string().unwrap())
                } else if dyn_val.is_uint_8_array() {
                    OrchardAddressNAPI::from_bytes(dyn_val.as_bytes().unwrap().clone().into())
                } else {
                    Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Invalid Orchard Address value. Must be bech32m string or bytes.",
                    ))
                }
            }
        }
    }
}

#[napi]
impl OrchardAddressNAPI {
    #[napi(js_name = "fromBech32m")]
    pub fn from_bech32m(bech32m: String) -> Result<Self, napi::Error> {
        Ok(OrchardAddressNAPI(
            OrchardAddress::from_bech32m_string(bech32m.as_str()).with_js_error()?,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        if bytes.len() != ORCHARD_ADDRESS_SIZE {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!("invalid orchard address bytes length (must be: {ORCHARD_ADDRESS_SIZE})"),
            ));
        }

        let raw: [u8; ORCHARD_ADDRESS_SIZE] = bytes.to_vec().as_slice().try_into().unwrap();

        Ok(OrchardAddressNAPI(
            OrchardAddress::from_raw_bytes(&raw).with_js_error()?,
        ))
    }

    #[napi(js_name = "toBech32m")]
    pub fn to_bech32m(&self, js_network: &DynamicValue) -> Result<String, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        Ok(self.0.to_bech32m_string(network.into()).to_string())
    }

    /// Derives the Orchard payment address from a BIP-39 seed via ZIP-32
    /// (`m/32'/coin_type'/account'`). `diversifier_index` selects the diversified
    /// address (default 0). `coin_type` is SLIP-44 (Dash = 5, testnets = 1).
    #[napi(js_name = "fromSeed")]
    pub fn from_seed(
        seed: Uint8Array,
        coin_type: u32,
        account: u32,
        diversifier_index: Option<u32>,
    ) -> Result<Self, napi::Error> {
        let fvk = full_viewing_key_from_seed(seed.as_ref(), coin_type, account)?;
        let payment_address = fvk.address_at(diversifier_index.unwrap_or(0), Scope::External);

        Ok(OrchardAddressNAPI(
            OrchardAddress::from_raw_bytes(&payment_address.to_raw_address_bytes())
                .with_js_error()?,
        ))
    }

    #[napi(js_name = "bytes")]
    pub fn address(&self) -> Uint8Array {
        Uint8Array::from(self.0.to_raw_bytes().to_vec())
    }
}

/// Derives the sender's Orchard outgoing viewing key (External scope, 32 bytes)
/// from a BIP-39 seed via ZIP-32 — the value to pass as `sender_ovk` to
/// `shieldFromAssetLock` so the sender can later recover its own send.
#[napi(js_name = "orchardOvkFromSeed")]
pub fn orchard_ovk_from_seed(
    seed: Uint8Array,
    coin_type: u32,
    account: u32,
) -> Result<Uint8Array, napi::Error> {
    let fvk = full_viewing_key_from_seed(seed.as_ref(), coin_type, account)?;

    Ok(Uint8Array::from(
        fvk.to_ovk(Scope::External).as_ref().to_vec(),
    ))
}
