use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "VoteStateResultTypeNAPI")]
#[allow(non_camel_case_types)]
#[derive(Default, Clone)]
pub enum VoteStateResultTypeNAPI {
    #[default]
    DOCUMENTS = 0,
    VOTE_TALLY = 1,
    DOCUMENTS_AND_VOTE_TALLY = 2,
}

impl From<VoteStateResultTypeNAPI> for String {
    fn from(level: VoteStateResultTypeNAPI) -> String {
        match level {
            VoteStateResultTypeNAPI::DOCUMENTS => String::from("Documents"),
            VoteStateResultTypeNAPI::VOTE_TALLY => String::from("VoteTally"),
            VoteStateResultTypeNAPI::DOCUMENTS_AND_VOTE_TALLY => {
                String::from("DocumentsAndVoteTally")
            }
        }
    }
}

impl TryFrom<u64> for VoteStateResultTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(VoteStateResultTypeNAPI::DOCUMENTS),
            1 => Ok(VoteStateResultTypeNAPI::VOTE_TALLY),
            2 => Ok(VoteStateResultTypeNAPI::DOCUMENTS_AND_VOTE_TALLY),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid vote state result type value",
            )),
        }
    }
}

impl TryFrom<String> for VoteStateResultTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "documents" => Ok(VoteStateResultTypeNAPI::DOCUMENTS),
            "votetally" => Ok(VoteStateResultTypeNAPI::VOTE_TALLY),
            "documentsandvotetally" => Ok(VoteStateResultTypeNAPI::DOCUMENTS_AND_VOTE_TALLY),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid vote state result type value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for VoteStateResultTypeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            VoteStateResultTypeNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            VoteStateResultTypeNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid vote state result type value",
            ))
        }
    }
}
