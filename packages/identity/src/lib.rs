use dpp::identity::accessors::{IdentityGettersV0, IdentitySettersV0};
use dpp::identity::{Identity, KeyID};
use dpp::prelude::IdentityPublicKey;
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::version::PlatformVersion;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_public_key::IdentityPublicKeyWASM;
use pshenmic_dpp_utils::WithJsError;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityWASM")]
pub struct IdentityWASM(Identity);

#[wasm_bindgen]
impl IdentityWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: &JsValue) -> Result<IdentityWASM, JsValue> {
        let identifier: IdentifierWASM = js_identifier.try_into()?;

        let identity = Identity::create_basic_identity(identifier.into(), PlatformVersion::first())
            .with_js_error()?;

        Ok(IdentityWASM(identity))
    }

    #[wasm_bindgen(js_name = "setId")]
    pub fn set_id(&mut self, js_identifier: &JsValue) -> Result<(), JsValue> {
        Ok(self
            .0
            .set_id(IdentifierWASM::try_from(js_identifier)?.into()))
    }

    #[wasm_bindgen(js_name = "setBalance")]
    pub fn set_balance(&mut self, balance: u64) {
        self.0.set_balance(balance);
    }

    #[wasm_bindgen(js_name = "setRevision")]
    pub fn set_revision(&mut self, revision: u64) {
        self.0.set_revision(revision);
    }

    #[wasm_bindgen(js_name = "addPublicKey")]
    pub fn add_public_key(&mut self, public_key: &IdentityPublicKeyWASM) {
        self.0.add_public_key(public_key.clone().into());
    }

    // GETTERS

    #[wasm_bindgen(js_name = "getId")]
    pub fn get_id(&self) -> IdentifierWASM {
        self.0.id().into()
    }

    #[wasm_bindgen(js_name = "getBalance")]
    pub fn get_balance(&self) -> u64 {
        self.0.balance()
    }

    #[wasm_bindgen(js_name = "getRevision")]
    pub fn get_revision(&self) -> u64 {
        self.0.revision()
    }

    #[wasm_bindgen(js_name = "getPublicKeyById")]
    pub fn get_public_key_by_id(&self, key_id: KeyID) -> IdentityPublicKeyWASM {
        let identity_public_key = self.0.get_public_key_by_id(key_id);
        IdentityPublicKeyWASM::from(identity_public_key.unwrap().clone())
    }

    #[wasm_bindgen(js_name = "getPublicKeys")]
    pub fn get_public_keys(&self) -> Vec<IdentityPublicKeyWASM> {
        let keys = self
            .0
            .public_keys()
            .iter()
            .map(|(_index, key)| IdentityPublicKeyWASM::from(key.clone()))
            .collect();

        keys
    }

    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0.serialize_to_bytes().with_js_error()
    }

    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<IdentityWASM, JsValue> {
        match Identity::deserialize_from_bytes(bytes.as_slice()).with_js_error() {
            Ok(identity) => Ok(IdentityWASM(identity)),
            Err(err) => Err(err),
        }
    }
}

impl IdentityWASM {
    pub fn get_rs_public_keys(&self) -> BTreeMap<KeyID, IdentityPublicKey> {
        self.0.public_keys().clone()
    }
}
