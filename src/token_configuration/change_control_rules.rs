use dpp::data_contract::GroupContractPosition;
use dpp::data_contract::change_control_rules::ChangeControlRules;
use dpp::data_contract::change_control_rules::v0::ChangeControlRulesV0;
use dpp::data_contract::group::Group;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::action_goal::ActionGoalNAPI;
use crate::identifier::IdentifierNAPI;
use crate::token_configuration::action_taker::ActionTakerNAPI;
use crate::token_configuration::authorized_action_taker::AuthorizedActionTakersNAPI;
use crate::token_configuration::group::GroupNAPI;

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "ChangeControlRulesNAPI")]
pub struct ChangeControlRulesNAPI(ChangeControlRules);

impl From<ChangeControlRules> for ChangeControlRulesNAPI {
    fn from(value: ChangeControlRules) -> Self {
        Self(value)
    }
}

impl From<ChangeControlRulesNAPI> for ChangeControlRules {
    fn from(value: ChangeControlRulesNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ChangeControlRulesNAPI {
    #[napi(constructor)]
    pub fn new(
        authorized_to_make_change: &AuthorizedActionTakersNAPI,
        admin_action_takers: &AuthorizedActionTakersNAPI,
        changing_authorized_action_takers_to_no_one_allowed: bool,
        changing_admin_action_takers_to_no_one_allowed: bool,
        self_changing_admin_action_takers_allowed: bool,
    ) -> Self {
        ChangeControlRulesNAPI(ChangeControlRules::V0(ChangeControlRulesV0 {
            authorized_to_make_change: authorized_to_make_change.clone().into(),
            admin_action_takers: admin_action_takers.clone().into(),
            changing_authorized_action_takers_to_no_one_allowed,
            changing_admin_action_takers_to_no_one_allowed,
            self_changing_admin_action_takers_allowed,
        }))
    }

    #[napi(getter, js_name = "authorizedToMakeChange")]
    pub fn get_authorized_to_make_change(&self) -> AuthorizedActionTakersNAPI {
        self.0
            .authorized_to_make_change_action_takers()
            .clone()
            .into()
    }

    #[napi(getter, js_name = "adminActionTakers")]
    pub fn get_admin_action_takers(&self) -> AuthorizedActionTakersNAPI {
        self.0.admin_action_takers().clone().into()
    }

    #[napi(getter, js_name = "changingAuthorizedActionTakersToNoOneAllowed")]
    pub fn get_changing_authorized_action_takers_to_no_one_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.changing_authorized_action_takers_to_no_one_allowed,
        }
    }

    #[napi(getter, js_name = "changingAdminActionTakersToNoOneAllowed")]
    pub fn get_changing_admin_action_takers_to_no_one_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.changing_admin_action_takers_to_no_one_allowed,
        }
    }

    #[napi(getter, js_name = "selfChangingAdminActionTakersAllowed")]
    pub fn get_self_changing_admin_action_takers_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.self_changing_admin_action_takers_allowed,
        }
    }

    #[napi(setter, js_name = "authorizedToMakeChange")]
    pub fn set_authorized_to_make_change(
        &mut self,
        authorized_to_make_change: &AuthorizedActionTakersNAPI,
    ) {
        self.0
            .set_authorized_to_make_change_action_takers(authorized_to_make_change.clone().into());
    }

    #[napi(setter, js_name = "adminActionTakers")]
    pub fn set_admin_action_takers(&mut self, admin_action_takers: &AuthorizedActionTakersNAPI) {
        self.0
            .set_admin_action_takers(admin_action_takers.clone().into());
    }

    #[napi(setter, js_name = "changingAuthorizedActionTakersToNoOneAllowed")]
    pub fn set_changing_authorized_action_takers_to_no_one_allowed(
        &mut self,
        changing_authorized_action_takers_to_no_one_allowed: bool,
    ) {
        let v0 = match self.0.clone() {
            ChangeControlRules::V0(mut v0) => {
                v0.changing_authorized_action_takers_to_no_one_allowed =
                    changing_authorized_action_takers_to_no_one_allowed;
                v0
            }
        };

        self.0 = ChangeControlRules::V0(v0);
    }

    #[napi(setter, js_name = "changingAdminActionTakersToNoOneAllowed")]
    pub fn set_changing_admin_action_takers_to_no_one_allowed(
        &mut self,
        changing_admin_action_takers_to_no_one_allowed: bool,
    ) {
        let v0 = match self.0.clone() {
            ChangeControlRules::V0(mut v0) => {
                v0.changing_admin_action_takers_to_no_one_allowed =
                    changing_admin_action_takers_to_no_one_allowed;
                v0
            }
        };

        self.0 = ChangeControlRules::V0(v0)
    }

    #[napi(setter, js_name = "selfChangingAdminActionTakersAllowed")]
    pub fn set_self_changing_admin_action_takers_allowed(
        &mut self,
        self_changing_admin_action_takers_allowed: bool,
    ) {
        let v0 = match self.0.clone() {
            ChangeControlRules::V0(mut v0) => {
                v0.self_changing_admin_action_takers_allowed =
                    self_changing_admin_action_takers_allowed;
                v0
            }
        };

        self.0 = ChangeControlRules::V0(v0);
    }

    #[napi(js_name = "canChangeAdminActionTakers")]
    pub fn can_change_admin_action_takers(
        &self,
        admin_action_takers: &AuthorizedActionTakersNAPI,
        js_contract_owner_id: IdentifierLikeNAPI,
        main_group: Option<u16>,
        js_groups: Vec<(String, &GroupNAPI)>,
        action_taker: &ActionTakerNAPI,
        js_goal: &DynamicValue,
    ) -> Result<bool, napi::Error> {
        let contract_owner_id = IdentifierNAPI::try_from(js_contract_owner_id)?;
        let goal = ActionGoalNAPI::try_from(js_goal)?;

        let groups: BTreeMap<GroupContractPosition, Group> = js_groups
            .into_iter()
            .map(|(str_pos, js_group)| {
                let pos = str_pos.try_to_u64()? as u16;
                let group: Group = js_group.clone().into();

                Ok::<(u16, Group), napi::Error>((pos, group))
            })
            .collect::<Result<BTreeMap<GroupContractPosition, Group>, napi::Error>>()?;

        Ok(self.0.can_change_admin_action_takers(
            &admin_action_takers.clone().into(),
            &contract_owner_id.clone().into(),
            main_group,
            &groups,
            &action_taker.clone().into(),
            goal.clone().into(),
        ))
    }
}
