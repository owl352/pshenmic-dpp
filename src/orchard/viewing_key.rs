use dpp::address_funds::OrchardAddress;
use grovedb_commitment_tree::{FullViewingKey, IncomingViewingKey, Scope, SpendingKey};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;
use zip32::AccountId;

use crate::{
    dynamic_value::DynamicValue, enums::scope::scope_or_external,
    orchard::orchard_address::OrchardAddressNAPI,
};

/// Raw encoding size of an Orchard full viewing key (ak || nk || rivk).
const FULL_VIEWING_KEY_SIZE: usize = 96;
/// Raw encoding size of an Orchard incoming viewing key (dk || ivk).
const INCOMING_VIEWING_KEY_SIZE: usize = 64;

/// Derives the Orchard `SpendingKey` from a BIP-39 seed via ZIP-32
/// (`m/32'/coin_type'/account'`, all hardened). `coin_type` is SLIP-44
/// (Dash = 5, testnets = 1).
pub fn spending_key_from_seed(
    seed: &[u8],
    coin_type: u32,
    account: u32,
) -> Result<SpendingKey, napi::Error> {
    let account_id = AccountId::try_from(account).map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "account must be a non-hardened index (< 2^31)",
        )
    })?;

    SpendingKey::from_zip32_seed(seed, coin_type, account_id).map_err(|e| {
        napi::Error::new(
            napi::Status::InvalidArg,
            format!("failed to derive Orchard spending key from seed: {e:?}"),
        )
    })
}

/// Derives an Orchard `FullViewingKey` from a BIP-39 seed via ZIP-32.
pub fn full_viewing_key_from_seed(
    seed: &[u8],
    coin_type: u32,
    account: u32,
) -> Result<FullViewingKey, napi::Error> {
    Ok(FullViewingKey::from(&spending_key_from_seed(
        seed, coin_type, account,
    )?))
}

/// An Orchard full viewing key: it can detect both incoming and outgoing notes
/// and compute their nullifiers (so it sees the full balance), but cannot spend.
#[derive(Clone)]
#[napi(js_name = "FullViewingKeyNAPI")]
pub struct FullViewingKeyNAPI(FullViewingKey);

impl From<FullViewingKey> for FullViewingKeyNAPI {
    fn from(value: FullViewingKey) -> Self {
        FullViewingKeyNAPI(value)
    }
}

impl From<FullViewingKeyNAPI> for FullViewingKey {
    fn from(value: FullViewingKeyNAPI) -> Self {
        value.0
    }
}

impl From<&FullViewingKeyNAPI> for FullViewingKey {
    fn from(value: &FullViewingKeyNAPI) -> Self {
        value.0.clone()
    }
}

#[napi]
impl FullViewingKeyNAPI {
    /// Derives the full viewing key from a BIP-39 seed via ZIP-32
    /// (`m/32'/coin_type'/account'`). `coin_type` is SLIP-44 (Dash = 5,
    /// testnets = 1).
    #[napi(js_name = "fromSeed")]
    pub fn from_seed(seed: Uint8Array, coin_type: u32, account: u32) -> Result<Self, napi::Error> {
        Ok(FullViewingKeyNAPI(full_viewing_key_from_seed(
            seed.as_ref(),
            coin_type,
            account,
        )?))
    }

    /// Parses a full viewing key from its 96-byte raw encoding
    /// (`ak || nk || rivk`).
    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        let raw: [u8; FULL_VIEWING_KEY_SIZE] = bytes.as_ref().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::InvalidArg,
                format!("invalid full viewing key bytes length (must be: {FULL_VIEWING_KEY_SIZE})"),
            )
        })?;

        FullViewingKey::from_bytes(&raw)
            .map(FullViewingKeyNAPI)
            .ok_or_else(|| {
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "bytes are not a valid Orchard full viewing key",
                )
            })
    }

    /// The 96-byte raw encoding of this key.
    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Uint8Array {
        Uint8Array::from(self.0.to_bytes().to_vec())
    }

    /// Derives the incoming viewing key for the given scope (default
    /// `External`) — the key that trial-decrypts notes sent to you.
    #[napi(js_name = "toIvk")]
    pub fn to_ivk(
        &self,
        js_scope: Option<&DynamicValue>,
    ) -> Result<IncomingViewingKeyNAPI, napi::Error> {
        Ok(IncomingViewingKeyNAPI(
            self.0.to_ivk(scope_or_external(js_scope)?),
        ))
    }

    /// Derives the outgoing viewing key (32 bytes) for the given scope (default
    /// `External`) — the value to pass as `sender_ovk` when building a shield so
    /// the sender can later recover its own send.
    #[napi(js_name = "toOvk")]
    pub fn to_ovk(&self, js_scope: Option<&DynamicValue>) -> Result<Uint8Array, napi::Error> {
        Ok(Uint8Array::from(
            self.0
                .to_ovk(scope_or_external(js_scope)?)
                .as_ref()
                .to_vec(),
        ))
    }

    /// The payment address at `diversifier_index` (default 0) for the given
    /// scope (default `External`).
    #[napi(js_name = "address")]
    pub fn address(
        &self,
        diversifier_index: Option<u32>,
        js_scope: Option<&DynamicValue>,
    ) -> Result<OrchardAddressNAPI, napi::Error> {
        let scope = scope_or_external(js_scope)?;
        let address = self.0.address_at(diversifier_index.unwrap_or(0), scope);

        Ok(OrchardAddressNAPI::from(OrchardAddress::from(address)))
    }

    /// The scope this address was derived under, or `null` if it does not
    /// belong to this key.
    #[napi(js_name = "scopeForAddress")]
    pub fn scope_for_address(&self, js_address: &OrchardAddressNAPI) -> Option<String> {
        let address = OrchardAddress::from(js_address).into_inner();

        self.0.scope_for_address(&address).map(|scope| match scope {
            Scope::External => "External".to_string(),
            Scope::Internal => "Internal".to_string(),
        })
    }
}

