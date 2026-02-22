use dpp::group::action_taker::ActionTaker;
use dpp::prelude::Identifier;
use napi::Either;
use napi_derive::napi;
use std::collections::BTreeSet;

use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "ActionTakerNAPI")]
pub struct ActionTakerNAPI(ActionTaker);

impl From<ActionTaker> for ActionTakerNAPI {
    fn from(action_taker: ActionTaker) -> Self {
        ActionTakerNAPI(action_taker)
    }
}

impl From<ActionTakerNAPI> for ActionTaker {
    fn from(action_taker: ActionTakerNAPI) -> Self {
        action_taker.0
    }
}

#[napi]
impl ActionTakerNAPI {
    #[napi(constructor)]
    pub fn new(
        value: Either<IdentifierLikeNAPI, Vec<IdentifierLikeNAPI>>,
    ) -> Result<ActionTakerNAPI, napi::Error> {
        match value {
            Either::A(id) => Ok(ActionTakerNAPI(ActionTaker::SingleIdentity(
                IdentifierNAPI::try_from(id)?.into(),
            ))),
            Either::B(ids) => {
                let set_of_identifiers: Vec<Identifier> = ids
                    .into_iter()
                    .map(|id| IdentifierNAPI::try_from(id).map(|id| id.into()))
                    .collect::<Result<Vec<Identifier>, napi::Error>>()?;

                Ok(ActionTakerNAPI(ActionTaker::SpecifiedIdentities(
                    BTreeSet::from_iter(set_of_identifiers),
                )))
            }
        }
    }

    #[napi(js_name = "getType")]
    pub fn get_type(&self) -> String {
        match &self.0 {
            ActionTaker::SpecifiedIdentities(_) => "SpecifiedIdentities".to_string(),
            ActionTaker::SingleIdentity(_) => "SingleIdentity".to_string(),
        }
    }

    #[napi(getter, js_name = "value")]
    pub fn get_value(&self) -> Either<IdentifierNAPI, Vec<IdentifierNAPI>> {
        match &self.0 {
            ActionTaker::SingleIdentity(value) => Either::A(IdentifierNAPI::from(value.clone())),
            ActionTaker::SpecifiedIdentities(value) => Either::B(
                value
                    .iter()
                    .map(|identifier| IdentifierNAPI::from(identifier.clone()))
                    .collect(),
            ),
        }
    }

    #[napi(setter, js_name = "value")]
    pub fn set_value(
        &mut self,
        value: Either<IdentifierLikeNAPI, Vec<IdentifierLikeNAPI>>,
    ) -> Result<(), napi::Error> {
        self.0 = Self::new(value)?.0;

        Ok(())
    }
}
