use crate::resource_vote_choice::ResourceVoteChoiceWASM;
use crate::vote_poll::VotePollWASM;
use dpp::voting::votes::Vote;
use dpp::voting::votes::resource_vote::ResourceVote;
use dpp::voting::votes::resource_vote::accessors::v0::ResourceVoteGettersV0;
use dpp::voting::votes::resource_vote::v0::ResourceVoteV0;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name=VoteWASM)]
pub struct VoteWASM(Vote);

impl From<Vote> for VoteWASM {
    fn from(vote: Vote) -> Self {
        Self(vote)
    }
}

impl From<VoteWASM> for Vote {
    fn from(vote: VoteWASM) -> Self {
        vote.0
    }
}

#[wasm_bindgen]
impl VoteWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "VoteWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "VoteWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(vote_poll: &VotePollWASM, resource_vote_choice: &ResourceVoteChoiceWASM) -> Self {
        VoteWASM(Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
            vote_poll: vote_poll.clone().into(),
            resource_vote_choice: resource_vote_choice.clone().into(),
        })))
    }

    #[wasm_bindgen(getter = votePoll)]
    pub fn vote_poll(&self) -> VotePollWASM {
        match self.0.clone() {
            Vote::ResourceVote(vote) => vote.vote_poll().clone().into(),
        }
    }

    #[wasm_bindgen(getter = resourceVoteChoice)]
    pub fn resource_vote_choice(&self) -> ResourceVoteChoiceWASM {
        match self.0.clone() {
            Vote::ResourceVote(vote) => vote.resource_vote_choice().clone().into(),
        }
    }

    #[wasm_bindgen(setter = votePoll)]
    pub fn set_vote_poll(&mut self, vote_poll: &VotePollWASM) {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote_poll.clone().into(),
                resource_vote_choice: vote.resource_vote_choice(),
            })),
        }
    }

    #[wasm_bindgen(setter = resourceVoteChoice)]
    pub fn set_resource_vote_choice(&mut self, resource_vote_choice: &ResourceVoteChoiceWASM) {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote.vote_poll().clone(),
                resource_vote_choice: resource_vote_choice.clone().into(),
            })),
        }
    }
}
