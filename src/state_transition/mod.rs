use dpp::dashcore::secp256k1::hashes::hex::Case::Lower;
use dpp::dashcore::secp256k1::hashes::hex::DisplayHex;
use dpp::data_contract::serialized_version::DataContractInSerializationFormat;
use dpp::identity::KeyType;
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::{Encoding, decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable, Signable};
use dpp::state_transition::StateTransition::{
    Batch, DataContractCreate, DataContractUpdate, IdentityCreditTransfer,
    IdentityCreditWithdrawal, IdentityTopUp, IdentityUpdate, MasternodeVote,
};
use dpp::state_transition::batch_transition::BatchTransition;
use dpp::state_transition::batch_transition::batched_transition::BatchedTransition;
use dpp::state_transition::batch_transition::batched_transition::document_transition::DocumentTransitionV0Methods;
use dpp::state_transition::batch_transition::batched_transition::token_transition::TokenTransitionV0Methods;
use dpp::state_transition::batch_transition::methods::v0::DocumentsBatchTransitionMethodsV0;
use dpp::state_transition::data_contract_create_transition::DataContractCreateTransition;
use dpp::state_transition::data_contract_create_transition::accessors::DataContractCreateTransitionAccessorsV0;
use dpp::state_transition::data_contract_update_transition::DataContractUpdateTransition;
use dpp::state_transition::data_contract_update_transition::accessors::DataContractUpdateTransitionAccessorsV0;
use dpp::state_transition::identity_credit_transfer_transition::accessors::IdentityCreditTransferTransitionAccessorsV0;
use dpp::state_transition::identity_credit_withdrawal_transition::accessors::IdentityCreditWithdrawalTransitionAccessorsV0;
use dpp::state_transition::identity_topup_transition::accessors::IdentityTopUpTransitionAccessorsV0;
use dpp::state_transition::identity_update_transition::accessors::IdentityUpdateTransitionAccessorsV0;
use dpp::state_transition::masternode_vote_transition::MasternodeVoteTransition;
use dpp::state_transition::masternode_vote_transition::accessors::MasternodeVoteTransitionAccessorsV0;
use dpp::state_transition::{
    StateTransition, StateTransitionIdentitySigned, StateTransitionSigningOptions,
};
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;
use sha2::{Digest, Sha256};

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI, Uint64String};
use crate::enums::key_type::KeyTypeNAPI;
use crate::enums::purpose::PurposeNAPI;
use crate::enums::security_level::SecurityLevelNAPI;
use crate::identifier::IdentifierNAPI;
use crate::identity_public_key::IdentityPublicKeyNAPI;
use crate::mock_bls::MockBLS;
use crate::private_key::PrivateKeyNAPI;
use crate::utils::WithJsError;

#[derive(Clone)]
#[napi(js_name = "StateTransitionNAPI")]
pub struct StateTransitionNAPI(StateTransition);

impl From<StateTransition> for StateTransitionNAPI {
    fn from(transition: StateTransition) -> Self {
        StateTransitionNAPI(transition)
    }
}

