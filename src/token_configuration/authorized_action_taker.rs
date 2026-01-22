use dpp::data_contract::change_control_rules::authorized_action_takers::AuthorizedActionTakers;
use dpp::platform_value::string_encoding::Encoding::Base58;
use dpp::platform_value::string_encoding::encode;
use napi::bindgen_prelude::{Either3, Undefined};
use napi_derive::napi;

use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "AuthorizedActionTakersNAPI")]
pub struct AuthorizedActionTakersNAPI(AuthorizedActionTakers);

impl From<AuthorizedActionTakers> for AuthorizedActionTakersNAPI {
    fn from(action: AuthorizedActionTakers) -> Self {
        AuthorizedActionTakersNAPI(action)
    }
}

impl From<AuthorizedActionTakersNAPI> for AuthorizedActionTakers {
    fn from(action: AuthorizedActionTakersNAPI) -> Self {
        action.0
    }
}

#[napi]
impl AuthorizedActionTakersNAPI {
    pub fn no_one() -> Self {
        AuthorizedActionTakersNAPI(AuthorizedActionTakers::NoOne)
    }

    #[napi(js_name = "ContractOwner")]
    pub fn contract_owner() -> Self {
        AuthorizedActionTakersNAPI(AuthorizedActionTakers::ContractOwner)
    }

    #[napi(js_name = "Identity")]
    pub fn identity(js_identity_id: IdentifierLikeNAPI) -> Result<Self, napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;

        Ok(AuthorizedActionTakersNAPI(
            AuthorizedActionTakers::Identity(identity_id.into()),
        ))
    }

    #[napi(js_name = "MainGroup")]
    pub fn main_group() -> Self {
        AuthorizedActionTakersNAPI(AuthorizedActionTakers::MainGroup)
    }

    #[napi(js_name = "Group")]
    pub fn group(group_contract_position: u16) -> Self {
        AuthorizedActionTakersNAPI(AuthorizedActionTakers::Group(group_contract_position))
    }

    #[napi(js_name = "getTakerType")]
    pub fn taker_type(&self) -> String {
        match self.0 {
            AuthorizedActionTakers::NoOne => "NoOne".to_string(),
            AuthorizedActionTakers::ContractOwner => "ContractOwner".to_string(),
            AuthorizedActionTakers::Identity(identifier) => {
                format!("Identity({})", encode(identifier.as_slice(), Base58))
            }
            AuthorizedActionTakers::MainGroup => "MainGroup".to_string(),
            AuthorizedActionTakers::Group(group) => format!("Group({})", group),
        }
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> Either3<Undefined, IdentifierNAPI, u16> {
        match self.0 {
            AuthorizedActionTakers::NoOne => Either3::A(()),
            AuthorizedActionTakers::ContractOwner => Either3::A(()),
            AuthorizedActionTakers::Identity(identifier) => {
                Either3::B(IdentifierNAPI::from(identifier))
            }
            AuthorizedActionTakers::MainGroup => Either3::A(()),
            AuthorizedActionTakers::Group(position) => Either3::C(position),
        }
    }
}
