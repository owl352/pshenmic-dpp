use dpp::prelude::{TimestampIncluded, TimestampMillis};
use dpp::voting::vote_polls::VotePoll;
use drive::config::DEFAULT_QUERY_LIMIT;
use drive::query::VotePollsByEndDateDriveQuery;
use drive::verify::RootHash;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    masternode_vote::vote_poll::VotePollNAPI,
};

/// The vote polls that end at a single timestamp.
#[derive(Clone)]
#[napi(js_name = "VotePollsAtEndDateNAPI")]
pub struct VotePollsAtEndDateNAPI {
    pub(crate) timestamp_ms: BigIntString,
    pub(crate) vote_polls: Vec<VotePollNAPI>,
}

#[napi]
impl VotePollsAtEndDateNAPI {
    #[napi(getter, js_name = "timestampMs")]
    pub fn timestamp_ms(&self) -> BigIntString {
        self.timestamp_ms.clone()
    }

    #[napi(getter, js_name = "votePolls")]
    pub fn vote_polls(&self) -> Vec<VotePollNAPI> {
        self.vote_polls.clone()
    }
}

#[napi(js_name = "VerifiedVotePollsByEndDateNAPI")]
pub struct VerifiedVotePollsByEndDateNAPI {
    pub root_hash: Uint8Array,
    pub(crate) vote_polls: Vec<VotePollsAtEndDateNAPI>,
}

#[napi]
impl VerifiedVotePollsByEndDateNAPI {
    /// The proven vote polls grouped by end timestamp, in the requested order.
    #[napi(getter, js_name = "votePolls")]
    pub fn vote_polls(&self) -> Vec<VotePollsAtEndDateNAPI> {
        self.vote_polls.clone()
    }
}

fn time_bound(
    time_ms: Option<BigIntString>,
    included: Option<bool>,
) -> Result<Option<(TimestampMillis, TimestampIncluded)>, napi::Error> {
    time_ms
        .map(|time_ms| Ok((time_ms.try_to_u64()?, included.unwrap_or(false))))
        .transpose()
}

/// Verifies a `getVotePollsByEndDate` proof.
///
/// The arguments mirror the request: a bound is only applied when its time is
/// given, and must match what was asked for, since they define the proven query.
/// Without a `limit` the node used its default page, so that is tried first and
/// then no limit, like the SDK does. Proved requests can't carry an offset.
#[napi(js_name = "verifyVotePollsByEndDateProof")]
pub fn verify_vote_polls_by_end_date_proof(
    proof: Uint8Array,
    start_time_ms: Option<BigIntString>,
    start_time_included: Option<bool>,
    end_time_ms: Option<BigIntString>,
    end_time_included: Option<bool>,
    limit: Option<u16>,
    ascending: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedVotePollsByEndDateNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?.into();

    let query = VotePollsByEndDateDriveQuery {
        start_time: time_bound(start_time_ms, start_time_included)?,
        end_time: time_bound(end_time_ms, end_time_included)?,
        limit,
        offset: None,
        order_ascending: ascending,
    };

    let verify = |limit: Option<u16>| {
        VotePollsByEndDateDriveQuery {
            limit,
            ..query.clone()
        }
        .verify_vote_polls_by_end_date_proof::<Vec<(TimestampMillis, Vec<VotePoll>)>>(
            proof.as_ref(),
            &platform_version,
        )
    };

    let (root_hash, mut vote_polls): (RootHash, _) = match limit {
        Some(limit) => verify(Some(limit)),
        None => verify(Some(DEFAULT_QUERY_LIMIT))
            .or_else(|default_page_error| verify(None).map_err(|_| default_page_error)),
    }
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    if !ascending {
        vote_polls.reverse();
    }

    Ok(VerifiedVotePollsByEndDateNAPI {
        root_hash: root_hash.into(),
        vote_polls: vote_polls
            .into_iter()
            .map(|(timestamp_ms, vote_polls)| VotePollsAtEndDateNAPI {
                timestamp_ms: timestamp_ms.to_string(),
                vote_polls: vote_polls.into_iter().map(VotePollNAPI::from).collect(),
            })
            .collect(),
    })
}
