use dpp::tokens::gas_fees_paid_by::GasFeesPaidBy;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[derive(Clone, Default)]
#[napi(js_name = "GasFeesPaidByNAPI")]
pub enum GasFeesPaidByNAPI {
    #[default]
    DocumentOwner = 0,
    ContractOwner = 1,
    PreferContractOwner = 2,
}

impl From<GasFeesPaidBy> for GasFeesPaidByNAPI {
    fn from(value: GasFeesPaidBy) -> Self {
        match value {
            GasFeesPaidBy::DocumentOwner => GasFeesPaidByNAPI::DocumentOwner,
            GasFeesPaidBy::ContractOwner => GasFeesPaidByNAPI::ContractOwner,
            GasFeesPaidBy::PreferContractOwner => GasFeesPaidByNAPI::PreferContractOwner,
        }
    }
}

impl From<GasFeesPaidByNAPI> for GasFeesPaidBy {
    fn from(value: GasFeesPaidByNAPI) -> Self {
        match value {
            GasFeesPaidByNAPI::DocumentOwner => GasFeesPaidBy::DocumentOwner,
            GasFeesPaidByNAPI::ContractOwner => GasFeesPaidBy::ContractOwner,
            GasFeesPaidByNAPI::PreferContractOwner => GasFeesPaidBy::PreferContractOwner,
        }
    }
}

impl From<GasFeesPaidByNAPI> for String {
    fn from(value: GasFeesPaidByNAPI) -> Self {
        match value {
            GasFeesPaidByNAPI::DocumentOwner => String::from("DocumentOwner"),
            GasFeesPaidByNAPI::ContractOwner => String::from("ContractOwner"),
            GasFeesPaidByNAPI::PreferContractOwner => String::from("PreferContractOwner"),
        }
    }
}

impl TryFrom<String> for GasFeesPaidByNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "documentowner" => Ok(GasFeesPaidByNAPI::DocumentOwner),
            "contractowner" => Ok(GasFeesPaidByNAPI::ContractOwner),
            "prefercontractowner" => Ok(GasFeesPaidByNAPI::PreferContractOwner),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid GasFeesPaidBy value",
            )),
        }
    }
}

impl TryFrom<u64> for GasFeesPaidByNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(GasFeesPaidByNAPI::DocumentOwner),
            1 => Ok(GasFeesPaidByNAPI::ContractOwner),
            2 => Ok(GasFeesPaidByNAPI::PreferContractOwner),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid GasFeesPaidBy value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for GasFeesPaidByNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            GasFeesPaidByNAPI::try_from(num)
        } else if is_string {
            let text = value.as_string().unwrap();
            GasFeesPaidByNAPI::try_from(text)
        } else {
            Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid GasFeesPaidBy value",
            ))
        }
    }
}
