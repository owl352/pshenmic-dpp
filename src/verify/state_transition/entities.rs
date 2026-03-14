use dpp::{
    block::{block_info::BlockInfo, epoch::Epoch},
    state_transition::proof_result::StateTransitionProofResult,
    tokens::{
        info::{IdentityTokenInfo, v0::IdentityTokenInfoV0Accessors},
        status::{TokenStatus, v0::TokenStatusV0Accessors},
    },
};
use napi::bindgen_prelude::{Either20, Uint8Array};
use napi_derive::napi;

use crate::{
    batch::token_pricing_schedule::TokenPricingScheduleNAPI,
    data_contract::DataContractNAPI,
    document::DocumentNAPI,
    dynamic_value::{BigIntString, TryToU64},
    identifier::IdentifierNAPI,
    identity::IdentityNAPI,
    masternode_vote::vote::VoteNAPI,
    partial_identity::PartialIdentityNAPI,
    platform_address::PlatformAddressNAPI,
    utils::WithJsError,
    verify::state_transition::utils::state_transition_proof_result_to_js,
};

#[derive(Clone)]
#[napi(js_name = "BlockInfoNAPI")]
pub struct BlockInfoNAPI(BlockInfo);

impl From<BlockInfo> for BlockInfoNAPI {
    fn from(info: BlockInfo) -> Self {
        Self(info)
    }
}

impl From<BlockInfoNAPI> for BlockInfo {
    fn from(info: BlockInfoNAPI) -> Self {
        info.0
    }
}

#[napi]
impl BlockInfoNAPI {
    #[napi(constructor)]
    pub fn new(
        timestamp: BigIntString,
        height: BigIntString,
        core_block_height: u32,
        js_epoch_index: Option<u16>,
    ) -> Result<Self, napi::Error> {
        let epoch = match js_epoch_index {
            Some(epoch_index) => Epoch::new(epoch_index).with_js_error()?,
            None => Epoch::default(),
        };

        Ok(BlockInfoNAPI(BlockInfo {
            time_ms: timestamp.try_to_u64()?,
            height: height.try_to_u64()?,
            core_height: core_block_height,
            epoch,
        }))
    }

    #[napi(getter, js_name = "timeMs")]
    pub fn time_ms(&self) -> BigIntString {
        BigIntString::from_u64(self.0.time_ms)
    }

    #[napi(setter, js_name = "timeMs")]
    pub fn set_time_ms(&mut self, time_ms: BigIntString) -> Result<(), napi::Error> {
        self.0.time_ms = time_ms.try_to_u64()?;
        Ok(())
    }

    #[napi(getter, js_name = "height")]
    pub fn height(&self) -> BigIntString {
        BigIntString::from_u64(self.0.height)
    }

    #[napi(setter, js_name = "height")]
    pub fn set_height(&mut self, height: BigIntString) -> Result<(), napi::Error> {
        self.0.height = height.try_to_u64()?;
        Ok(())
    }

    #[napi(getter, js_name = "coreHeight")]
    pub fn core_height(&self) -> u32 {
        self.0.core_height
    }

    #[napi(setter, js_name = "coreHeight")]
    pub fn set_core_height(&mut self, core_height: u32) {
        self.0.core_height = core_height
    }

    #[napi(getter, js_name = "epochIndex")]
    pub fn epoch_index(&self) -> u16 {
        self.0.epoch.index
    }

    #[napi(setter, js_name = "epochIndex")]
    pub fn set_epoch_index(&mut self, epoch_index: u16) {
        self.0.epoch.index = epoch_index
    }

    #[napi(getter, js_name = "epochKey")]
    pub fn epoch_key(&self) -> Uint8Array {
        self.0.epoch.key.to_vec().into()
    }

    #[napi(setter, js_name = "epochKey")]
    pub fn set_epoch_key(&mut self, epoch_key: Uint8Array) -> Result<(), napi::Error> {
        self.0.epoch.key = epoch_key.to_vec().as_slice().try_into().map_err(|_| {
            napi::Error::new(
                napi::Status::InvalidArg,
                "Cannot convert epoch key bytes to slice",
            )
        })?;
        Ok(())
    }
}

#[napi(js_name = "VerifiedStateTransitionResultNAPI")]
pub struct VerifiedStateTransitionResultNAPI {
    pub root_hash: Uint8Array,
    pub(crate) result: StateTransitionProofResult,
}