/// An Orchard incoming viewing key: it detects and decrypts notes sent to you,
/// but cannot see your outgoing notes, tell when a note is spent, or spend it.
/// Safe to hand to a watch-only service such as a merchant terminal.
#[derive(Clone)]
#[napi(js_name = "IncomingViewingKeyNAPI")]
pub struct IncomingViewingKeyNAPI(IncomingViewingKey);

impl From<IncomingViewingKey> for IncomingViewingKeyNAPI {
    fn from(value: IncomingViewingKey) -> Self {
        IncomingViewingKeyNAPI(value)
    }
}

impl From<IncomingViewingKeyNAPI> for IncomingViewingKey {
    fn from(value: IncomingViewingKeyNAPI) -> Self {
        value.0
    }
}

impl From<&IncomingViewingKeyNAPI> for IncomingViewingKey {
    fn from(value: &IncomingViewingKeyNAPI) -> Self {
        value.0.clone()
    }
}

#[napi]
impl IncomingViewingKeyNAPI {
    /// Derives the incoming viewing key from a BIP-39 seed via ZIP-32
    /// (`m/32'/coin_type'/account'`) for the given scope (default `External`).
    #[napi(js_name = "fromSeed")]
    pub fn from_seed(
        seed: Uint8Array,
        coin_type: u32,
        account: u32,
        js_scope: Option<&DynamicValue>,
    ) -> Result<Self, napi::Error> {
        let fvk = full_viewing_key_from_seed(seed.as_ref(), coin_type, account)?;

        Ok(IncomingViewingKeyNAPI(
            fvk.to_ivk(scope_or_external(js_scope)?),
        ))
    }

    /// Derives the incoming viewing key from a full viewing key for the given
    /// scope (default `External`).
    #[napi(js_name = "fromFullViewingKey")]
    pub fn from_full_viewing_key(
        js_full_viewing_key: &FullViewingKeyNAPI,
        js_scope: Option<&DynamicValue>,
    ) -> Result<Self, napi::Error> {
        js_full_viewing_key.to_ivk(js_scope)
    }

    /// Parses an incoming viewing key from its 64-byte raw encoding
    /// (`dk || ivk`).
    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        let raw: [u8; INCOMING_VIEWING_KEY_SIZE] = bytes.as_ref().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::InvalidArg,
                format!(
                    "invalid incoming viewing key bytes length (must be: {INCOMING_VIEWING_KEY_SIZE})"
                ),
            )
        })?;

        Option::from(IncomingViewingKey::from_bytes(&raw))
            .map(IncomingViewingKeyNAPI)
            .ok_or_else(|| {
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "bytes are not a valid Orchard incoming viewing key",
                )
            })
    }

    /// The 64-byte raw encoding of this key.
    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Uint8Array {
        Uint8Array::from(self.0.to_bytes().to_vec())
    }

    /// The payment address at `diversifier_index` (default 0). The scope is
    /// fixed by the key itself.
    #[napi(js_name = "address")]
    pub fn address(
        &self,
        diversifier_index: Option<u32>,
    ) -> Result<OrchardAddressNAPI, napi::Error> {
        let address = self.0.address_at(diversifier_index.unwrap_or(0));

        Ok(OrchardAddressNAPI::from(OrchardAddress::from(address)))
    }

    /// The diversifier index `address` was derived at, or `null` if the address
    /// was not derived from this key.
    #[napi(js_name = "diversifierIndex")]
    pub fn diversifier_index(&self, js_address: &OrchardAddressNAPI) -> Option<u32> {
        let address = OrchardAddress::from(js_address).into_inner();

        self.0
            .diversifier_index(&address)
            .and_then(|index| u32::try_from(index).ok())
    }
}
