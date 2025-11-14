use crate::dynamic_value::DynamicValue;
use dpp::identifier::Identifier;
use dpp::platform_value::string_encoding::Encoding;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "IdentifierNAPI")]
pub struct IdentifierNAPI {
    id: Identifier,
}

impl From<Identifier> for IdentifierNAPI {
    fn from(id: Identifier) -> Self {
        IdentifierNAPI { id }
    }
}

impl From<IdentifierNAPI> for Identifier {
    fn from(value: IdentifierNAPI) -> Self {
        Identifier::from(value.id)
    }
}

#[napi]
impl IdentifierNAPI {
    #[napi(constructor)]
    pub fn new(js_id: DynamicValue) -> Result<IdentifierNAPI, napi::Error> {
        match js_id {
            DynamicValue::Text(str) => Ok(IdentifierNAPI {
                id: Identifier::from_string(str.as_str(), Encoding::Base58).map_err(|err| {
                    napi::Error::new(napi::Status::GenericFailure, err.to_string())
                })?,
            }),
            DynamicValue::Bytes(bytes) => Ok(IdentifierNAPI {
                id: Identifier::from_vec(bytes.to_vec()).map_err(|err| {
                    napi::Error::new(napi::Status::GenericFailure, err.to_string())
                })?,
            }),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Bad identifier type",
            ))?,
        }
    }

    #[napi]
    pub fn base58(&self) -> String {
        self.id.to_string(Encoding::Base58)
    }

    #[napi]
    pub fn hex(&self) -> String {
        self.id.to_string(Encoding::Hex)
    }

    #[napi]
    pub fn base64(&self) -> String {
        self.id.to_string(Encoding::Base64)
    }

    #[napi]
    pub fn bytes(&self) -> Uint8Array {
        self.id.to_vec().into()
    }
}

impl IdentifierNAPI {
    pub fn to_slice(&self) -> [u8; 32] {
        self.id.as_bytes().clone()
    }
}
