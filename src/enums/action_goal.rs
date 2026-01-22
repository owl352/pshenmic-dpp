use dpp::group::action_taker::ActionGoal;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

#[napi(js_name = "ActionGoalNAPI")]
#[allow(non_camel_case_types)]
#[derive(Default, Clone)]
pub enum ActionGoalNAPI {
    #[default]
    ActionCompletion = 0,
    ActionParticipation = 1,
}

impl From<ActionGoalNAPI> for ActionGoal {
    fn from(action_goal: ActionGoalNAPI) -> Self {
        match action_goal {
            ActionGoalNAPI::ActionCompletion => ActionGoal::ActionCompletion,
            ActionGoalNAPI::ActionParticipation => ActionGoal::ActionParticipation,
        }
    }
}

impl From<ActionGoal> for ActionGoalNAPI {
    fn from(action_goal: ActionGoal) -> Self {
        match action_goal {
            ActionGoal::ActionCompletion => ActionGoalNAPI::ActionCompletion,
            ActionGoal::ActionParticipation => ActionGoalNAPI::ActionParticipation,
        }
    }
}

impl From<ActionGoalNAPI> for String {
    fn from(action_goal: ActionGoalNAPI) -> Self {
        match action_goal {
            ActionGoalNAPI::ActionCompletion => String::from("ActionCompletion"),
            ActionGoalNAPI::ActionParticipation => String::from("ActionParticipation"),
        }
    }
}

impl From<ActionGoalNAPI> for u8 {
    fn from(action_goal: ActionGoalNAPI) -> Self {
        match action_goal {
            ActionGoalNAPI::ActionCompletion => 0,
            ActionGoalNAPI::ActionParticipation => 1,
        }
    }
}

impl TryFrom<u64> for ActionGoalNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(ActionGoalNAPI::ActionCompletion),
            1 => Ok(ActionGoalNAPI::ActionParticipation),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ActionGoal value",
            )),
        }
    }
}

impl TryFrom<String> for ActionGoalNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "actioncomplete" => Ok(ActionGoalNAPI::ActionCompletion),
            "actionparticipation" => Ok(ActionGoalNAPI::ActionParticipation),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ActionGoal value",
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for ActionGoalNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            ActionGoalNAPI::try_from(num)
        } else if is_string {
            let text = value.as_string().unwrap();
            ActionGoalNAPI::try_from(text)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid ActionGoal value",
            ))
        }
    }
}
