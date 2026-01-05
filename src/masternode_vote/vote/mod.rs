use dpp::voting::votes::Vote;
use dpp::voting::votes::resource_vote::ResourceVote;
use dpp::voting::votes::resource_vote::accessors::v0::ResourceVoteGettersV0;
use dpp::voting::votes::resource_vote::v0::ResourceVoteV0;
use napi_derive::napi;

use crate::masternode_vote::resource_vote_choice::ResourceVoteChoiceNAPI;
use crate::masternode_vote::vote_poll::VotePollNAPI;

#[derive(Clone)]
#[napi(js_name = "VoteNAPI")]
pub struct VoteNAPI(Vote);

impl From<Vote> for VoteNAPI {
    fn from(vote: Vote) -> Self {
        Self(vote)
    }
}

impl From<VoteNAPI> for Vote {
    fn from(vote: VoteNAPI) -> Self {
        vote.0
    }
}

#[napi]
impl VoteNAPI {
    #[napi(constructor)]
    pub fn new(vote_poll: &VotePollNAPI, resource_vote_choice: &ResourceVoteChoiceNAPI) -> Self {
        VoteNAPI(Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
            vote_poll: vote_poll.clone().into(),
            resource_vote_choice: resource_vote_choice.clone().into(),
        })))
    }

    #[napi(getter, js_name = "votePoll")]
    pub fn vote_poll(&self) -> VotePollNAPI {
        match self.0.clone() {
            Vote::ResourceVote(vote) => vote.vote_poll().clone().into(),
        }
    }

    #[napi(getter, js_name = "resourceVoteChoice")]
    pub fn resource_vote_choice(&self) -> ResourceVoteChoiceNAPI {
        match self.0.clone() {
            Vote::ResourceVote(vote) => vote.resource_vote_choice().clone().into(),
        }
    }

    #[napi(setter, js_name = "votePoll")]
    pub fn set_vote_poll(&mut self, vote_poll: &VotePollNAPI) {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote_poll.clone().into(),
                resource_vote_choice: vote.resource_vote_choice(),
            })),
        }
    }

    #[napi(setter, js_name = "resourceVoteChoice")]
    pub fn set_resource_vote_choice(&mut self, resource_vote_choice: &ResourceVoteChoiceNAPI) {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote.vote_poll().clone(),
                resource_vote_choice: resource_vote_choice.clone().into(),
            })),
        }
    }
}
