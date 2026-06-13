use crate::{
    data_contract::DataContractNAPI,
    document::DocumentNAPI,
    dynamic_value::{BigIntString, TryToU64},
    enums::group_action_status::GroupActionStatusNAPI,
    identifier::IdentifierNAPI,
    identity::IdentityNAPI,
    masternode_vote::vote::VoteNAPI,
    partial_identity::PartialIdentityNAPI,
    verify::state_transition::entities::{
        IdentityTokenInfoNAPI, PlatformAddressInfoNAPI, StoredAssetLockInfoNAPI, TokenStatusNAPI,
        VerifiedBalanceTransferNAPI, VerifiedDocumentNAPI, VerifiedIdentityBalanceNAPI,
        VerifiedIdentityFullWithAddressInfosNAPI, VerifiedIdentityTokenInfoNAPI,
        VerifiedIdentityWithAddressInfosNAPI, VerifiedTokenGroupActionWithDocumentNAPI,
        VerifiedTokenGroupActionWithTokenBalanceNAPI,
        VerifiedTokenGroupActionWithTokenIdentityInfoNAPI,
        VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, VerifiedTokenPricingScheduleNAPI,
    },
};
use dpp::state_transition::proof_result::StateTransitionProofResult;
use napi::bindgen_prelude::{Either26, Uint8Array};

pub fn state_transition_proof_result_to_js(
    proof_result: &StateTransitionProofResult,
) -> Result<
    Either26<
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
        StoredAssetLockInfoNAPI,
        Vec<(Uint8Array, bool)>,
        (Vec<(Uint8Array, bool)>, Vec<PlatformAddressInfoNAPI>),
        (Vec<(Uint8Array, bool)>, Vec<VerifiedDocumentNAPI>),
        (StoredAssetLockInfoNAPI, Vec<PlatformAddressInfoNAPI>),
        (IdentityNAPI, Vec<(Uint8Array, bool)>),
    >,
    napi::Error,
