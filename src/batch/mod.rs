use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::StateTransitionEstimatedFeeValidation;
use dpp::state_transition::batch_transition::accessors::DocumentsBatchTransitionAccessorsV0;
use dpp::state_transition::batch_transition::batched_transition::BatchedTransition;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransition;
use dpp::state_transition::batch_transition::methods::v0::DocumentsBatchTransitionMethodsV0;
use dpp::state_transition::batch_transition::{
    BatchTransition, BatchTransitionV0, BatchTransitionV1,
};
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike, StateTransitionOwned,
    StateTransitionSingleSigned,
};
use dpp::version::PlatformVersion;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::batched_transition::BatchedTransitionNAPI;
use crate::batch::document_transition::DocumentTransitionNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

pub mod batched_transition;
pub mod document_base_transition;
pub mod document_transition;
pub mod generators;
pub mod prefunded_voting_balance;
pub mod token_base_transition;
pub mod token_payment_info;
pub mod token_pricing_schedule;
pub mod token_transition;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "BatchTransitionNAPI")]
pub struct BatchTransitionNAPI(BatchTransition);

impl From<BatchTransition> for BatchTransitionNAPI {
    fn from(batch: BatchTransition) -> Self {
        BatchTransitionNAPI(batch)
    }
}

impl From<BatchTransitionNAPI> for BatchTransition {
    fn from(batch: BatchTransitionNAPI) -> Self {
        batch.0
    }
}

#[napi]
impl BatchTransitionNAPI {
    #[napi(js_name = "fromV1BatchedTransitions")]
    pub fn from_v1_batched_transitions(
        js_batched_transitions: Vec<&BatchedTransitionNAPI>,
        owner_id: IdentifierLikeNAPI,
        user_fee_increase: Option<u16>,
        signature_public_key_id: Option<u32>,
        signature: Option<Uint8Array>,
    ) -> Result<BatchTransitionNAPI, napi::Error> {
        let transitions: Vec<BatchedTransition> = js_batched_transitions
            .into_iter()
            .map(|tx| tx.clone().into())
            .collect();

        Ok(BatchTransitionNAPI(BatchTransition::V1(
            BatchTransitionV1 {
                owner_id: IdentifierNAPI::try_from(owner_id)?.into(),
                transitions,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: signature_public_key_id.unwrap_or(0u32),
                signature: BinaryData::from(
                    signature.map(|arr| arr.to_vec()).unwrap_or(Vec::new()),
                ),
            },
        )))
    }

    #[napi(js_name = "fromV0Transitions")]
    pub fn from_v0_transitions(
        document_transitions: Vec<&DocumentTransitionNAPI>,
        js_owner_id: IdentifierLikeNAPI,
        user_fee_increase: Option<u16>,
        signature_public_key_id: Option<u32>,
        signature: Option<Uint8Array>,
    ) -> Result<BatchTransitionNAPI, napi::Error> {
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;

        let transitions: Vec<DocumentTransition> = document_transitions
            .clone()
            .into_iter()
            .map(|tx| tx.clone().into())
            .collect();

        Ok(BatchTransitionNAPI(BatchTransition::V0(
            BatchTransitionV0 {
                owner_id: owner_id.into(),
                transitions,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: signature_public_key_id.unwrap_or(0),
                signature: BinaryData::from(
                    signature.map(|arr| arr.to_vec()).unwrap_or(Vec::new()),
                ),
            },
        )))
    }

    #[napi(getter, js_name = "transitions")]
    pub fn get_transitions(&self) -> Vec<BatchedTransitionNAPI> {
        self.0
            .transitions_iter()
            .map(|transition| BatchedTransitionNAPI::from(transition.to_owned_transition()))
            .collect()
    }

    #[napi(setter, js_name = "transitions")]
    pub fn set_transitions(&mut self, js_batched_transitions: Vec<&BatchedTransitionNAPI>) {
        self.0.set_transitions(
            js_batched_transitions
                .into_iter()
                .map(|tx| tx.clone().into())
                .collect(),
        )
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(getter, js_name = "allPurchasesAmount")]
    pub fn get_all_purchases_amount(&self) -> Result<Option<BigIntString>, napi::Error> {
        Ok(self
            .0
            .all_document_purchases_amount()
            .with_js_error()?
            .map(BigIntString::from_u64))
    }

    #[napi(getter, js_name = "ownerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        self.0.owner_id().into()
    }

    #[napi(getter, js_name = "modifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Vec<IdentifierNAPI> {
        self.0
            .modified_data_ids()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "allConflictingIndexCollateralVotingFunds")]
    pub fn get_all_conflicting_index_collateral_voting_funds(
        &self,
    ) -> Result<Option<BigIntString>, napi::Error> {
        Ok(self
            .0
            .all_conflicting_index_collateral_voting_funds()
            .with_js_error()?
            .map(BigIntString::from_u64))
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, js_signature: Uint8Array) {
        self.0
            .set_signature(BinaryData::from(js_signature.to_vec()))
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: u32) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[napi(js_name = "setIdentityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_identity_contract_nonce(nonce.try_to_u64()?);
        Ok(())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        let st = StateTransition::from(self.0.clone());

        StateTransitionNAPI::from(st)
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        state_transition: &StateTransitionNAPI,
    ) -> Result<BatchTransitionNAPI, napi::Error> {
        let rs_transition: StateTransition = StateTransition::from(state_transition.clone());

        match rs_transition {
            StateTransition::Batch(batch) => Ok(BatchTransitionNAPI(batch)),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state document_transition content",
            )),
        }
    }

    #[napi(js_name = "calculateMinRequiredFee")]
    pub fn calculate_min_required_fee(
        &self,
        js_platform_version: Option<PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: PlatformVersion = js_platform_version.unwrap_or_default().into();

        self.0
            .calculate_min_required_fee(&platform_version)
            .map(BigIntString::from_u64)
            .with_js_error()
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(bytes.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<BatchTransitionNAPI, napi::Error> {
        let rs_batch =
            BatchTransition::deserialize_from_bytes(bytes.to_vec().as_slice()).with_js_error()?;

        Ok(BatchTransitionNAPI::from(rs_batch))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<BatchTransitionNAPI, napi::Error> {
        BatchTransitionNAPI::from_bytes(
            decode(base64.as_str(), Base64)
                .map_err(|error| napi::Error::new(napi::Status::InvalidArg, error))?
                .into(),
        )
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<BatchTransitionNAPI, napi::Error> {
        BatchTransitionNAPI::from_bytes(
            decode(hex.as_str(), Hex)
                .map_err(|error| napi::Error::new(napi::Status::InvalidArg, error))?
                .into(),
        )
    }
}
