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

impl TryFrom<Either<&IdentifierNAPI, &DynamicValue>> for IdentifierNAPI {
    type Error = napi::Error;

    fn try_from(value: Either<&IdentifierNAPI, &DynamicValue>) -> Result<Self, Self::Error> {
        match value {
            Either::A(id) => Ok(id.clone()),
            Either::B(dyn_val) => {
                if dyn_val.is_string() {
                    let txt = dyn_val.as_string().unwrap();
                    if txt.len() == 64 {
                        return IdentifierNAPI::from_hex(txt);
                    } else {
                        return IdentifierNAPI::from_base58(txt);
                    }
                } else if dyn_val.is_uint_8_array() {
                    let uint8_array = dyn_val.as_uint_8_array().unwrap();
                    IdentifierNAPI::from_bytes(Uint8Array::from(uint8_array.to_vec()))
                } else {
                    Err(napi::Error::new(
                        napi::Status::InvalidArg,
                        "Invalid Identifier value",
                    ))
                }
            }
        }
    }
}

impl TryFrom<&DynamicValue> for IdentifierNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let either: Either<&IdentifierNAPI, &DynamicValue> = Either::B(value);

        either.try_into()
    }
}

#[napi]
impl IdentifierNAPI {
    #[napi(constructor)]
    pub fn new(js_id: &DynamicValue) -> Result<IdentifierNAPI, napi::Error> {
        js_id.try_into()
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
