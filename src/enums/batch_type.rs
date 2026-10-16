use dpp::state_transition::batch_transition::batched_transition::document_transition_action_type::DocumentTransitionActionType;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "BatchTypeNAPI")]
#[allow(non_camel_case_types)]
pub enum BatchTypeNAPI {
    Create,
    Replace,
    Delete,
    Transfer,
    Purchase,
    UpdatePrice,
    IgnoreWhileBumpingRevision,
    IndexOnlyDelete,
}

impl From<DocumentTransitionActionType> for BatchTypeNAPI {
    fn from(action_type: DocumentTransitionActionType) -> Self {
        match action_type {
            DocumentTransitionActionType::Create => BatchTypeNAPI::Create,
            DocumentTransitionActionType::Replace => BatchTypeNAPI::Replace,
            DocumentTransitionActionType::Delete => BatchTypeNAPI::Delete,
            DocumentTransitionActionType::Transfer => BatchTypeNAPI::Transfer,
            DocumentTransitionActionType::Purchase => BatchTypeNAPI::Purchase,
            DocumentTransitionActionType::UpdatePrice => BatchTypeNAPI::UpdatePrice,
            DocumentTransitionActionType::IgnoreWhileBumpingRevision => {
                BatchTypeNAPI::IgnoreWhileBumpingRevision
            }
            DocumentTransitionActionType::IndexOnlyDelete => BatchTypeNAPI::IndexOnlyDelete,
        }
    }
}

impl From<BatchTypeNAPI> for DocumentTransitionActionType {
    fn from(value: BatchTypeNAPI) -> Self {
        match value {
            BatchTypeNAPI::Create => DocumentTransitionActionType::Create,
            BatchTypeNAPI::Replace => DocumentTransitionActionType::Replace,
            BatchTypeNAPI::Delete => DocumentTransitionActionType::Delete,
            BatchTypeNAPI::Transfer => DocumentTransitionActionType::Transfer,
            BatchTypeNAPI::Purchase => DocumentTransitionActionType::Purchase,
            BatchTypeNAPI::UpdatePrice => DocumentTransitionActionType::UpdatePrice,
            BatchTypeNAPI::IgnoreWhileBumpingRevision => {
                DocumentTransitionActionType::IgnoreWhileBumpingRevision
            }
            BatchTypeNAPI::IndexOnlyDelete => DocumentTransitionActionType::IndexOnlyDelete,
        }
    }
}

impl From<BatchTypeNAPI> for String {
    fn from(value: BatchTypeNAPI) -> Self {
        match value {
            BatchTypeNAPI::Create => "Create",
            BatchTypeNAPI::Replace => "Replace",
            BatchTypeNAPI::Delete => "Delete",
            BatchTypeNAPI::Transfer => "Transfer",
            BatchTypeNAPI::Purchase => "Purchase",
            BatchTypeNAPI::UpdatePrice => "UpdatePrice",
            BatchTypeNAPI::IgnoreWhileBumpingRevision => "IgnoreWhileBumpingRevision",
            BatchTypeNAPI::IndexOnlyDelete => "IndexOnlyDelete",
        }
        .to_string()
    }
}

impl From<BatchTypeNAPI> for u8 {
    fn from(value: BatchTypeNAPI) -> Self {
        match value {
            BatchTypeNAPI::Create => 0,
            BatchTypeNAPI::Replace => 1,
            BatchTypeNAPI::Delete => 2,
            BatchTypeNAPI::Transfer => 3,
            BatchTypeNAPI::Purchase => 4,
            BatchTypeNAPI::UpdatePrice => 5,
            BatchTypeNAPI::IgnoreWhileBumpingRevision => 6,
            BatchTypeNAPI::IndexOnlyDelete => 7,
        }
    }
}

impl TryFrom<u64> for BatchTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(BatchTypeNAPI::Create),
            1 => Ok(BatchTypeNAPI::Replace),
            2 => Ok(BatchTypeNAPI::Delete),
            3 => Ok(BatchTypeNAPI::Transfer),
            4 => Ok(BatchTypeNAPI::Purchase),
            5 => Ok(BatchTypeNAPI::UpdatePrice),
            6 => Ok(BatchTypeNAPI::IgnoreWhileBumpingRevision),
            7 => Ok(BatchTypeNAPI::IndexOnlyDelete),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid batch type",
            )),
        }
    }
}

impl TryFrom<String> for BatchTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "create" => Ok(BatchTypeNAPI::Create),
            "replace" => Ok(BatchTypeNAPI::Replace),
            "delete" => Ok(BatchTypeNAPI::Delete),
            "transfer" => Ok(BatchTypeNAPI::Transfer),
            "purchase" => Ok(BatchTypeNAPI::Purchase),
            "updateprice" => Ok(BatchTypeNAPI::UpdatePrice),
            "ignorewhilebumpingrevision" => Ok(BatchTypeNAPI::IgnoreWhileBumpingRevision),
            "indexonlydelete" => Ok(BatchTypeNAPI::IndexOnlyDelete),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid batch type",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for BatchTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            BatchTypeNAPI::try_from(num)
        } else if is_string {
            let text = value.as_string().unwrap();
            BatchTypeNAPI::try_from(text)
        } else {
            Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid BatchType value",
            ))
        }
    }
}