#[napi]
impl VerifiedStateTransitionResultNAPI {
    #[napi(getter, js_name = "result")]
    pub fn result(
        &self,
    ) -> Result<
        Either20<
            DataContractNAPI,
            IdentityNAPI,
            IdentifierNAPI,
            VerifiedIdentityBalanceNAPI,
            VerifiedIdentityTokenInfoNAPI,
            VerifiedTokenPricingScheduleNAPI,
            TokenStatusNAPI,
            Vec<VerifiedIdentityBalanceNAPI>,
            PartialIdentityNAPI,
            VerifiedBalanceTransferNAPI,
            Vec<VerifiedDocumentNAPI>,
            DocumentNAPI,
            VerifiedTokenGroupActionWithDocumentNAPI,
            VerifiedTokenGroupActionWithTokenBalanceNAPI,
            VerifiedTokenGroupActionWithTokenIdentityInfoNAPI,
            VerifiedTokenGroupActionWithTokenPricingScheduleNAPI,
            VoteNAPI,
            Vec<PlatformAddressInfoNAPI>,
            VerifiedIdentityFullWithAddressInfosNAPI,
            VerifiedIdentityWithAddressInfosNAPI,
        >,
        napi::Error,
    > {
        state_transition_proof_result_to_js(&self.result)
    }
}

#[derive(Clone)]
#[napi(js_name = "IdentityTokenInfoNAPI")]
pub struct IdentityTokenInfoNAPI(IdentityTokenInfo);

impl From<IdentityTokenInfo> for IdentityTokenInfoNAPI {
    fn from(info: IdentityTokenInfo) -> Self {
        Self(info)
    }
}

#[napi]
impl IdentityTokenInfoNAPI {
    #[napi(getter, js_name = "frozen")]
    pub fn frozen(&self) -> bool {
        self.0.frozen()
    }

    #[napi(setter, js_name = "frozen")]
    pub fn set_frozen(&mut self, frozen: bool) {
        self.0.set_frozen(frozen);
    }
}

#[napi(js_name = "TokenStatusNAPI")]
pub struct TokenStatusNAPI(TokenStatus);

impl From<TokenStatus> for TokenStatusNAPI {
    fn from(status: TokenStatus) -> Self {
        Self(status)
    }
}

#[napi]
impl TokenStatusNAPI {
    #[napi(getter, js_name = "paused")]
    pub fn paused(&self) -> bool {
        self.0.paused()
    }

    #[napi(setter, js_name = "paused")]
    pub fn set_paused(&mut self, paused: bool) {
        self.0.set_paused(paused)
    }
}

#[derive(Clone)]
#[napi(js_name = "IdentityTokenBalanceNAPI")]
pub struct VerifiedIdentityBalanceNAPI {
    pub(crate) id: IdentifierNAPI,
    pub balance: BigIntString,
}

#[napi]
impl VerifiedIdentityBalanceNAPI {
    #[napi(getter, js_name = "id")]
    pub fn id(&self) -> IdentifierNAPI {
        self.id.clone()
    }
}

#[napi(js_name = "VerifiedIdentityTokenInfoNAPI")]
pub struct VerifiedIdentityTokenInfoNAPI {
    pub(crate) id: IdentifierNAPI,
    pub(crate) identity_token_info: IdentityTokenInfoNAPI,
}

#[napi]
impl VerifiedIdentityTokenInfoNAPI {
    #[napi(getter, js_name = "id")]
    pub fn id(&self) -> IdentifierNAPI {
        self.id.clone()
    }

    #[napi(getter, js_name = "identityTokenInfo")]
    pub fn identity_token_info(&self) -> IdentityTokenInfoNAPI {
        self.identity_token_info.clone()
    }
}

#[derive(Clone)]
#[napi(js_name = "VerifiedTokenPricingScheduleNAPI")]
pub struct VerifiedTokenPricingScheduleNAPI {
    pub(crate) id: IdentifierNAPI,
    pub(crate) pricing_sheldule: Option<TokenPricingScheduleNAPI>,
}

#[napi]
impl VerifiedTokenPricingScheduleNAPI {
    #[napi(getter, js_name = "id")]
    pub fn id(&self) -> IdentifierNAPI {
        self.id.clone()
    }

    #[napi(getter, js_name = "pricingSchedule")]
    pub fn pricing_schedule(&self) -> Option<TokenPricingScheduleNAPI> {
        self.pricing_sheldule.clone()
    }
}

#[napi(js_name = "VerifiedBalanceTransferNAPI")]
pub struct VerifiedBalanceTransferNAPI {
    pub(crate) sender: PartialIdentityNAPI,
    pub(crate) recipient: PartialIdentityNAPI,
}

