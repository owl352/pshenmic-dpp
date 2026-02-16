pub mod resource_vote_choice;
pub mod vote;
pub mod vote_poll;

use dpp::identity::state_transition::OptionallyAssetLockProved;
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{self, Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::masternode_vote_transition::MasternodeVoteTransition;
use dpp::state_transition::masternode_vote_transition::accessors::MasternodeVoteTransitionAccessorsV0;
use dpp::state_transition::masternode_vote_transition::v0::MasternodeVoteTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike,
    StateTransitionSingleSigned,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::masternode_vote::vote::VoteNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "MasternodeVoteTransitionNAPI")]
#[derive(Clone)]
pub struct MasternodeVoteTransitionNAPI(MasternodeVoteTransition);

impl From<MasternodeVoteTransition> for MasternodeVoteTransitionNAPI {
    fn from(val: MasternodeVoteTransition) -> Self {
        MasternodeVoteTransitionNAPI(val)
    }
}

impl From<MasternodeVoteTransitionNAPI> for MasternodeVoteTransition {
    fn from(val: MasternodeVoteTransitionNAPI) -> Self {
        val.0
    }
}

#[napi]
impl MasternodeVoteTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_pro_tx_hash: IdentifierLikeNAPI,
        js_voter_identity_id: IdentifierLikeNAPI,
        vote: &VoteNAPI,
        nonce: BigIntString,
        signature_public_key: Option<u32>,
        js_signature: Option<Uint8Array>,
    ) -> Result<MasternodeVoteTransitionNAPI, napi::Error> {
        let pro_tx_hash = IdentifierNAPI::try_from(js_pro_tx_hash)?;
        let voter_identity_id = IdentifierNAPI::try_from(js_voter_identity_id)?;

        Ok(MasternodeVoteTransitionNAPI(MasternodeVoteTransition::V0(
            MasternodeVoteTransitionV0 {
                pro_tx_hash: pro_tx_hash.into(),
                voter_identity_id: voter_identity_id.into(),
                vote: vote.clone().into(),
                nonce: nonce.try_to_u64()?,
                signature_public_key_id: signature_public_key.unwrap_or(0),
                signature: BinaryData::from(js_signature.map(|sig| sig.to_vec()).unwrap_or(vec![])),
            },
        )))
    }

    #[napi(getter, js_name = "proTxHash")]
    pub fn pro_tx_hash(&self) -> IdentifierNAPI {
        self.0.pro_tx_hash().into()
    }

    #[napi(getter, js_name = "voterIdentityId")]
    pub fn voter_identity_id(&self) -> IdentifierNAPI {
        self.0.voter_identity_id().into()
    }

    #[napi(getter, js_name = "vote")]
    pub fn vote(&self) -> VoteNAPI {
        self.0.vote().clone().into()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.nonce())
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(getter, js_name = "signature")]
    pub fn signature(&self) -> Uint8Array {
        self.0.signature().clone().to_vec().into()
    }

    #[napi(setter, js_name = "proTxHash")]
    pub fn set_pro_tx_hash(
        &mut self,
        js_pro_tx_hash: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let pro_tx_hash = IdentifierNAPI::try_from(js_pro_tx_hash)?;

        self.0.set_pro_tx_hash(pro_tx_hash.into());

        Ok(())
    }

    #[napi(setter, js_name = "voterIdentityId")]
    pub fn set_voter_identity_id(
        &mut self,
        js_voter_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let voter_identity_id = IdentifierNAPI::try_from(js_voter_identity_id)?;

        self.0.set_voter_identity_id(voter_identity_id.into());

        Ok(())
    }

    #[napi(setter, js_name = "vote")]
    pub fn set_vote(&mut self, vote: &VoteNAPI) {
        self.0.set_vote(vote.clone().into())
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0 = match self.0.clone() {
            MasternodeVoteTransition::V0(mut vote) => {
                vote.nonce = nonce.try_to_u64()?;

                MasternodeVoteTransition::V0(vote)
            }
        };

        Ok(())
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, signature_public_key_id: u32) {
        self.0.set_signature_public_key_id(signature_public_key_id)
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec());
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<MasternodeVoteTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "Invalid hex string"))?;

        MasternodeVoteTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<MasternodeVoteTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "Invalid base64 string"))?;

        MasternodeVoteTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<MasternodeVoteTransitionNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let rs_transition =
            MasternodeVoteTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(MasternodeVoteTransitionNAPI(rs_transition))
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(getter, js_name = "assetLock")]
    pub fn get_asset_lock_proof(&self) -> Option<AssetLockProofNAPI> {
        match self.0.optional_asset_lock_proof().clone() {
            None => None,
            Some(asset_lock_proof) => Some(AssetLockProofNAPI::from(asset_lock_proof.clone())),
        }
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, amount: u16) {
        self.0.set_user_fee_increase(amount)
    }

    #[napi(getter, js_name = "modifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Vec<IdentifierNAPI> {
        self.0
            .modified_data_ids()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::MasternodeVote(self.clone().0))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<MasternodeVoteTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::MasternodeVote(st) => Ok(MasternodeVoteTransitionNAPI(st)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state document_transition type",
            )),
        }
    }
}
