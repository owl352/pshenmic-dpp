use dpp::data_contract::DataContract;
use dpp::platform_value::Value;
use dpp::voting::vote_polls::contested_document_resource_vote_poll::ContestedDocumentResourceVotePoll;
use drive::query::vote_poll_vote_state_query::{
    ContestedDocumentVotePollDriveQuery, ContestedDocumentVotePollDriveQueryResultType,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    data_contract::DataContractNAPI,
    dynamic_value::DynamicValue,
    enums::{
        platform_version::PlatformVersionNAPI, vote_state_result_type::VoteStateResultTypeNAPI,
    },
    identifier::IdentifierNAPI,
    verify::contested::contested_document_vote_poll_query_execution_result::ContestedDocumentVotePollQueryExecutionResultNAPI,
};

#[napi(js_name = "VerifiedVoteStateNAPI")]
pub struct VerifiedVoteStateNAPI {
    pub root_hash: Uint8Array,
    result: ContestedDocumentVotePollQueryExecutionResultNAPI,
}

#[napi]
impl VerifiedVoteStateNAPI {
    #[napi(getter, js_name = "result")]
    pub fn result(&self) -> ContestedDocumentVotePollQueryExecutionResultNAPI {
        self.result.clone()
    }

    #[napi(setter, js_name = "result")]
    pub fn set_result(&mut self, value: &ContestedDocumentVotePollQueryExecutionResultNAPI) {
        self.result = value.clone();
    }
}

#[napi(js_name = "verifyVotePollVoteStateProof")]
pub fn verify_vote_state_proof(
    proof: Uint8Array,
    contract: &DataContractNAPI,
    document_type_name: String,
    index_name: String,
    js_index_values: &DynamicValue,
    js_result_type: &DynamicValue,
    allow_include_locked_and_abstaining_vote_tally: bool,
    count: Option<u16>,
    js_start_at: &DynamicValue,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedVoteStateNAPI, napi::Error> {
    let index_values: Vec<Value> = js_index_values
        .as_array()
        .ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "index_values must be a array",
        ))?
        .clone()
        .iter()
        .map(|value| {
            if !value.is_string() {
                return Err(napi::Error::new(
                    napi::Status::InvalidArg,
                    "index_values must be a string",
                ));
            }

            Ok::<Value, napi::Error>(value.clone().try_into()?)
        })
        .collect::<Result<Vec<Value>, napi::Error>>()?;

    let result_type = match VoteStateResultTypeNAPI::try_from(js_result_type)? {
        VoteStateResultTypeNAPI::Documents => {
            ContestedDocumentVotePollDriveQueryResultType::Documents
        }
        VoteStateResultTypeNAPI::VoteTally => {
            ContestedDocumentVotePollDriveQueryResultType::VoteTally
        }
        VoteStateResultTypeNAPI::DocumentsAndVoteTally => {
            ContestedDocumentVotePollDriveQueryResultType::DocumentsAndVoteTally
        }
    };

    let start_at: Option<([u8; 32], bool)> = match js_start_at.is_object() {
        false => None,
        true => {
            let js_object = js_start_at
                .as_object()
                .ok_or(
                    napi::Error::new(
                        napi::Status::InvalidArg,
                        "start at must be a object with: \"startIdentifier\" and \"startIdentifierIncluded\""
                    )
                )?;

            let start_identifier = js_object.get("startIdentifier").ok_or(
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "start at must be a object with: \"startIdentifier\" and \"startIdentifierIncluded\""
                )
            )?;

            let start_identifier_included = js_object.get("startIdentifierIncluded").ok_or(
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "start at must be a object with: \"startIdentifier\" and \"startIdentifierIncluded\""
                )
            )?
            .as_bool()
            .ok_or(
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "\"startIdentifierIncluded\" must be a boolean"
                )
            )?;

            Some((
                IdentifierNAPI::try_from(start_identifier)?.to_slice(),
                start_identifier_included,
            ))
        }
    };

    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let query = ContestedDocumentVotePollDriveQuery {
        vote_poll: ContestedDocumentResourceVotePoll {
            contract_id: contract.get_id().into(),
            document_type_name: document_type_name.to_string(),
            index_name: index_name.to_string(),
            index_values,
        },
        result_type,
        offset: None,
        limit: count,
        start_at,
        allow_include_locked_and_abstaining_vote_tally,
    };

    // need to increase lifetime before he is dropped
    let rs_contract: DataContract = contract.clone().into();

    let resolved_query = query
        .resolve_with_provided_borrowed_contract(&rs_contract)
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    let (root_hash, execution_result) = resolved_query
        .verify_vote_poll_vote_state_proof(&proof.to_vec(), &platform_version.into())
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedVoteStateNAPI {
        root_hash: root_hash.into(),
        result: execution_result.into(),
    })
}
