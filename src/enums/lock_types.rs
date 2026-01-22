use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "AssetLockProofTypeNAPI")]
pub enum AssetLockProofTypeNAPI {
    Instant = 0,
    Chain = 1,
}

impl From<AssetLockProofTypeNAPI> for String {
    fn from(value: AssetLockProofTypeNAPI) -> Self {
        match value {
            AssetLockProofTypeNAPI::Instant => String::from("Instant"),
            AssetLockProofTypeNAPI::Chain => String::from("Chain"),
        }
    }
}

impl TryFrom<u8> for AssetLockProofTypeNAPI {
    type Error = napi::Error;
    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::Instant),
            1 => Ok(Self::Chain),
            _ => Err(napi::Error::new(
                Status::GenericFailure,
                "Unexpected asset lock proof type",
            )),
        }
    }
}

impl TryFrom<u64> for AssetLockProofTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::Instant),
            1 => Ok(Self::Chain),
            _ => Err(napi::Error::new(
                Status::GenericFailure,
                "Unexpected asset lock proof type",
            )),
        }
    }
}

impl TryFrom<String> for AssetLockProofTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "instant" => Ok(Self::Instant),
            "chain" => Ok(Self::Chain),
            _ => Err(napi::Error::new(
                Status::GenericFailure,
                "Unexpected asset lock proof type",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for AssetLockProofTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            AssetLockProofTypeNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            AssetLockProofTypeNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid asset lock proof type value",
            ))
        }
    }
}
