use dpp::platform_value::Value;
use dpp::voting::vote_polls::VotePoll;
use dpp::voting::vote_polls::contested_document_resource_vote_poll::ContestedDocumentResourceVotePoll;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::identifier::IdentifierNAPI;

#[derive(Clone)]
#[napi(js_name = "VotePollNAPI")]
pub struct VotePollNAPI(VotePoll);

impl From<VotePoll> for VotePollNAPI {
    fn from(poll: VotePoll) -> Self {
        VotePollNAPI(poll)
    }
}

impl From<VotePollNAPI> for VotePoll {
    fn from(poll: VotePollNAPI) -> Self {
        poll.0
    }
}

#[napi]
impl VotePollNAPI {
    #[napi(constructor)]
    pub fn new(
        js_contract_id: IdentifierLikeNAPI,
        document_type_name: String,
        index_name: String,
        js_index_values: &DynamicValue,
    ) -> Result<VotePollNAPI, napi::Error> {
        let contract_id = IdentifierNAPI::try_from(js_contract_id)?;

        let index_values = match js_index_values.is_array() {
            false => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "index values must be array",
            )),
            true => Ok(js_index_values
                .as_array()
                .unwrap()
                .iter()
                .map(|el| Value::try_from(el.clone()))
                .collect::<Result<Vec<Value>, napi::Error>>()?),
        }?;

        Ok(VotePollNAPI(VotePoll::ContestedDocumentResourceVotePoll(
            ContestedDocumentResourceVotePoll {
                contract_id: contract_id.into(),
                document_type_name,
                index_name,
                index_values,
            },
        )))
    }

    #[napi(js_name = "toString")]
    pub fn to_string(&self) -> String {
        self.0.to_string()
    }

    #[napi(getter, js_name = "contractId")]
    pub fn contract_id(&self) -> IdentifierNAPI {
        match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(poll) => poll.contract_id.into(),
        }
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn document_type_name(&self) -> String {
        match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(poll) => poll.document_type_name.into(),
        }
    }

    #[napi(getter, js_name = "indexName")]
    pub fn index_name(&self) -> String {
        match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(poll) => poll.index_name.into(),
        }
    }

    #[napi(getter, js_name = "indexValues")]
    pub fn index_values(&self) -> Result<Vec<DynamicValue>, napi::Error> {
        match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(poll) => {
                let encoded: Vec<DynamicValue> = poll
                    .index_values
                    .iter()
                    .map(|value| DynamicValue::try_from(value.clone()))
                    .collect::<Result<Vec<DynamicValue>, napi::Error>>()?;

                Ok(encoded)
            }
        }
    }

    #[napi(setter, js_name = "contractId")]
    pub fn set_contract_id(
        &mut self,
        js_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let contract_id = IdentifierNAPI::try_from(js_contract_id)?;

        self.0 = match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(mut poll) => {
                poll.contract_id = contract_id.into();

                VotePoll::ContestedDocumentResourceVotePoll(poll)
            }
        };

        Ok(())
    }

    #[napi(setter, js_name = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.0 = match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(mut poll) => {
                poll.document_type_name = document_type_name;

                VotePoll::ContestedDocumentResourceVotePoll(poll)
            }
        }
    }

    #[napi(setter, js_name = "indexName")]
    pub fn set_index_name(&mut self, index_name: String) {
        self.0 = match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(mut poll) => {
                poll.index_name = index_name;

                VotePoll::ContestedDocumentResourceVotePoll(poll)
            }
        };
    }

    #[napi(setter, js_name = "indexValues")]
    pub fn set_index_values(&mut self, js_index_values: &DynamicValue) -> Result<(), napi::Error> {
        let index_values = match js_index_values.is_array() {
            false => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "index values must be array",
            )),
            true => Ok(js_index_values
                .as_array()
                .unwrap()
                .iter()
                .map(|el| Value::try_from(el.clone()))
                .collect::<Result<Vec<Value>, napi::Error>>()?),
        }?;

        self.0 = match self.0.clone() {
            VotePoll::ContestedDocumentResourceVotePoll(mut poll) => {
                poll.index_values = index_values;

                VotePoll::ContestedDocumentResourceVotePoll(poll)
            }
        };

        Ok(())
    }
}
