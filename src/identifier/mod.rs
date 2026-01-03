use crate::dynamic_value::DynamicValue;
use dpp::identifier::Identifier;
use dpp::platform_value::string_encoding::Encoding;
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "IdentifierNAPI")]
pub struct IdentifierNAPI(Identifier);

impl From<Identifier> for IdentifierNAPI {
    fn from(id: Identifier) -> Self {
        IdentifierNAPI(id)
    }
}

impl From<&Identifier> for IdentifierNAPI {
    fn from(id: &Identifier) -> Self {
        IdentifierNAPI(id.clone())
    }
}

impl From<IdentifierNAPI> for Identifier {
    fn from(value: IdentifierNAPI) -> Self {
        Identifier::from(value.0)
    }
}

impl From<&IdentifierNAPI> for Identifier {
    fn from(value: &IdentifierNAPI) -> Self {
        Identifier::from(value.0.clone())
    }
}

impl TryFrom<Either<&IdentifierNAPI, DynamicValue>> for IdentifierNAPI {
    type Error = napi::Error;

    fn try_from(value: Either<&IdentifierNAPI, DynamicValue>) -> Result<Self, Self::Error> {
        match value {
            Either::A(id) => Ok(id.clone()),
            Either::B(dyn_val) => match dyn_val {
                DynamicValue::Text(txt) => {
                    if txt.len() == 64 {
                        return IdentifierNAPI::from_hex(txt);
                    } else {
                        return IdentifierNAPI::from_base58(txt);
                    }
                }
                DynamicValue::Bytes(uint8_array) => IdentifierNAPI::from_bytes(uint8_array),
                _ => Err(napi::Error::new(
                    napi::Status::InvalidArg,
                    "Invalid Identifier value",
                )),
            },
        }
    }
}

#[napi]
impl IdentifierNAPI {
    #[napi(constructor)]
    pub fn new(js_id: DynamicValue) -> Result<IdentifierNAPI, napi::Error> {
        match js_id {
            DynamicValue::Text(str) => Ok(IdentifierNAPI(
                Identifier::from_string(str.as_str(), Encoding::Base58)
                    .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
                    .clone(),
            )),
            DynamicValue::Bytes(bytes) => Ok(IdentifierNAPI(
                Identifier::from_vec(bytes.to_vec()).map_err(|err| {
                    napi::Error::new(napi::Status::GenericFailure, err.to_string())
                })?,
            )),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Bad identifier type",
            ))?,
        }
    }
}

#[napi]
impl IdentifierNAPI {
    #[napi(js_name = "base58")]
    pub fn base58(&self) -> String {
        self.0.to_string(Encoding::Base58)
    }

    #[napi(js_name = "hex")]
    pub fn hex(&self) -> String {
        self.0.to_string(Encoding::Hex)
    }

    #[napi(js_name = "base64")]
    pub fn base64(&self) -> String {
        self.0.to_string(Encoding::Base64)
    }

    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Uint8Array {
        self.0.to_vec().into()
    }

    #[napi(js_name = "fromBase58")]
    pub fn from_base58(base58: String) -> Result<IdentifierNAPI, napi::Error> {
        let identitfier = Identifier::from_string(base58.as_str(), Encoding::Base58)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(IdentifierNAPI(identitfier))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentifierNAPI, napi::Error> {
        let identitfier = Identifier::from_string(base64.as_str(), Encoding::Base64)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(IdentifierNAPI(identitfier))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentifierNAPI, napi::Error> {
        let identitfier = Identifier::from_string(hex.as_str(), Encoding::Hex)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(IdentifierNAPI(identitfier))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<IdentifierNAPI, napi::Error> {
        let identifier = Identifier::from_vec(bytes.to_vec())
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

        Ok(IdentifierNAPI(identifier))
    }
}

impl IdentifierNAPI {
    pub fn to_slice(&self) -> [u8; 32] {
        self.0.as_bytes().clone()
    }
}
