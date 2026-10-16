use dpp::state_transition::contract_fee_claim_transition::ContractFeePot;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "ContractFeePotNAPI")]
#[allow(non_camel_case_types)]
#[derive(Default)]
pub enum ContractFeePotNAPI {
    #[default]
    Owner = 0,
    Moderators = 1,
}

impl From<ContractFeePotNAPI> for ContractFeePot {
    fn from(pot: ContractFeePotNAPI) -> Self {
        match pot {
            ContractFeePotNAPI::Owner => ContractFeePot::Owner,
            ContractFeePotNAPI::Moderators => ContractFeePot::Moderators,
        }
    }
}

impl From<ContractFeePot> for ContractFeePotNAPI {
    fn from(pot: ContractFeePot) -> Self {
        match pot {
            ContractFeePot::Owner => ContractFeePotNAPI::Owner,
            ContractFeePot::Moderators => ContractFeePotNAPI::Moderators,
        }
    }
}

impl From<ContractFeePotNAPI> for String {
    fn from(pot: ContractFeePotNAPI) -> Self {
        match pot {
            ContractFeePotNAPI::Owner => String::from("Owner"),
            ContractFeePotNAPI::Moderators => String::from("Moderators"),
        }
    }
}

impl TryFrom<String> for ContractFeePotNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "owner" => Ok(ContractFeePotNAPI::Owner),
            "moderators" => Ok(ContractFeePotNAPI::Moderators),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ContractFeePot value",
            )),
        }
    }
}

impl TryFrom<u64> for ContractFeePotNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(ContractFeePotNAPI::Owner),
            1 => Ok(ContractFeePotNAPI::Moderators),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ContractFeePot value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for ContractFeePotNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        if value.is_number() {
            ContractFeePotNAPI::try_from(value.try_to_u64()?)
        } else if value.is_string() {
            ContractFeePotNAPI::try_from(value.as_string().unwrap())
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ContractFeePot value",
            ))
        }
    }
}
