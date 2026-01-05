use std::collections::{BTreeMap, BTreeSet};

use dpp::identity::{IdentityPublicKey, PartialIdentity};
use napi_derive::napi;

use crate::{
    dynamic_value::{IdentifierLikeNAPI, Uint64String},
    identifier::IdentifierNAPI,
    identity_public_key::IdentityPublicKeyNAPI,
};

#[derive(Clone)]
#[napi(js_name = "PartialIdentityNAPI")]
pub struct PartialIdentityNAPI(PartialIdentity);

impl From<PartialIdentity> for PartialIdentityNAPI {
    fn from(value: PartialIdentity) -> Self {
        Self(value)
    }
}

#[napi]
impl PartialIdentityNAPI {
    #[napi(constructor)]
    pub fn new(
        js_id: IdentifierLikeNAPI,
        js_loaded_public_keys: BTreeMap<String, &IdentityPublicKeyNAPI>,
        balance: Option<Uint64String>,
        revision: Option<Uint64String>,
        js_not_found_public_keys: Option<Vec<u32>>,
    ) -> Result<Self, napi::Error> {
        let id = IdentifierNAPI::try_from(js_id)?;
        let loaded_public_keys: BTreeMap<u32, IdentityPublicKey> = js_loaded_public_keys
            .into_iter()
            .map(|(k, v)| (k.parse().unwrap(), IdentityPublicKey::from(v.clone())))
            .collect();

        Ok(PartialIdentityNAPI(PartialIdentity {
            id: id.into(),
            loaded_public_keys,
            balance: balance.map(|b| b.try_into()).transpose()?,
            revision: revision.map(|r| r.try_into()).transpose()?,
            not_found_public_keys: js_not_found_public_keys
                .map(|arr| BTreeSet::from_iter(arr.into_iter()))
                .unwrap_or(BTreeSet::new()),
        }))
    }

    #[napi(getter, js_name = "id")]
    pub fn id(&self) -> IdentifierNAPI {
        self.0.id.into()
    }

    #[napi(getter, js_name = "loadedPublicKeys")]
    pub fn loaded_public_keys(&self) -> BTreeMap<String, IdentityPublicKeyNAPI> {
        self.0
            .loaded_public_keys
            .clone()
            .iter()
            .map(|(k, v)| (k.to_string(), v.clone().into()))
            .collect()
    }

    #[napi(getter, js_name = "balance")]
    pub fn balance(&self) -> Option<Uint64String> {
        self.0.balance.map(Into::into)
    }

    #[napi(getter, js_name = "revision")]
    pub fn revision(&self) -> Option<Uint64String> {
        self.0.revision.map(Into::into)
    }

    #[napi(getter, js_name = "notFoundPublicKeys")]
    pub fn not_found_public_keys(&self) -> Vec<u32> {
        Vec::from_iter(self.0.not_found_public_keys.clone().into_iter())
    }

    #[napi(setter, js_name = "id")]
    pub fn set_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let identifier = IdentifierNAPI::try_from(js_id)?;

        self.0.id = identifier.into();

        Ok(())
    }

    #[napi(setter, js_name = "loadedPublicKeys")]
    pub fn set_loaded_public_keys(
        &mut self,
        loaded_public_keys: BTreeMap<String, &IdentityPublicKeyNAPI>,
    ) {
        self.0.loaded_public_keys = loaded_public_keys
            .into_iter()
            .map(|(k, v)| (k.parse().unwrap(), IdentityPublicKey::from(v.clone())))
            .collect();
    }

    #[napi(setter, js_name = "balance")]
    pub fn set_balance(&mut self, balance: Option<Uint64String>) -> Result<(), napi::Error> {
        self.0.balance = balance.map(|bal| bal.try_into()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: Option<Uint64String>) -> Result<(), napi::Error> {
        self.0.revision = revision.map(|rev| rev.try_into()).transpose()?;
        Ok(())
    }

    #[napi(setter, js_name = "notFoundPublicKeys")]
    pub fn set_not_found_public_keys(&mut self, keys: Option<Vec<u32>>) {
        self.0.not_found_public_keys = keys
            .map(|k| BTreeSet::from_iter(k.into_iter()))
            .unwrap_or(BTreeSet::new());
    }
}
