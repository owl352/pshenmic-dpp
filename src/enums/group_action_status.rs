use dpp::group::group_action_status::GroupActionStatus;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "GroupActionStatusNAPI")]
#[allow(non_camel_case_types)]
#[derive(Clone)]
pub enum GroupActionStatusNAPI {
    ActionActive,
    ActionClosed,
}

impl From<GroupActionStatus> for GroupActionStatusNAPI {
    fn from(value: GroupActionStatus) -> Self {
        match value {
            GroupActionStatus::ActionActive => GroupActionStatusNAPI::ActionActive,
            GroupActionStatus::ActionClosed => GroupActionStatusNAPI::ActionClosed,
        }
    }
}

impl From<GroupActionStatusNAPI> for GroupActionStatus {
    fn from(value: GroupActionStatusNAPI) -> Self {
        match value {
            GroupActionStatusNAPI::ActionActive => GroupActionStatus::ActionActive,
            GroupActionStatusNAPI::ActionClosed => GroupActionStatus::ActionClosed,
        }
    }
}

impl From<GroupActionStatusNAPI> for String {
    fn from(level: GroupActionStatusNAPI) -> String {
        match level {
            GroupActionStatusNAPI::ActionActive => String::from("ActionActive"),
            GroupActionStatusNAPI::ActionClosed => String::from("ActionClosed"),
        }
    }
}

impl TryFrom<u64> for GroupActionStatusNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(GroupActionStatusNAPI::ActionActive),
            1 => Ok(GroupActionStatusNAPI::ActionClosed),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid group action status value",
            )),
        }
    }
}

impl TryFrom<String> for GroupActionStatusNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "actionactive" => Ok(GroupActionStatusNAPI::ActionActive),
            "actionclosed" => Ok(GroupActionStatusNAPI::ActionClosed),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid group action status value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for GroupActionStatusNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            GroupActionStatusNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            GroupActionStatusNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid group action status value",
            ))
        }
    }
}
