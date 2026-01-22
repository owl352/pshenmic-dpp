use dpp::data_contract::associated_token::token_distribution_key::TokenDistributionType;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "TokenDistributionTypeNAPI")]
#[allow(non_camel_case_types)]
#[derive(Default)]
pub enum TokenDistributionTypeNAPI {
    #[default]
    PreProgrammed = 0,
    Perpetual = 1,
}

impl From<TokenDistributionTypeNAPI> for TokenDistributionType {
    fn from(distribution_type: TokenDistributionTypeNAPI) -> Self {
        match distribution_type {
            TokenDistributionTypeNAPI::PreProgrammed => TokenDistributionType::PreProgrammed,
            TokenDistributionTypeNAPI::Perpetual => TokenDistributionType::Perpetual,
        }
    }
}

impl From<TokenDistributionType> for TokenDistributionTypeNAPI {
    fn from(distribution_type: TokenDistributionType) -> Self {
        match distribution_type {
            TokenDistributionType::Perpetual => TokenDistributionTypeNAPI::Perpetual,
            TokenDistributionType::PreProgrammed => TokenDistributionTypeNAPI::PreProgrammed,
        }
    }
}

impl From<TokenDistributionTypeNAPI> for String {
    fn from(distribution_type: TokenDistributionTypeNAPI) -> Self {
        match distribution_type {
            TokenDistributionTypeNAPI::PreProgrammed => String::from("PreProgrammed"),
            TokenDistributionTypeNAPI::Perpetual => String::from("Perpetual"),
        }
    }
}

impl From<TokenDistributionTypeNAPI> for u8 {
    fn from(value: TokenDistributionTypeNAPI) -> Self {
        match value {
            TokenDistributionTypeNAPI::PreProgrammed => 0,
            TokenDistributionTypeNAPI::Perpetual => 1,
        }
    }
}

impl TryFrom<String> for TokenDistributionTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "preprogrammed" => Ok(TokenDistributionTypeNAPI::PreProgrammed),
            "perpetual" => Ok(TokenDistributionTypeNAPI::Perpetual),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenDistributionType value",
            )),
        }
    }
}

impl TryFrom<u64> for TokenDistributionTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(TokenDistributionTypeNAPI::PreProgrammed),
            1 => Ok(TokenDistributionTypeNAPI::Perpetual),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenDistributionType value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for TokenDistributionTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            TokenDistributionTypeNAPI::try_from(num)
        } else if is_string {
            let text = value.as_string().unwrap();
            TokenDistributionTypeNAPI::try_from(text)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid TokenDistributionType value",
            ))
        }
    }
}