impl From<StateTransitionNAPI> for StateTransition {
    fn from(transition: StateTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl StateTransitionNAPI {
    #[napi(js_name = "sign")]
    pub fn sign(
        &mut self,
        js_private_key: Either<DynamicValue, &PrivateKeyNAPI>,
        public_key: &IdentityPublicKeyNAPI,
    ) -> Result<Uint8Array, napi::Error> {
        let private_key_bytes = PrivateKeyNAPI::bytes_from_js_value(js_private_key)?.to_vec();

        self.0
            .sign(
                &public_key.clone().into(),
                private_key_bytes.as_slice(),
                &MockBLS {},
            )
            .with_js_error()?;

        self.0
            .serialize_to_bytes()
            .with_js_error()
            .map(|bytes| bytes.into())
    }

    #[napi(js_name = "signByPrivateKey")]
    pub fn sign_by_private_key(
        &mut self,
        js_private_key: Either<DynamicValue, &PrivateKeyNAPI>,
        key_id: Option<u32>,
        js_key_type: Option<DynamicValue>,
    ) -> Result<Uint8Array, napi::Error> {
        let private_key_bytes = PrivateKeyNAPI::bytes_from_js_value(js_private_key)?.to_vec();

        let key_type = match js_key_type.is_none() {
            true => KeyTypeNAPI::ECDSA_SECP256K1,
            false => KeyTypeNAPI::try_from(js_key_type.unwrap())?,
        };

        let _sig = self
            .0
            .sign_by_private_key(
                &private_key_bytes.as_slice(),
                KeyType::from(key_type),
                &MockBLS {},
            )
            .with_js_error();

        match key_id {
            Some(key_id) => self.0.set_signature_public_key_id(key_id),
            None => {}
        }

        self.0
            .serialize_to_bytes()
            .with_js_error()
            .map(|bytes| bytes.into())
    }

    #[napi(js_name = "verifyPublicKey")]
    pub fn verify_public_key(
        &self,
        public_key: &IdentityPublicKeyNAPI,
        js_allow_signing_with_any_security_level: Option<bool>,
        js_allow_signing_with_any_purpose: Option<bool>,
    ) -> Result<(), napi::Error> {
        let allow_signing_with_any_security_level =
            js_allow_signing_with_any_security_level.unwrap_or(false);
        let allow_signing_with_any_purpose = js_allow_signing_with_any_purpose.unwrap_or(false);

        match &self.0 {
            DataContractCreate(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            DataContractUpdate(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            Batch(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            IdentityCreditWithdrawal(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            IdentityUpdate(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            IdentityCreditTransfer(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            MasternodeVote(st) => {
                st.verify_public_key_level_and_purpose(
                    &public_key.clone().into(),
                    StateTransitionSigningOptions {
                        allow_signing_with_any_security_level,
                        allow_signing_with_any_purpose,
                    },
                )
                .with_js_error()?;

                st.verify_public_key_is_enabled(&public_key.clone().into())
                    .with_js_error()?;
            }
            _ => {}
        }

        Ok(())
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(bytes.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(encode(bytes.as_slice(), Encoding::Hex))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        let bytes = self.0.serialize_to_bytes().with_js_error()?;

        Ok(encode(bytes.as_slice(), Encoding::Base64))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<StateTransitionNAPI, napi::Error> {
        let bytes = js_bytes.to_vec();

        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<StateTransitionNAPI, napi::Error> {
        let bytes = decode(&hex, Encoding::Hex)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<StateTransitionNAPI, napi::Error> {
        let bytes = decode(&base64, Encoding::Base64)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        let st = StateTransition::deserialize_from_bytes(bytes.as_slice()).with_js_error()?;

        Ok(st.into())
    }

    #[napi(js_name = "hash")]
    pub fn get_hash(&self, skip_signature: bool) -> Result<String, napi::Error> {
        let payload: Vec<u8>;

        if skip_signature {
            payload = self.0.signable_bytes().with_js_error()?;
        } else {
            payload = dpp::serialization::PlatformSerializable::serialize_to_bytes(&self.0)
                .with_js_error()?;
        }

        Ok(Sha256::digest(payload).to_hex_string(Lower))
    }

    #[napi(js_name = "getActionName")]
    pub fn get_action_name(&self) -> String {
        self.0.name()
    }

    #[napi(js_name = "getActionType")]
    pub fn get_action_type(&self) -> String {
        match self.0 {
            DataContractCreate(_) => "DATA_CONTRACT_CREATE",
            Batch(_) => "BATCH",
            StateTransition::IdentityCreate(_) => "IDENTITY_CREATE",
            IdentityTopUp(_) => "IDENTITY_TOP_UP",
            DataContractUpdate(_) => "DATA_CONTRACT_UPDATE",
            IdentityUpdate(_) => "IDENTITY_UPDATE",
            IdentityCreditWithdrawal(_) => "IDENTITY_CREDIT_WITHDRAWAL",
            IdentityCreditTransfer(_) => "IDENTITY_CREDIT_TRANSFER",
            MasternodeVote(_) => "MASTERNODE_VOTE",
        }
        .to_string()
    }

    #[napi(js_name = "getActionTypeNumber")]
    pub fn get_action_type_number(&self) -> u8 {
        match self.0 {
            DataContractCreate(_) => 0,
            Batch(_) => 1,
            StateTransition::IdentityCreate(_) => 2,
            IdentityTopUp(_) => 3,
            DataContractUpdate(_) => 4,
            IdentityUpdate(_) => 5,
            IdentityCreditWithdrawal(_) => 6,
            IdentityCreditTransfer(_) => 7,
            MasternodeVote(_) => 8,
        }
    }

    #[napi(js_name = "getOwnerId")]
    pub fn get_owner_id(&self) -> IdentifierNAPI {
        self.0.owner_id().into()
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(getter, js_name = "signaturePublicKeyId")]
    pub fn get_signature_public_key_id(&self) -> Option<u32> {
        self.0.signature_public_key_id()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn get_user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(js_name = "getPurposeRequirement")]
    pub fn get_purpose_requirement(&self) -> Option<Vec<String>> {
        let requirements = self.0.purpose_requirement();

        match requirements {
            None => None,
            Some(req) => Some(
                req.iter()
                    .map(|purpose| PurposeNAPI::from(purpose.clone()))
                    .map(String::from)
                    .collect(),
            ),
        }
    }

    #[napi(js_name = "getKeyLevelRequirement")]
    pub fn get_key_level_requirement(
        &self,
        js_purpose: DynamicValue,
    ) -> Result<Option<Vec<String>>, napi::Error> {
        let purpose = PurposeNAPI::try_from(js_purpose)?;

        let requirements = self.0.security_level_requirement(purpose.into());

        match requirements {
            None => Ok(None),
            Some(req) => Ok(Some(
                req.iter()
                    .map(|security_level| SecurityLevelNAPI::from(security_level.clone()))
                    .map(String::from)
                    .collect(),
            )),
        }
    }

    #[napi(js_name = "getIdentityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> Option<Uint64String> {
        match self.0.clone() {
            DataContractCreate(_) => None,
            DataContractUpdate(contract_update) => {
                Some(contract_update.identity_contract_nonce().into())
            }
            Batch(batch) => match batch {
                BatchTransition::V0(v0) => {
                    Some(v0.transitions.first()?.identity_contract_nonce().into())
                }
                BatchTransition::V1(v1) => match v1.transitions.first()? {
                    BatchedTransition::Document(doc_batch) => {
                        Some(doc_batch.identity_contract_nonce().into())
                    }
                    BatchedTransition::Token(token_batch) => {
                        Some(token_batch.identity_contract_nonce().into())
                    }
                },
            },
            StateTransition::IdentityCreate(_) => None,
            IdentityTopUp(_) => None,
            IdentityCreditWithdrawal(_) => None,
            IdentityUpdate(_) => None,
            IdentityCreditTransfer(_) => None,
            MasternodeVote(_) => None,
        }
    }

    #[napi(js_name = "getIdentityNonce")]
    pub fn get_identity_nonce(&self) -> Option<Uint64String> {
        match self.0.clone() {
            DataContractCreate(contract_create) => Some(contract_create.identity_nonce().into()),
            DataContractUpdate(_) => None,
            Batch(_) => None,
            StateTransition::IdentityCreate(_) => None,
            IdentityTopUp(_) => None,
            IdentityCreditWithdrawal(withdrawal) => Some(withdrawal.nonce().into()),
            IdentityUpdate(identity_update) => Some(identity_update.nonce().into()),
            IdentityCreditTransfer(credit_transfer) => Some(credit_transfer.nonce().into()),
            MasternodeVote(mn_vote) => Some(mn_vote.nonce().into()),
        }
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, signature: Uint8Array) {
        self.0.set_signature(BinaryData::from(signature.to_vec()))
    }

    #[napi(setter, js_name = "signaturePublicKeyId")]
    pub fn set_signature_public_key_id(&mut self, key_id: u32) {
        self.0.set_signature_public_key_id(key_id)
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[napi(js_name = "setOwnerId")]
    pub fn set_owner_id(&mut self, js_owner_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let owner_id = IdentifierNAPI::try_from(js_owner_id)?;

        match self.0.clone() {
            DataContractCreate(mut contract_create) => {
                let new_contract = match contract_create.data_contract().clone() {
                    DataContractInSerializationFormat::V0(mut v0) => {
                        v0.owner_id = owner_id.into();

                        DataContractInSerializationFormat::V0(v0)
                    }
                    DataContractInSerializationFormat::V1(mut v1) => {
                        v1.owner_id = owner_id.into();

                        DataContractInSerializationFormat::V1(v1)
                    }
                };

                contract_create.set_data_contract(new_contract);

                self.0 = DataContractCreate(contract_create);
            }
            DataContractUpdate(mut contract_update) => {
                let new_contract = match contract_update.data_contract().clone() {
                    DataContractInSerializationFormat::V0(mut v0) => {
                        v0.owner_id = owner_id.into();

                        DataContractInSerializationFormat::V0(v0)
                    }
                    DataContractInSerializationFormat::V1(mut v1) => {
                        v1.owner_id = owner_id.into();

                        DataContractInSerializationFormat::V1(v1)
                    }
                };

                contract_update.set_data_contract(new_contract);

                self.0 = DataContractUpdate(contract_update);
            }
            Batch(mut batch) => {
                batch = match batch {
                    BatchTransition::V0(mut v0) => {
                        v0.owner_id = owner_id.into();

                        BatchTransition::V0(v0)
                    }
                    BatchTransition::V1(mut v1) => {
                        v1.owner_id = owner_id.into();

                        BatchTransition::V1(v1)
                    }
                };

                self.0 = Batch(batch);
            }
            StateTransition::IdentityCreate(_) => {
                Err(napi::Error::new(
                    napi::Status::GenericFailure,
                    "Cannot set owner for identity create transition",
                ))?;
            }
            IdentityTopUp(mut top_up) => {
                top_up.set_identity_id(owner_id.into());

                self.0 = IdentityTopUp(top_up);
            }
            IdentityCreditWithdrawal(mut withdrawal) => {
                withdrawal.set_identity_id(owner_id.into());

                self.0 = IdentityCreditWithdrawal(withdrawal);
            }
            IdentityUpdate(mut identity_update) => {
                identity_update.set_identity_id(owner_id.into());

                self.0 = IdentityUpdate(identity_update);
            }
            IdentityCreditTransfer(mut credit_transfer) => {
                credit_transfer.set_identity_id(owner_id.into());

                self.0 = IdentityCreditTransfer(credit_transfer);
            }
            MasternodeVote(mut mn_vote) => {
                mn_vote.set_voter_identity_id(owner_id.into());

                self.0 = MasternodeVote(mn_vote);
            }
        };

        Ok(())
    }

    #[napi(js_name = "setIdentityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: Uint64String) -> Result<(), napi::Error> {
        self.0 = match self.0.clone() {
            DataContractCreate(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Data Contract Create",
            ))?,
            DataContractUpdate(contract_update) => match contract_update {
                DataContractUpdateTransition::V0(mut v0) => {
                    v0.identity_contract_nonce = nonce.try_into()?;

                    DataContractUpdateTransition::V0(v0).into()
                }
            },
            Batch(mut batch) => {
                batch.set_identity_contract_nonce(nonce.try_into()?);

                batch.into()
            }
            StateTransition::IdentityCreate(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Identity Create",
            ))?,
            IdentityTopUp(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Identity Top Up",
            ))?,
            IdentityCreditWithdrawal(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Identity Credit Withdrawal",
            ))?,
            IdentityUpdate(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Identity Update",
            ))?,
            IdentityCreditTransfer(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Identity Credit Transfer",
            ))?,
            MasternodeVote(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity contract nonce for Masternode Vote",
            ))?,
        };

        Ok(())
    }

    #[napi(js_name = "setIdentityNonce")]
    pub fn set_identity_nonce(&mut self, nonce: Uint64String) -> Result<(), napi::Error> {
        self.0 = match self.0.clone() {
            DataContractCreate(mut contract_create) => {
                contract_create = match contract_create {
                    DataContractCreateTransition::V0(mut v0) => {
                        v0.identity_nonce = nonce.try_into()?;
                        v0.into()
                    }
                };

                contract_create.into()
            }
            DataContractUpdate(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity nonce for Data Contract Update",
            ))?,
            Batch(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity nonce for Batch",
            ))?,
            StateTransition::IdentityCreate(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity nonce for Identity Create",
            ))?,
            IdentityTopUp(_) => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "Cannot set identity nonce for Identity Top Up",
            ))?,
            IdentityCreditWithdrawal(mut withdrawal) => {
                withdrawal.set_nonce(nonce.try_into()?);

                withdrawal.into()
            }
            IdentityUpdate(mut identity_update) => {
                identity_update.set_nonce(nonce.try_into()?);

                identity_update.into()
            }
            IdentityCreditTransfer(mut credit_transfer) => {
                credit_transfer.set_nonce(nonce.try_into()?);

                credit_transfer.into()
            }
            MasternodeVote(mut mn_vote) => {
                mn_vote = match mn_vote {
                    MasternodeVoteTransition::V0(mut v0) => {
                        v0.nonce = nonce.try_into()?;

                        v0.into()
                    }
                };

                mn_vote.into()
            }
        };

        Ok(())
    }
}
