use dpp::voting::vote_choices::yes_no_abstain_vote_choice::YesNoAbstainVoteChoice;
use dpp::voting::votes::Vote;
use dpp::voting::votes::resource_vote::ResourceVote;
use dpp::voting::votes::resource_vote::accessors::v0::ResourceVoteGettersV0;
use dpp::voting::votes::resource_vote::v0::ResourceVoteV0;
use dpp::voting::votes::yes_no_vote::YesNoVote;
use dpp::voting::votes::yes_no_vote::accessors::v0::YesNoVoteGettersV0;
use dpp::voting::votes::yes_no_vote::v0::YesNoVoteV0;
use napi_derive::napi;

use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;
use crate::masternode_vote::resource_vote_choice::ResourceVoteChoiceNAPI;
use crate::masternode_vote::vote_poll::VotePollNAPI;

fn not_a_resource_vote() -> napi::Error {
    napi::Error::new(
        napi::Status::InvalidArg,
        "this vote is a yes/no vote, not a resource vote",
    )
}

fn not_a_yes_no_vote() -> napi::Error {
    napi::Error::new(
        napi::Status::InvalidArg,
        "this vote is a resource vote, not a yes/no vote",
    )
}

fn names_its_poll_by_id() -> napi::Error {
    napi::Error::new(
        napi::Status::InvalidArg,
        "a yes/no vote names its poll by id only: use pollId",
    )
}

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
    /// A resource vote on a contested document resource vote poll.
    #[napi(constructor)]
    pub fn new(vote_poll: &VotePollNAPI, resource_vote_choice: &ResourceVoteChoiceNAPI) -> Self {
        VoteNAPI(Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
            vote_poll: vote_poll.clone().into(),
            resource_vote_choice: resource_vote_choice.clone().into(),
        })))
    }

    /// A yes/no vote (protocol version 15), naming its poll by id. The answer is
    /// `yes`, `no` or `abstain`.
    #[napi(js_name = "fromYesNo")]
    pub fn from_yes_no(
        js_vote_poll_id: IdentifierLikeNAPI,
        vote_choice: String,
    ) -> Result<Self, napi::Error> {
        Ok(VoteNAPI(Vote::YesNoVote(YesNoVote::V0(YesNoVoteV0 {
            vote_poll_id: IdentifierNAPI::try_from(js_vote_poll_id)?.into(),
            vote_choice: parse_yes_no_choice(vote_choice)?,
        }))))
    }

    #[napi(getter, js_name = "votePoll")]
    pub fn vote_poll(&self) -> Result<VotePollNAPI, napi::Error> {
        match self.0.clone() {
            Vote::ResourceVote(vote) => Ok(vote.vote_poll().clone().into()),
            Vote::YesNoVote(_) => Err(names_its_poll_by_id()),
        }
    }

    #[napi(setter, js_name = "votePoll")]
    pub fn set_vote_poll(&mut self, vote_poll: &VotePollNAPI) -> Result<(), napi::Error> {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote_poll.clone().into(),
                resource_vote_choice: vote.resource_vote_choice(),
            })),
            Vote::YesNoVote(_) => return Err(names_its_poll_by_id()),
        };

        Ok(())
    }

    /// The id of the poll a yes/no vote answers.
    #[napi(getter, js_name = "pollId")]
    pub fn poll_id(&self) -> Result<IdentifierNAPI, napi::Error> {
        match self.0.clone() {
            Vote::YesNoVote(vote) => Ok(vote.vote_poll_id().into()),
            Vote::ResourceVote(_) => Err(not_a_yes_no_vote()),
        }
    }

    #[napi(setter, js_name = "pollId")]
    pub fn set_poll_id(&mut self, js_vote_poll_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let vote_poll_id = IdentifierNAPI::try_from(js_vote_poll_id)?.into();

        self.0 = match self.0.clone() {
            Vote::YesNoVote(vote) => Vote::YesNoVote(YesNoVote::V0(YesNoVoteV0 {
                vote_poll_id,
                vote_choice: vote.vote_choice(),
            })),
            Vote::ResourceVote(_) => return Err(not_a_yes_no_vote()),
        };

        Ok(())
    }

    /// The answer of a yes/no vote: `yes`, `no` or `abstain`.
    #[napi(getter, js_name = "yesNoChoice")]
    pub fn yes_no_choice(&self) -> Result<String, napi::Error> {
        match self.0.clone() {
            Vote::YesNoVote(vote) => Ok(yes_no_choice_name(vote.vote_choice()).to_string()),
            Vote::ResourceVote(_) => Err(not_a_yes_no_vote()),
        }
    }

    #[napi(setter, js_name = "yesNoChoice")]
    pub fn set_yes_no_choice(&mut self, vote_choice: String) -> Result<(), napi::Error> {
        let vote_choice = parse_yes_no_choice(vote_choice)?;

        self.0 = match self.0.clone() {
            Vote::YesNoVote(vote) => Vote::YesNoVote(YesNoVote::V0(YesNoVoteV0 {
                vote_poll_id: vote.vote_poll_id(),
                vote_choice,
            })),
            Vote::ResourceVote(_) => return Err(not_a_yes_no_vote()),
        };

        Ok(())
    }

    #[napi(getter, js_name = "resourceVoteChoice")]
    pub fn resource_vote_choice(&self) -> Result<ResourceVoteChoiceNAPI, napi::Error> {
        match self.0.clone() {
            Vote::ResourceVote(vote) => Ok(vote.resource_vote_choice().clone().into()),
            Vote::YesNoVote(_) => Err(not_a_resource_vote()),
        }
    }

    #[napi(setter, js_name = "resourceVoteChoice")]
    pub fn set_resource_vote_choice(
        &mut self,
        resource_vote_choice: &ResourceVoteChoiceNAPI,
    ) -> Result<(), napi::Error> {
        self.0 = match self.0.clone() {
            Vote::ResourceVote(vote) => Vote::ResourceVote(ResourceVote::V0(ResourceVoteV0 {
                vote_poll: vote.vote_poll().clone(),
                resource_vote_choice: resource_vote_choice.clone().into(),
            })),
            Vote::YesNoVote(_) => return Err(not_a_resource_vote()),
        };

        Ok(())
    }
}

fn yes_no_choice_name(choice: YesNoAbstainVoteChoice) -> &'static str {
    match choice {
        YesNoAbstainVoteChoice::Yes => "yes",
        YesNoAbstainVoteChoice::No => "no",
        YesNoAbstainVoteChoice::Abstain => "abstain",
    }
}

fn parse_yes_no_choice(choice: String) -> Result<YesNoAbstainVoteChoice, napi::Error> {
    match choice.to_lowercase().as_str() {
        "yes" => Ok(YesNoAbstainVoteChoice::Yes),
        "no" => Ok(YesNoAbstainVoteChoice::No),
        "abstain" => Ok(YesNoAbstainVoteChoice::Abstain),
        _ => Err(napi::Error::new(
            napi::Status::InvalidArg,
            format!("unknown yes/no vote choice: {choice}"),
        )),
    }
}
