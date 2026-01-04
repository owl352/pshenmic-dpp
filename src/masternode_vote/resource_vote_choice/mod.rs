use dpp::voting::vote_choices::resource_vote_choice::ResourceVoteChoice;
use napi_derive::napi;

use crate::{dynamic_value::IdentifierLikeNAPI, identifier::IdentifierNAPI};

#[derive(Clone)]
#[napi(js_name = "ResourceVoteChoiceNAPI")]
pub struct ResourceVoteChoiceNAPI(ResourceVoteChoice);

impl From<ResourceVoteChoice> for ResourceVoteChoiceNAPI {
    fn from(choice: ResourceVoteChoice) -> Self {
        Self(choice)
    }
}

impl From<ResourceVoteChoiceNAPI> for ResourceVoteChoice {
    fn from(choice: ResourceVoteChoiceNAPI) -> Self {
        choice.0
    }
}

#[napi]
impl ResourceVoteChoiceNAPI {
    #[napi(js_name = "TowardsIdentity")]
    pub fn towards_identity(js_id: IdentifierLikeNAPI) -> Result<Self, napi::Error> {
        let id = IdentifierNAPI::try_from(js_id)?;

        Ok(ResourceVoteChoiceNAPI(ResourceVoteChoice::TowardsIdentity(
            id.into(),
        )))
    }

    #[napi(js_name = "Abstain")]
    pub fn abstain() -> Self {
        ResourceVoteChoiceNAPI(ResourceVoteChoice::Abstain)
    }

    #[napi(js_name = "Lock")]
    pub fn lock() -> Self {
        ResourceVoteChoiceNAPI(ResourceVoteChoice::Lock)
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> Option<IdentifierNAPI> {
        match self.0.clone() {
            ResourceVoteChoice::TowardsIdentity(id) => Some(id.into()),
            ResourceVoteChoice::Abstain => None,
            ResourceVoteChoice::Lock => None,
        }
    }

    #[napi(js_name = "getType")]
    pub fn get_type(&self) -> String {
        match self.0.clone() {
            ResourceVoteChoice::TowardsIdentity(_) => "TowardsIdentity".to_string(),
            ResourceVoteChoice::Abstain => "Abstain".to_string(),
            ResourceVoteChoice::Lock => "Lock".to_string(),
        }
    }
}