#[napi]
impl VerifiedBalanceTransferNAPI {
    #[napi(getter, js_name = "sender")]
    pub fn sender(&self) -> PartialIdentityNAPI {
        self.sender.clone()
    }

    #[napi(getter, js_name = "recipient")]
    pub fn recipient(&self) -> PartialIdentityNAPI {
        self.recipient.clone()
    }
}

#[napi(js_name = "VerifiedDocumentNAPI")]
pub struct VerifiedDocumentNAPI {
    pub(crate) id: IdentifierNAPI,
    pub(crate) document: Option<DocumentNAPI>,
}

#[napi]
impl VerifiedDocumentNAPI {
    #[napi(getter, js_name = "id")]
    pub fn id(&self) -> IdentifierNAPI {
        self.id.clone()
    }

    #[napi(getter, js_name = "document")]
    pub fn document(&self) -> Option<DocumentNAPI> {
        self.document.clone()
    }
}

#[napi(js_name = "VerifiedTokenGroupActionWithDocumentNAPI")]
pub struct VerifiedTokenGroupActionWithDocumentNAPI {
    pub group_sum_power: u32,
    pub(crate) document: Option<DocumentNAPI>,
}

#[napi]
impl VerifiedTokenGroupActionWithDocumentNAPI {
    #[napi(getter, js_name = "document")]
    pub fn document(&self) -> Option<DocumentNAPI> {
        self.document.clone()
    }
}

#[napi(js_name = "VerifiedTokenGroupActionWithTokenBalanceNAPI")]
pub struct VerifiedTokenGroupActionWithTokenBalanceNAPI {
    pub group_sum_power: u32,
    pub group_action_status: String,
    pub amount: Option<BigIntString>,
}

#[napi(js_name = "VerifiedTokenGroupActionWithTokenIdentityInfoNAPI")]
pub struct VerifiedTokenGroupActionWithTokenIdentityInfoNAPI {
    pub group_sum_power: u32,
    pub group_action_status: String,
    pub(crate) identity_token_info: Option<IdentityTokenInfoNAPI>,
}

#[napi]
impl VerifiedTokenGroupActionWithTokenIdentityInfoNAPI {
    #[napi(getter, js_name = "identityTokenInfo")]
    pub fn identity_token_info(&self) -> Option<IdentityTokenInfoNAPI> {
        self.identity_token_info.clone()
    }
}

#[napi(js_name = "VerifiedTokenGroupActionWithTokenPricingScheduleNAPI")]
pub struct VerifiedTokenGroupActionWithTokenPricingScheduleNAPI {
    pub group_sum_power: u32,
    pub group_action_status: String,
    pub(crate) pricing_schedule: Option<TokenPricingScheduleNAPI>,
}

#[napi]
impl VerifiedTokenGroupActionWithTokenPricingScheduleNAPI {
    #[napi(getter, js_name = "pricingSchedule")]
    pub fn pricing_schedule(&self) -> Option<TokenPricingScheduleNAPI> {
        self.pricing_schedule.clone()
    }
}

#[derive(Clone)]
#[napi(js_name = "PlatformAddressInfoNAPI")]
pub struct PlatformAddressInfoNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub nonce: Option<u32>,
    pub(crate) balance: Option<BigIntString>,
}

#[napi]
impl PlatformAddressInfoNAPI {
    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> Option<BigIntString> {
        self.balance.clone()
    }
}

#[napi(js_name = "VerifiedIdentityFullWithAddressInfosNAPI")]
pub struct VerifiedIdentityFullWithAddressInfosNAPI {
    pub(crate) identity: IdentityNAPI,
    pub(crate) infos: Vec<PlatformAddressInfoNAPI>,
}

#[napi]
impl VerifiedIdentityFullWithAddressInfosNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> IdentityNAPI {
        self.identity.clone()
    }

    #[napi(getter, js_name = "infos")]
    pub fn infos(&self) -> Vec<PlatformAddressInfoNAPI> {
        self.infos.clone()
    }
}

#[napi(js_name = "VerifiedIdentityWithAddressInfosNAPI")]
pub struct VerifiedIdentityWithAddressInfosNAPI {
    pub(crate) identity: PartialIdentityNAPI,
    pub(crate) infos: Vec<PlatformAddressInfoNAPI>,
}

#[napi]
impl VerifiedIdentityWithAddressInfosNAPI {
    #[napi(getter, js_name = "identity")]
    pub fn identity(&self) -> PartialIdentityNAPI {
        self.identity.clone()
    }

    #[napi(getter, js_name = "infos")]
    pub fn infos(&self) -> Vec<PlatformAddressInfoNAPI> {
        self.infos.clone()
    }
}
