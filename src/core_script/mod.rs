use dpp::dashcore::address::Payload;
use dpp::dashcore::{Address, opcodes};
use dpp::identity::core_script::CoreScript;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::encode;
use napi::Status;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::enums::network::NetworkNAPI;

#[napi(js_name = "CoreScriptNAPI")]
#[derive(Clone)]
pub struct CoreScriptNAPI(CoreScript);

impl From<CoreScriptNAPI> for CoreScript {
    fn from(value: CoreScriptNAPI) -> Self {
        value.0
    }
}

impl From<CoreScript> for CoreScriptNAPI {
    fn from(value: CoreScript) -> Self {
        CoreScriptNAPI(value)
    }
}

#[napi]
impl CoreScriptNAPI {
    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Self {
        CoreScriptNAPI(CoreScript::from_bytes(bytes.to_vec()))
    }

    #[napi(js_name = "newP2PKH")]
    pub fn new_p2pkh(js_key_hash: Uint8Array) -> Self {
        let js_key_hash_vec = js_key_hash.to_vec();

        let mut key_hash = [0u8; 20];
        let bytes = js_key_hash_vec.as_slice();
        let len = bytes.len().min(32);
        key_hash[..len].copy_from_slice(&bytes[..len]);

        CoreScriptNAPI(CoreScript::new_p2pkh(key_hash))
    }

    #[napi(js_name = "newP2SH")]
    pub fn new_p2sh(js_script_hash: Uint8Array) -> Self {
        let js_script_hash_vec = js_script_hash.to_vec();

        let mut script_hash = [0u8; 20];
        let bytes = js_script_hash_vec.as_slice();
        let len = bytes.len().min(32);
        script_hash[..len].copy_from_slice(&bytes[..len]);

        let mut bytes = vec![
            opcodes::all::OP_HASH160.to_u8(),
            opcodes::all::OP_PUSHBYTES_20.to_u8(),
        ];
        bytes.extend_from_slice(&script_hash);
        bytes.push(opcodes::all::OP_EQUAL.to_u8());

        Self::from_bytes(bytes.into())
    }

    #[napi(js_name = "toAddress")]
    pub fn to_address(&self, network: NetworkNAPI) -> Result<String, napi::Error> {
        let payload = Payload::from_script(self.0.as_script())
            .map_err(|e| napi::Error::new(Status::GenericFailure, e.to_string()))?;

        let address = Address::new(network.into(), payload);

        Ok(address.to_string())
    }

    #[napi(js_name = "toString")]
    pub fn to_string(&self) -> String {
        self.0.to_string(Base64)
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.0.to_bytes().into()
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> String {
        encode(self.0.to_bytes().as_slice(), Hex)
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> String {
        encode(self.0.to_bytes().as_slice(), Base64)
    }

    #[napi(js_name = "ASMString")]
    pub fn to_asm_string(&self) -> String {
        self.0.to_asm_string()
    }
}
