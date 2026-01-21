use dpp::tokens::emergency_action::TokenEmergencyAction;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "TokenEmergencyActionNAPI")]
#[allow(non_camel_case_types)]
#[derive(Default)]
pub enum TokenEmergencyActionNAPI {
    #[default]
    Pause = 0,
    Resume = 1,
}

impl From<TokenEmergencyActionNAPI> for TokenEmergencyAction {
    fn from(distribution_type: TokenEmergencyActionNAPI) -> Self {
        match distribution_type {
            TokenEmergencyActionNAPI::Pause => TokenEmergencyAction::Pause,
            TokenEmergencyActionNAPI::Resume => TokenEmergencyAction::Resume,
        }
    }
}

impl From<TokenEmergencyAction> for TokenEmergencyActionNAPI {
    fn from(distribution_type: TokenEmergencyAction) -> Self {
        match distribution_type {
            TokenEmergencyAction::Pause => TokenEmergencyActionNAPI::Pause,
            TokenEmergencyAction::Resume => TokenEmergencyActionNAPI::Resume,
        }
    }
}

impl From<TokenEmergencyActionNAPI> for String {
    fn from(distribution_type: TokenEmergencyActionNAPI) -> Self {
        match distribution_type {
            TokenEmergencyActionNAPI::Pause => String::from("Pause"),
            TokenEmergencyActionNAPI::Resume => String::from("Resume"),
        }
    }
}

impl From<TokenEmergencyActionNAPI> for u8 {
    fn from(value: TokenEmergencyActionNAPI) -> Self {
        match value {
            TokenEmergencyActionNAPI::Pause => 0,
            TokenEmergencyActionNAPI::Resume => 1,
        }
    }
}

impl TryFrom<String> for TokenEmergencyActionNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "pause" => Ok(TokenEmergencyActionNAPI::Pause),
            "resume" => Ok(TokenEmergencyActionNAPI::Resume),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenEmergencyAction value",
            )),
        }
    }
}

impl TryFrom<u64> for TokenEmergencyActionNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(TokenEmergencyActionNAPI::Pause),
            1 => Ok(TokenEmergencyActionNAPI::Resume),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenEmergencyAction value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for TokenEmergencyActionNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            TokenEmergencyActionNAPI::try_from(num)
        } else if is_string {
            let text = value.as_string().unwrap();
            TokenEmergencyActionNAPI::try_from(text)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenEmergencyAction value",
            ))
        }
    }
}
