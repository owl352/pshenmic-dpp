use dpp::group::group_action_status::GroupActionStatus;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "GroupActionStatusWASM")]
pub enum GroupActionStatusWASM {
    ActionActive,
    ActionClosed,
}

impl TryFrom<JsValue> for GroupActionStatusWASM {
    type Error = JsValue;

    fn try_from(value: JsValue) -> Result<GroupActionStatusWASM, Self::Error> {
        match value.is_string() {
            true => match value.as_string() {
                None => Err(JsValue::from("cannot read value from enum")),
                Some(enum_val) => match enum_val.to_lowercase().as_str() {
                    "actionactive" => Ok(GroupActionStatusWASM::ActionActive),
                    "actionclose" => Ok(GroupActionStatusWASM::ActionClosed),
                    _ => Err(JsValue::from("unknown action status")),
                },
            },
            false => match value.as_f64() {
                None => Err(JsValue::from("cannot read value from enum")),
                Some(enum_val) => match enum_val as u8 {
                    0 => Ok(GroupActionStatusWASM::ActionActive),
                    1 => Ok(GroupActionStatusWASM::ActionClosed),
                    _ => Err(JsValue::from("unknown action type")),
                },
            },
        }
    }
}

impl From<GroupActionStatusWASM> for String {
    fn from(result_type: GroupActionStatusWASM) -> Self {
        match result_type {
            GroupActionStatusWASM::ActionActive => String::from("ActionActive"),
            GroupActionStatusWASM::ActionClosed => String::from("ActionClosed"),
        }
    }
}

impl From<GroupActionStatus> for GroupActionStatusWASM {
    fn from(group_action_status: GroupActionStatus) -> Self {
        match group_action_status {
            GroupActionStatus::ActionActive => GroupActionStatusWASM::ActionActive,
            GroupActionStatus::ActionClosed => GroupActionStatusWASM::ActionClosed,
        }
    }
}