> {
    match proof_result {
        StateTransitionProofResult::VerifiedDataContract(data_contract) => {
            Ok(Either26::A(DataContractNAPI::from(data_contract.clone())))
        }
        StateTransitionProofResult::VerifiedIdentity(identity) => {
            Ok(Either26::B(IdentityNAPI::from(identity.clone())))
        }
        StateTransitionProofResult::VerifiedTokenBalanceAbsence(id) => {
            Ok(Either26::C(IdentifierNAPI::from(id.clone())))
        }
        StateTransitionProofResult::VerifiedTokenBalance(id, balance) => {
            Ok(Either26::D(VerifiedIdentityBalanceNAPI {
                id: IdentifierNAPI::from(id.clone()),
                balance: BigIntString::from_u64(balance.clone()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenIdentityInfo(id, info) => {
            Ok(Either26::E(VerifiedIdentityTokenInfoNAPI {
                id: IdentifierNAPI::from(id.clone()),
                identity_token_info: IdentityTokenInfoNAPI::from(info.clone()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenPricingSchedule(id, schedule) => {
            Ok(Either26::F(VerifiedTokenPricingScheduleNAPI {
                id: IdentifierNAPI::from(id.clone()),
                pricing_sheldule: schedule.clone().map(|schedule| schedule.clone().into()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenStatus(token_status) => {
            Ok(Either26::G(token_status.clone().into()))
        }
        StateTransitionProofResult::VerifiedTokenIdentitiesBalances(balances) => {
            let mut js_balances: Vec<VerifiedIdentityBalanceNAPI> = Vec::new();
            for (id, balance) in balances.iter() {
                js_balances.push(VerifiedIdentityBalanceNAPI {
                    id: id.clone().into(),
                    balance: BigIntString::from_u64(balance.clone()),
                });
            }

            Ok(Either26::H(js_balances))
        }
        StateTransitionProofResult::VerifiedPartialIdentity(partial_identity) => {
            Ok(Either26::I(partial_identity.clone().into()))
        }
        StateTransitionProofResult::VerifiedBalanceTransfer(sender, recipient) => {
            Ok(Either26::J(VerifiedBalanceTransferNAPI {
                sender: sender.clone().into(),
                recipient: recipient.clone().into(),
            }))
        }
        StateTransitionProofResult::VerifiedDocuments(documents) => {
            let mut js_documents: Vec<VerifiedDocumentNAPI> = Vec::new();
            for (id, document) in documents.iter() {
                js_documents.push(VerifiedDocumentNAPI {
                    id: id.clone().into(),
                    document: document.clone().map(|doc| doc.clone().into()),
                });
            }

            Ok(Either26::K(js_documents))
        }
        StateTransitionProofResult::VerifiedTokenActionWithDocument(document) => {
            Ok(Either26::L(document.clone().into()))
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithDocument(group_power, document) => {
            Ok(Either26::M(VerifiedTokenGroupActionWithDocumentNAPI {
                group_sum_power: group_power.clone(),
                document: document.clone().map(DocumentNAPI::from).into(),
            }))
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenBalance(
            group_power,
            group_action_status,
            amount,
        ) => Ok(Either26::N(VerifiedTokenGroupActionWithTokenBalanceNAPI {
            group_sum_power: group_power.clone(),
            group_action_status: GroupActionStatusNAPI::from(group_action_status.clone()).into(),
            amount: amount.clone().map(BigIntString::from_u64),
        })),
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenIdentityInfo(
            group_power,
            group_action_status,
            identity_token_info,
        ) => Ok(Either26::O(
            VerifiedTokenGroupActionWithTokenIdentityInfoNAPI {
                group_sum_power: group_power.clone(),
                group_action_status: GroupActionStatusNAPI::from(group_action_status.clone())
                    .into(),
                identity_token_info: identity_token_info.clone().map(Into::into),
            },
        )),
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenPricingSchedule(
            group_power,
            group_action_status,
            pricing_schedule,
        ) => Ok(Either26::P(
            VerifiedTokenGroupActionWithTokenPricingScheduleNAPI {
                group_sum_power: group_power.clone(),
                group_action_status: GroupActionStatusNAPI::from(group_action_status.clone())
                    .into(),
                pricing_schedule: pricing_schedule.clone().map(Into::into),
            },
        )),
        StateTransitionProofResult::VerifiedMasternodeVote(mn_vote) => {
            Ok(Either26::Q(mn_vote.clone().into()))
        }
        StateTransitionProofResult::VerifiedNextDistribution(vote) => {
            Ok(Either26::Q(vote.clone().into()))
        }
        StateTransitionProofResult::VerifiedAddressInfos(infos) => {
            let mut infos_arr: Vec<PlatformAddressInfoNAPI> = Vec::new();

            for (address, amounts) in infos.iter() {
                infos_arr.push(PlatformAddressInfoNAPI {
                    address: address.clone().into(),
                    nonce: amounts.clone().map(|(nonce, _)| nonce),
                    balance: amounts
                        .clone()
                        .map(|(_, credits)| BigIntString::from_u64(credits)),
                });
            }

            Ok(Either26::R(infos_arr))
        }
        StateTransitionProofResult::VerifiedIdentityFullWithAddressInfos(identity, infos) => {
            let mut infos_arr: Vec<PlatformAddressInfoNAPI> = Vec::new();

            for (address, amounts) in infos.iter() {
                infos_arr.push(PlatformAddressInfoNAPI {
                    address: address.clone().into(),
                    nonce: amounts.clone().map(|(nonce, _)| nonce),
                    balance: amounts
                        .clone()
                        .map(|(_, credits)| BigIntString::from_u64(credits)),
                });
            }

            Ok(Either26::S(VerifiedIdentityFullWithAddressInfosNAPI {
                identity: identity.clone().into(),
                infos: infos_arr,
            }))
        }
        StateTransitionProofResult::VerifiedIdentityWithAddressInfos(identity, infos) => {
            let mut infos_arr: Vec<PlatformAddressInfoNAPI> = Vec::new();

            for (address, amounts) in infos.iter() {
                infos_arr.push(PlatformAddressInfoNAPI {
                    address: address.clone().into(),
                    nonce: amounts.clone().map(|(nonce, _)| nonce),
                    balance: amounts
                        .clone()
                        .map(|(_, credits)| BigIntString::from_u64(credits)),
                });
            }

            Ok(Either26::T(VerifiedIdentityWithAddressInfosNAPI {
                identity: identity.clone().into(),
                infos: infos_arr,
            }))
        }
        StateTransitionProofResult::VerifiedAssetLockConsumed(stored_asset_lock_info) => {
            let v = match stored_asset_lock_info {
                dpp::asset_lock::StoredAssetLockInfo::FullyConsumed => {
                    dpp::asset_lock::StoredAssetLockInfo::FullyConsumed
                }
                dpp::asset_lock::StoredAssetLockInfo::PartiallyConsumed(asset_lock_value) => {
                    dpp::asset_lock::StoredAssetLockInfo::PartiallyConsumed(
                        asset_lock_value.clone(),
                    )
                }
                dpp::asset_lock::StoredAssetLockInfo::NotPresent => {
                    dpp::asset_lock::StoredAssetLockInfo::NotPresent
                }
            };

            Ok(Either26::U(v.into()))
        }
        StateTransitionProofResult::VerifiedShieldedNullifiers(items) => Ok(Either26::V(
            items
                .iter()
                .map(|(bytes, flag)| (bytes.clone().into(), flag.clone()))
                .collect(),
        )),
        StateTransitionProofResult::VerifiedShieldedNullifiersWithAddressInfos(items, infos) => {
            let mut infos_arr: Vec<PlatformAddressInfoNAPI> = Vec::new();

            for (address, amounts) in infos.iter() {
                infos_arr.push(PlatformAddressInfoNAPI {
                    address: address.clone().into(),
                    nonce: amounts.clone().map(|(nonce, _)| nonce),
                    balance: amounts
                        .clone()
                        .map(|(_, credits)| BigIntString::from_u64(credits)),
                });
            }

            Ok(Either26::W((
                items
                    .iter()
                    .map(|(bytes, flag)| (bytes.clone().into(), flag.clone()))
                    .collect(),
                infos_arr,
            )))
        }
        StateTransitionProofResult::VerifiedShieldedNullifiersWithWithdrawalDocument(
            items,
            documents,
        ) => {
            let mut js_documents: Vec<VerifiedDocumentNAPI> = Vec::new();
            for (id, document) in documents.iter() {
                js_documents.push(VerifiedDocumentNAPI {
                    id: id.clone().into(),
                    document: document.clone().map(|doc| doc.clone().into()),
                });
            }

            Ok(Either26::X((
                items
                    .iter()
                    .map(|(bytes, flag)| (bytes.clone().into(), flag.clone()))
                    .collect(),
                js_documents,
            )))
        }
        StateTransitionProofResult::VerifiedAssetLockConsumedWithAddressInfos(
            stored_asset_lock_info,
            infos,
        ) => {
            let v = match stored_asset_lock_info {
                dpp::asset_lock::StoredAssetLockInfo::FullyConsumed => {
                    dpp::asset_lock::StoredAssetLockInfo::FullyConsumed
                }
                dpp::asset_lock::StoredAssetLockInfo::PartiallyConsumed(asset_lock_value) => {
                    dpp::asset_lock::StoredAssetLockInfo::PartiallyConsumed(
                        asset_lock_value.clone(),
                    )
                }
                dpp::asset_lock::StoredAssetLockInfo::NotPresent => {
                    dpp::asset_lock::StoredAssetLockInfo::NotPresent
                }
            };

            let mut infos_arr: Vec<PlatformAddressInfoNAPI> = Vec::new();

            for (address, amounts) in infos.iter() {
                infos_arr.push(PlatformAddressInfoNAPI {
                    address: address.clone().into(),
                    nonce: amounts.clone().map(|(nonce, _)| nonce),
                    balance: amounts
                        .clone()
                        .map(|(_, credits)| BigIntString::from_u64(credits)),
                });
            }

            Ok(Either26::Y((v.into(), infos_arr)))
        }
        StateTransitionProofResult::VerifiedIdentityWithShieldedNullifiers(identity, items) => {
            Ok(Either26::Z((
                identity.clone().into(),
                items
                    .iter()
                    .map(|(bytes, flag)| (bytes.clone().into(), flag.clone()))
                    .collect(),
            )))
        }
    }
}
