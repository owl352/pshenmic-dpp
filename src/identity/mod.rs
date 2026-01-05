use crate::{
    dynamic_value::{DynamicValue, IdentifierLikeNAPI, TypeChecker, Uint64String},
    enums::platform_version::PlatformVersionNAPI,
    identifier::IdentifierNAPI,
    identity_public_key::IdentityPublicKeyNAPI,
    utils::WithJsError,
};
use dpp::{
    identity::accessors::{IdentityGettersV0, IdentitySettersV0},
    platform_value::string_encoding::{Encoding, decode},
    prelude::Identity,
};
use dpp::{
    platform_value::string_encoding::encode,
    serialization::{PlatformDeserializable, PlatformSerializable},
};
use napi::{Status, bindgen_prelude::Uint8Array};
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = IdentityNAPI)]
pub struct IdentityNAPI(Identity);

impl From<Identity> for IdentityNAPI {
    fn from(identity: Identity) -> Self {
        IdentityNAPI(identity)
    }
}

impl From<IdentityNAPI> for Identity {
    fn from(identity: IdentityNAPI) -> Self {
        identity.0
    }
}

#[napi]
impl IdentityNAPI {
    #[napi(constructor)]
    pub fn new(
        js_id: IdentifierLikeNAPI,
        js_platform_version: DynamicValue,
    ) -> Result<Self, napi::Error> {
        let id: IdentifierNAPI = js_id.try_into()?;

        let platform_version: PlatformVersionNAPI = match js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => js_platform_version.try_into()?,
        };

        Ok(IdentityNAPI(
            Identity::create_basic_identity(id.clone().into(), &platform_version.into())
                .with_js_error()?,
        ))
    }

    #[napi(setter, js_name = "id")]
    pub fn set_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let id: IdentifierNAPI = js_id.try_into()?;

        self.0.set_id(id.clone().into());

        Ok(())
    }

    #[napi(setter, js_name = "balance")]
    pub fn set_balance(&mut self, balance: Uint64String) -> Result<(), napi::Error> {
        self.0.set_balance(balance.try_into()?);
        Ok(())
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: Uint64String) -> Result<(), napi::Error> {
        self.0.set_revision(revision.try_into()?);
        Ok(())
    }

    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.0.id().into()
    }

    #[napi(getter, js_name = "balance")]
    pub fn get_balance(&self) -> Uint64String {
        self.0.balance().into()
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> Uint64String {
        self.0.revision().into()
    }

    #[napi(js_name = "addPublicKey")]
    pub fn add_public_key(&mut self, public_key: &IdentityPublicKeyNAPI) {
        self.0.add_public_key(public_key.clone().into());
    }

    #[napi(js_name = "getPublicKeyById")]
    pub fn get_public_key_by_id(&self, key_id: u32) -> Option<IdentityPublicKeyNAPI> {
        let identity_public_key = self.0.get_public_key_by_id(key_id);
        identity_public_key.map(|key| IdentityPublicKeyNAPI::from(key.clone()))
    }

    #[napi(js_name = "getPublicKeys")]
    pub fn get_public_keys(&self) -> Vec<IdentityPublicKeyNAPI> {
        let keys = self
            .0
            .public_keys()
            .iter()
            .map(|(_index, key)| IdentityPublicKeyNAPI::from(key.clone()))
            .collect();

        keys
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Encoding::Hex)
            .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?;

        IdentityNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Encoding::Base64)
            .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?;

        IdentityNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<IdentityNAPI, napi::Error> {
        Ok(Identity::deserialize_from_bytes(bytes.to_vec().as_slice())
            .with_js_error()?
            .into())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Base64,
        ))
    }
}
