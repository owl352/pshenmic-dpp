use dpp::data_contract::group::Group;
use dpp::data_contract::group::accessors::v0::{GroupV0Getters, GroupV0Setters};
use dpp::data_contract::group::v0::GroupV0;
use dpp::prelude::Identifier;
use napi_derive::napi;
use std::collections::BTreeMap;

use crate::dynamic_value::IdentifierLikeNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Clone, PartialEq, Debug)]
#[napi(js_name = "GroupNAPI")]
pub struct GroupNAPI(Group);

impl From<Group> for GroupNAPI {
    fn from(group: Group) -> Self {
        GroupNAPI(group)
    }
}

impl From<GroupNAPI> for Group {
    fn from(group: GroupNAPI) -> Self {
        group.0
    }
}

#[napi]
impl GroupNAPI {
    #[napi(constructor)]
    pub fn new(
        js_members: Vec<(IdentifierLikeNAPI, u32)>,
        required_power: u32,
    ) -> Result<GroupNAPI, napi::Error> {
        let members: BTreeMap<Identifier, u32> = js_members
            .into_iter()
            .map(|(id, power)| {
                Ok::<(Identifier, u32), napi::Error>((IdentifierNAPI::try_from(id)?.into(), power))
            })
            .collect::<Result<BTreeMap<Identifier, u32>, napi::Error>>()?;

        Ok(GroupNAPI(Group::V0(GroupV0 {
            members,
            required_power,
        })))
    }

    #[napi(getter, js_name = "members")]
    pub fn get_members(&self) -> Vec<(IdentifierNAPI, u32)> {
        self.0
            .members()
            .into_iter()
            .map(|(id, power)| (IdentifierNAPI::from(id), power.clone()))
            .collect()
    }

    #[napi(getter, js_name = "requiredPower")]
    pub fn get_required_power(&self) -> u32 {
        self.0.required_power()
    }

    #[napi(setter, js_name = "members")]
    pub fn set_members(
        &mut self,
        js_members: Vec<(IdentifierLikeNAPI, u32)>,
    ) -> Result<(), napi::Error> {
        let members: BTreeMap<Identifier, u32> = js_members
            .into_iter()
            .map(|(id, power)| {
                Ok::<(Identifier, u32), napi::Error>((IdentifierNAPI::try_from(id)?.into(), power))
            })
            .collect::<Result<BTreeMap<Identifier, u32>, napi::Error>>()?;

        self.0.set_members(members);

        Ok(())
    }

    #[napi(setter, js_name = "requiredPower")]
    pub fn set_required_power(&mut self, required_power: u32) {
        self.0.set_required_power(required_power);
    }

    #[napi(js_name = "setMemberRequiredPower")]
    pub fn set_member_required_power(
        &mut self,
        js_member: IdentifierLikeNAPI,
        member_required_power: u32,
    ) -> Result<(), napi::Error> {
        let member = IdentifierNAPI::try_from(js_member)?;

        self.0
            .set_member_power(member.into(), member_required_power);

        Ok(())
    }
}
