use dpp::identity::core_script::CoreScript;
use dpp::identity::state_transition::OptionallyAssetLockProved;
use dpp::platform_value::Identifier;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::StateTransitionEstimatedFeeValidation;
use dpp::state_transition::StateTransitionHasUserFeeIncrease;
use dpp::state_transition::identity_credit_withdrawal_transition::IdentityCreditWithdrawalTransition;
use dpp::state_transition::identity_credit_withdrawal_transition::accessors::IdentityCreditWithdrawalTransitionAccessorsV0;
use dpp::state_transition::identity_credit_withdrawal_transition::v1::IdentityCreditWithdrawalTransitionV1;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionLike,
    StateTransitionSingleSigned,
};
use dpp::version::PlatformVersion;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::core_script::CoreScriptNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::enums::pooling::PoolingNAPI;
use crate::enums::purpose::PurposeNAPI;
use crate::identifier::IdentifierNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::WithJsError;

#[napi(js_name = "IdentityCreditWithdrawalTransitionNAPI")]
pub struct IdentityCreditWithdrawalTransitionNAPI(IdentityCreditWithdrawalTransition);

#[napi]
impl IdentityCreditWithdrawalTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_identity_id: IdentifierLikeNAPI,
        amount: BigIntString,
        core_fee_per_byte: u32,
        js_pooling: &DynamicValue,
        nonce: BigIntString,
        js_output_script: Option<&CoreScriptNAPI>,
        user_fee_increase: Option<u16>,
    ) -> Result<IdentityCreditWithdrawalTransitionNAPI, napi::Error> {
        let pooling = PoolingNAPI::try_from(js_pooling)?;
        let identity_id: Identifier = IdentifierNAPI::try_from(js_identity_id)?.into();

        let output_script: Option<CoreScript> =
            js_output_script.map(|script| script.clone().into());

        Ok(IdentityCreditWithdrawalTransitionNAPI(
            IdentityCreditWithdrawalTransition::V1(IdentityCreditWithdrawalTransitionV1 {
                amount: amount.try_to_u64()?,
                identity_id,
                output_script,
                core_fee_per_byte,
                pooling: pooling.into(),
                nonce: nonce.try_to_u64()?,
                user_fee_increase: user_fee_increase.unwrap_or(0),
                signature_public_key_id: 0,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "outputScript")]
    pub fn get_output_script(&self) -> Option<CoreScriptNAPI> {
        self.0.output_script().map(|script| script.into())
    }

    #[napi(getter, js_name = "pooling")]
    pub fn get_pooling(&self) -> String {
        PoolingNAPI::from(self.0.pooling()).into()
    }

    #[napi(getter, js_name = "identityId")]
    pub fn get_identity_id(&self) -> IdentifierNAPI {
        IdentifierNAPI::from(self.0.identity_id())
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "nonce")]
    pub fn get_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.nonce())
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        BigIntString::from_u64(self.0.amount())
    }

    #[napi(js_name = "getPurposeRequirement")]
    pub fn get_purpose_requirement(&self) -> Vec<String> {
        self.0
            .purpose_requirement()
            .iter()
            .map(|purpose| PurposeNAPI::from(purpose.clone()).into())
            .collect()
    }

    #[napi(js_name = "getModifiedDataIds")]
    pub fn get_modified_data_ids(&self) -> Vec<IdentifierNAPI> {
        self.0
            .modified_data_ids()
            .iter()
            .map(|id| id.clone().into())
            .collect()
    }

    #[napi(js_name = "getOptionalAssetLockProof")]
    pub fn get_optional_asset_lock_proof(&self) -> Option<AssetLockProofNAPI> {
        self.0
            .optional_asset_lock_proof()
            .map(|proof| AssetLockProofNAPI::from(proof.clone()))
    }

    #[napi(setter, js_name = "outputScript")]
    pub fn set_output_script(&mut self, js_script: Option<&CoreScriptNAPI>) {
        self.0
            .set_output_script(js_script.map(|script| script.clone().into()))
    }

    #[napi(setter, js_name = "pooling")]
    pub fn set_pooling(&mut self, js_pooling: &DynamicValue) -> Result<(), napi::Error> {
        let pooling: PoolingNAPI = PoolingNAPI::try_from(js_pooling)?;
        Ok(self.0.set_pooling(pooling.into()))
    }

    #[napi(setter, js_name = "identityId")]
    pub fn set_identity_id(
        &mut self,
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;

        Ok(self.0.set_identity_id(identity_id.into()))
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase);
    }

    #[napi(setter, js_name = "nonce")]
    pub fn set_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_nonce(nonce.try_to_u64()?);

        Ok(())
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        self.0.set_amount(amount.try_to_u64()?);

        Ok(())
    }

    #[napi(setter, js_name = "coreFeePerByte")]
    pub fn set_core_fee_per_byte(&mut self, fee_per_byte: u32) {
        self.0.set_core_fee_per_byte(fee_per_byte)
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(getter, js_name = "coreFeePerByte")]
    pub fn get_core_fee_per_byte(&self) -> u32 {
        self.0.core_fee_per_byte()
    }

    #[napi(js_name = "getSignableBytes")]
    pub fn get_signable_bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.signable_bytes().with_js_error()?.into())
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> u32 {
        self.0.signature_public_key_id()
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature_bytes(signature.to_vec())
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, signature_public_key_id: u32) {
        self.0.set_signature_public_key_id(signature_public_key_id)
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityCreditWithdrawalTransitionNAPI, napi::Error> {
        let bytes = decode(hex.as_str(), Hex)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        IdentityCreditWithdrawalTransitionNAPI::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(
        base64: String,
    ) -> Result<IdentityCreditWithdrawalTransitionNAPI, napi::Error> {
        let bytes = decode(base64.as_str(), Base64)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        IdentityCreditWithdrawalTransitionNAPI::from_bytes(bytes.into())
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
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
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
    pub fn from_bytes(
        js_bytes: Uint8Array,
    ) -> Result<IdentityCreditWithdrawalTransitionNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let rs_transition =
            IdentityCreditWithdrawalTransition::deserialize_from_bytes(bytes.as_slice())
                .with_js_error()?;

        Ok(IdentityCreditWithdrawalTransitionNAPI(rs_transition))
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityCreditWithdrawalTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreditWithdrawal(st) => {
                Ok(IdentityCreditWithdrawalTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type",
            )),
        }
    }
}
