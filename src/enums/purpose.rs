use dpp::identity::Purpose;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "PurposeNAPI")]
pub enum PurposeNAPI {
    AUTHENTICATION = 0,
    ENCRYPTION = 1,
    DECRYPTION = 2,
    TRANSFER = 3,
    SYSTEM = 4,
    VOTING = 5,
    OWNER = 6,
}

impl From<Purpose> for PurposeNAPI {
    fn from(value: Purpose) -> Self {
        match value {
            Purpose::AUTHENTICATION => PurposeNAPI::AUTHENTICATION,
            Purpose::ENCRYPTION => PurposeNAPI::ENCRYPTION,
            Purpose::DECRYPTION => PurposeNAPI::DECRYPTION,
            Purpose::TRANSFER => PurposeNAPI::TRANSFER,
            Purpose::SYSTEM => PurposeNAPI::SYSTEM,
            Purpose::VOTING => PurposeNAPI::VOTING,
            Purpose::OWNER => PurposeNAPI::OWNER,
        }
    }
}

impl From<PurposeNAPI> for Purpose {
    fn from(purpose: PurposeNAPI) -> Self {
        match purpose {
            PurposeNAPI::AUTHENTICATION => Purpose::AUTHENTICATION,
            PurposeNAPI::ENCRYPTION => Purpose::ENCRYPTION,
            PurposeNAPI::DECRYPTION => Purpose::DECRYPTION,
            PurposeNAPI::TRANSFER => Purpose::TRANSFER,
            PurposeNAPI::SYSTEM => Purpose::SYSTEM,
            PurposeNAPI::VOTING => Purpose::VOTING,
            PurposeNAPI::OWNER => Purpose::OWNER,
        }
    }
}

impl From<PurposeNAPI> for String {
    fn from(value: PurposeNAPI) -> Self {
        match value {
            PurposeNAPI::AUTHENTICATION => String::from("AUTHENTICATION"),
            PurposeNAPI::ENCRYPTION => String::from("ENCRYPTION"),
            PurposeNAPI::DECRYPTION => String::from("DECRYPTION"),
            PurposeNAPI::TRANSFER => String::from("TRANSFER"),
            PurposeNAPI::SYSTEM => String::from("SYSTEM"),
            PurposeNAPI::VOTING => String::from("VOTING"),
            PurposeNAPI::OWNER => String::from("OWNER"),
        }
    }
}

impl TryFrom<u64> for PurposeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(PurposeNAPI::AUTHENTICATION),
            1 => Ok(PurposeNAPI::ENCRYPTION),
            2 => Ok(PurposeNAPI::DECRYPTION),
            3 => Ok(PurposeNAPI::TRANSFER),
            4 => Ok(PurposeNAPI::SYSTEM),
            5 => Ok(PurposeNAPI::VOTING),
            6 => Ok(PurposeNAPI::OWNER),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid purpose value",
            )),
        }
    }
}

impl TryFrom<String> for PurposeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "authentication" => Ok(PurposeNAPI::AUTHENTICATION),
            "encryption" => Ok(PurposeNAPI::ENCRYPTION),
            "decryption" => Ok(PurposeNAPI::DECRYPTION),
            "transfer" => Ok(PurposeNAPI::TRANSFER),
            "system" => Ok(PurposeNAPI::SYSTEM),
            "voting" => Ok(PurposeNAPI::VOTING),
            "owner" => Ok(PurposeNAPI::OWNER),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid purpose value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for PurposeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            PurposeNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            PurposeNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid purpose value",
            ))
        }
    }
}
