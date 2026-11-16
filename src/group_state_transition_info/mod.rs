use dpp::bincode;
use dpp::group::GroupStateTransitionInfo;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{dynamic_value::IdentifierLikeNAPI, identifier::IdentifierNAPI};

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name=GroupStateTransitionInfoNAPI)]
pub struct GroupStateTransitionInfoNAPI(GroupStateTransitionInfo);

impl From<GroupStateTransitionInfoNAPI> for GroupStateTransitionInfo {
    fn from(info: GroupStateTransitionInfoNAPI) -> Self {
        info.0
    }
}

impl From<GroupStateTransitionInfo> for GroupStateTransitionInfoNAPI {
    fn from(info: GroupStateTransitionInfo) -> Self {
        GroupStateTransitionInfoNAPI(info)
    }
}

#[napi]
impl GroupStateTransitionInfoNAPI {
    #[napi(constructor)]
    pub fn new(
        group_contract_position: u16,
        action_id: IdentifierLikeNAPI,
        action_is_proposer: bool,
    ) -> Result<GroupStateTransitionInfoNAPI, napi::Error> {
        Ok(GroupStateTransitionInfoNAPI(GroupStateTransitionInfo {
            group_contract_position,
            action_id: IdentifierNAPI::try_from(action_id)?.into(),
            action_is_proposer,
        }))
    }

    /// Consensus bincode encoding of the info (the domain `Encode` derive),
    /// used to cross the base <-> shielded instance boundary as bytes.
    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Result<Uint8Array, napi::Error> {
        let config = bincode::config::standard().with_big_endian();

        Ok(bincode::encode_to_vec(&self.0, config)
            .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?
            .into())
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<Self, napi::Error> {
        let config = bincode::config::standard().with_big_endian();

        let (info, _) = bincode::decode_from_slice_untrusted::<GroupStateTransitionInfo, _>(
            &bytes.to_vec(),
            config,
        )
        .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Ok(Self(info))
    }

    #[napi(setter, js_name = "groupContractPosition")]
    pub fn set_group_contract_position(&mut self, group_contract_position: u16) {
        self.0.group_contract_position = group_contract_position;
    }

    #[napi(setter, js_name = "actionId")]
    pub fn set_action_id(&mut self, action_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0.action_id = IdentifierNAPI::try_from(action_id)?.into();
        Ok(())
    }

    #[napi(setter, js_name = "actionIsProposer")]
    pub fn set_action_is_proposer(&mut self, action_is_proposer: bool) {
        self.0.action_is_proposer = action_is_proposer;
    }

    #[napi(getter, js_name = "groupContractPosition")]
    pub fn get_group_contract_position(&mut self) -> u16 {
        self.0.group_contract_position
    }

    #[napi(getter, js_name = "actionId")]
    pub fn get_action_id(&self) -> IdentifierNAPI {
        self.0.action_id.into()
    }

    #[napi(getter, js_name = "actionIsProposer")]
    pub fn get_action_is_proposer(&self) -> bool {
        self.0.action_is_proposer
    }
}
