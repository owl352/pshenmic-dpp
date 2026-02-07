use std::collections::BTreeMap;

use dpp::voting::vote_info_storage::contested_document_vote_poll_winner_info::ContestedDocumentVotePollWinnerInfo;
use drive::query::vote_poll_vote_state_query::ContestedDocumentVotePollDriveQueryExecutionResult;
use napi_derive::napi;

use crate::{
    dynamic_value::DynamicValue,
    verify::contested::contender_with_serialized_document::ContenderWithSerializedDocumentNAPI,
};

#[derive(Clone)]
#[napi(js_name = "ContestedDocumentVotePollQueryExecutionResultNAPI")]
pub struct ContestedDocumentVotePollQueryExecutionResultNAPI(
    ContestedDocumentVotePollDriveQueryExecutionResult,
);

impl From<ContestedDocumentVotePollDriveQueryExecutionResult>
    for ContestedDocumentVotePollQueryExecutionResultNAPI
{
    fn from(contract: ContestedDocumentVotePollDriveQueryExecutionResult) -> Self {
        ContestedDocumentVotePollQueryExecutionResultNAPI(contract)
    }
}

#[napi]
impl ContestedDocumentVotePollQueryExecutionResultNAPI {
    #[napi(getter, js_name = "contenders")]
    pub fn contenders(&self) -> Vec<ContenderWithSerializedDocumentNAPI> {
        self.0
            .contenders
            .iter()
            .map(|contender| contender.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "lockedVoteTally")]
    pub fn locked_vote_tally(&self) -> Option<u32> {
        self.0.locked_vote_tally
    }

    #[napi(getter, js_name = "abstainingVoteTally")]
    pub fn abstaining_vote_tally(&self) -> Option<u32> {
        self.0.abstaining_vote_tally
    }

    #[napi(getter, js_name = "winner")]
    pub fn winner(&self) -> Result<DynamicValue, napi::Error> {
        match self.0.winner {
            None => Ok(DynamicValue::null()),
            Some(winner_info) => {
                let mut winner: BTreeMap<String, DynamicValue> = BTreeMap::new();

                match winner_info.0 {
                    ContestedDocumentVotePollWinnerInfo::NoWinner => {
                        winner.insert("type".into(), "NoWinner".into());
                    }
                    ContestedDocumentVotePollWinnerInfo::Locked => {
                        winner.insert("type".into(), "Locked".into());
                    }
                    ContestedDocumentVotePollWinnerInfo::WonByIdentity(winner_id) => {
                        winner.insert("type".into(), "WonByIdentity".into());

                        winner.insert("identityId".into(), winner_id.as_slice().into());
                    }
                }

                let block_info = winner_info.1.clone();

                let mut block_info_obj: BTreeMap<String, DynamicValue> = BTreeMap::new();

                block_info_obj.insert("height".into(), block_info.height.into());
                block_info_obj.insert("coreHeight".into(), block_info.core_height.into());
                block_info_obj.insert("timeMs".into(), block_info.time_ms.into());
                block_info_obj.insert("epoch".into(), block_info.epoch.index.into());

                winner.insert("blockInfo".into(), DynamicValue::object(block_info_obj));

                Ok(DynamicValue::object(winner))
            }
        }
    }

    #[napi(getter, js_name = "skipped")]
    pub fn skipped(&self) -> u16 {
        self.0.skipped
    }
}
