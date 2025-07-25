use crate::action_taker::ActionTakerWASM;
use crate::authorized_action_takers::AuthorizedActionTakersWASM;
use crate::group::GroupWASM;
use dpp::data_contract::GroupContractPosition;
use dpp::data_contract::change_control_rules::ChangeControlRules;
use dpp::data_contract::change_control_rules::v0::ChangeControlRulesV0;
use dpp::data_contract::group::Group;
use js_sys::{Object, Reflect};
use pshenmic_dpp_enums::token::action_goal::ActionGoalWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::IntoWasm;
use std::collections::BTreeMap;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[derive(Clone, Debug, PartialEq)]
#[wasm_bindgen(js_name = "ChangeControlRulesWASM")]
pub struct ChangeControlRulesWASM(ChangeControlRules);

impl From<ChangeControlRules> for ChangeControlRulesWASM {
    fn from(value: ChangeControlRules) -> Self {
        Self(value)
    }
}

impl From<ChangeControlRulesWASM> for ChangeControlRules {
    fn from(value: ChangeControlRulesWASM) -> Self {
        value.0
    }
}

#[wasm_bindgen]
impl ChangeControlRulesWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "ChangeControlRulesWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "ChangeControlRulesWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        authorized_to_make_change: &AuthorizedActionTakersWASM,
        admin_action_takers: &AuthorizedActionTakersWASM,
        changing_authorized_action_takers_to_no_one_allowed: bool,
        changing_admin_action_takers_to_no_one_allowed: bool,
        self_changing_admin_action_takers_allowed: bool,
    ) -> Self {
        ChangeControlRulesWASM(ChangeControlRules::V0(ChangeControlRulesV0 {
            authorized_to_make_change: authorized_to_make_change.clone().into(),
            admin_action_takers: admin_action_takers.clone().into(),
            changing_authorized_action_takers_to_no_one_allowed,
            changing_admin_action_takers_to_no_one_allowed,
            self_changing_admin_action_takers_allowed,
        }))
    }

    #[wasm_bindgen(getter = "authorizedToMakeChange")]
    pub fn get_authorized_to_make_change(&self) -> AuthorizedActionTakersWASM {
        self.0
            .authorized_to_make_change_action_takers()
            .clone()
            .into()
    }

    #[wasm_bindgen(getter = "adminActionTakers")]
    pub fn get_admin_action_takers(&self) -> AuthorizedActionTakersWASM {
        self.0.admin_action_takers().clone().into()
    }

    #[wasm_bindgen(getter = "changingAuthorizedActionTakersToNoOneAllowed")]
    pub fn get_changing_authorized_action_takers_to_no_one_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.changing_authorized_action_takers_to_no_one_allowed,
        }
    }

    #[wasm_bindgen(getter = "changingAdminActionTakersToNoOneAllowed")]
    pub fn get_changing_admin_action_takers_to_no_one_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.changing_admin_action_takers_to_no_one_allowed,
        }
    }

    #[wasm_bindgen(getter = "selfChangingAdminActionTakersAllowed")]
    pub fn get_self_changing_admin_action_takers_allowed(&self) -> bool {
        match self.0.clone() {
            ChangeControlRules::V0(v0) => v0.self_changing_admin_action_takers_allowed,
        }
    }

    #[wasm_bindgen(setter = "authorizedToMakeChange")]
    pub fn set_authorized_to_make_change(
        &mut self,
        authorized_to_make_change: &AuthorizedActionTakersWASM,
    ) {
        self.0
            .set_authorized_to_make_change_action_takers(authorized_to_make_change.clone().into());
    }

    #[wasm_bindgen(setter = "adminActionTakers")]
    pub fn set_admin_action_takers(&mut self, admin_action_takers: &AuthorizedActionTakersWASM) {
        self.0
            .set_admin_action_takers(admin_action_takers.clone().into());
    }

    #[wasm_bindgen(setter = "changingAuthorizedActionTakersToNoOneAllowed")]
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

    #[wasm_bindgen(setter = "changingAdminActionTakersToNoOneAllowed")]
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

    #[wasm_bindgen(setter = "selfChangingAdminActionTakersAllowed")]
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

    #[wasm_bindgen(js_name = "canChangeAdminActionTakers")]
    pub fn can_change_admin_action_takers(
        &self,
        admin_action_takers: &AuthorizedActionTakersWASM,
        js_contract_owner_id: &JsValue,
        main_group: Option<GroupContractPosition>,
        js_groups: &JsValue,
        action_taker: &ActionTakerWASM,
        js_goal: &JsValue,
    ) -> Result<bool, JsValue> {
        let contract_owner_id = IdentifierWASM::try_from(js_contract_owner_id)?;
        let goal = ActionGoalWASM::try_from(js_goal.clone())?;

        let groups_object = Object::from(js_groups.clone());
        let groups_keys = Object::keys(&groups_object);

        let mut groups: BTreeMap<GroupContractPosition, Group> = BTreeMap::new();

        for key in groups_keys.iter() {
            let contract_position = match key.as_string() {
                None => Err(JsValue::from("Cannot read timestamp in distribution rules")),
                Some(contract_position) => Ok(contract_position
                    .parse::<GroupContractPosition>()
                    .map_err(JsError::from)?),
            }?;

            let group_value = Reflect::get(js_groups, &key)?;

            let group = group_value.to_wasm::<GroupWASM>("GroupWASM")?.clone();

            groups.insert(contract_position, group.into());
        }

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
