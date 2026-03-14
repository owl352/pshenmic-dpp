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
        IdentityTokenInfoNAPI, PlatformAddressInfoNAPI, TokenStatusNAPI,
        VerifiedBalanceTransferNAPI, VerifiedDocumentNAPI, VerifiedIdentityBalanceNAPI,
        VerifiedIdentityFullWithAddressInfosNAPI, VerifiedIdentityTokenInfoNAPI,
        VerifiedIdentityWithAddressInfosNAPI, VerifiedTokenGroupActionWithDocumentNAPI,
        VerifiedTokenGroupActionWithTokenBalanceNAPI,
        VerifiedTokenGroupActionWithTokenIdentityInfoNAPI,
        VerifiedTokenGroupActionWithTokenPricingScheduleNAPI, VerifiedTokenPricingScheduleNAPI,
    },
};
use dpp::state_transition::proof_result::StateTransitionProofResult;
use napi::bindgen_prelude::Either20;

pub fn state_transition_proof_result_to_js(
    proof_result: &StateTransitionProofResult,
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
    match proof_result {
        StateTransitionProofResult::VerifiedDataContract(data_contract) => {
            Ok(Either20::A(DataContractNAPI::from(data_contract.clone())))
        }
        StateTransitionProofResult::VerifiedIdentity(identity) => {
            Ok(Either20::B(IdentityNAPI::from(identity.clone())))
        }
        StateTransitionProofResult::VerifiedTokenBalanceAbsence(id) => {
            Ok(Either20::C(IdentifierNAPI::from(id.clone())))
        }
        StateTransitionProofResult::VerifiedTokenBalance(id, balance) => {
            Ok(Either20::D(VerifiedIdentityBalanceNAPI {
                id: IdentifierNAPI::from(id.clone()),
                balance: BigIntString::from_u64(balance.clone()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenIdentityInfo(id, info) => {
            Ok(Either20::E(VerifiedIdentityTokenInfoNAPI {
                id: IdentifierNAPI::from(id.clone()),
                identity_token_info: IdentityTokenInfoNAPI::from(info.clone()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenPricingSchedule(id, schedule) => {
            Ok(Either20::F(VerifiedTokenPricingScheduleNAPI {
                id: IdentifierNAPI::from(id.clone()),
                pricing_sheldule: schedule.clone().map(|schedule| schedule.clone().into()),
            }))
        }
        StateTransitionProofResult::VerifiedTokenStatus(token_status) => {
            Ok(Either20::G(token_status.clone().into()))
        }
        StateTransitionProofResult::VerifiedTokenIdentitiesBalances(balances) => {
            let mut js_balances: Vec<VerifiedIdentityBalanceNAPI> = Vec::new();
            for (id, balance) in balances.iter() {
                js_balances.push(VerifiedIdentityBalanceNAPI {
                    id: id.clone().into(),
                    balance: BigIntString::from_u64(balance.clone()),
                });
            }

            Ok(Either20::H(js_balances))
        }
        StateTransitionProofResult::VerifiedPartialIdentity(partial_identity) => {
            Ok(Either20::I(partial_identity.clone().into()))
        }
        StateTransitionProofResult::VerifiedBalanceTransfer(sender, recipient) => {
            Ok(Either20::J(VerifiedBalanceTransferNAPI {
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

            Ok(Either20::K(js_documents))
        }
        StateTransitionProofResult::VerifiedTokenActionWithDocument(document) => {
            Ok(Either20::L(document.clone().into()))
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithDocument(group_power, document) => {
            Ok(Either20::M(VerifiedTokenGroupActionWithDocumentNAPI {
                group_sum_power: group_power.clone(),
                document: document.clone().map(DocumentNAPI::from).into(),
            }))
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenBalance(
            group_power,
            group_action_status,
            amount,
        ) => Ok(Either20::N(VerifiedTokenGroupActionWithTokenBalanceNAPI {
            group_sum_power: group_power.clone(),
            group_action_status: GroupActionStatusNAPI::from(group_action_status.clone()).into(),
            amount: amount.clone().map(BigIntString::from_u64),
        })),
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenIdentityInfo(
            group_power,
            group_action_status,
            identity_token_info,
        ) => Ok(Either20::O(
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
        ) => Ok(Either20::P(
            VerifiedTokenGroupActionWithTokenPricingScheduleNAPI {
                group_sum_power: group_power.clone(),
                group_action_status: GroupActionStatusNAPI::from(group_action_status.clone())
                    .into(),
                pricing_schedule: pricing_schedule.clone().map(Into::into),
            },
        )),
        StateTransitionProofResult::VerifiedMasternodeVote(mn_vote) => {
            Ok(Either20::Q(mn_vote.clone().into()))
        }
        StateTransitionProofResult::VerifiedNextDistribution(vote) => {
            Ok(Either20::Q(vote.clone().into()))
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

            Ok(Either20::R(infos_arr))
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

            Ok(Either20::S(VerifiedIdentityFullWithAddressInfosNAPI {
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

            Ok(Either20::T(VerifiedIdentityWithAddressInfosNAPI {
                identity: identity.clone().into(),
                infos: infos_arr,
            }))
        }
    }
}
