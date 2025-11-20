use crate::verify_state_transition::verify_wait_state_transition_result::{
    IdentityTokenInfoWASM, TokenStatusWASM,
};
use dpp::state_transition::proof_result::StateTransitionProofResult;
use js_sys::{Array, Object, Reflect};
use pshenmic_dpp_batch::token_pricing_schedule::TokenPricingScheduleWASM;
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_enums::group::group_action_status::GroupActionStatusWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_identity::IdentityWASM;
use pshenmic_dpp_masternode_vote::vote::VoteWASM;
use pshenmic_dpp_partial_identity::PartialIdentityWASM;
use wasm_bindgen::JsValue;

pub fn state_transition_proof_result_to_js(
    proof_result: &StateTransitionProofResult,
) -> Result<JsValue, JsValue> {
    match proof_result {
        StateTransitionProofResult::VerifiedDataContract(data_contract) => {
            Ok(DataContractWASM::from(data_contract.clone()).into())
        }
        StateTransitionProofResult::VerifiedIdentity(identity) => {
            Ok(IdentityWASM::from(identity.clone()).into())
        }
        StateTransitionProofResult::VerifiedTokenBalanceAbsence(id) => {
            Ok(IdentifierWASM::from(id.clone()).into())
        }
        StateTransitionProofResult::VerifiedTokenBalance(id, balance) => {
            let out = Object::new();

            Reflect::set(&out, &"id".into(), &IdentifierWASM::from(id.clone()).into())?;

            Reflect::set(&out, &"balance".into(), &balance.clone().into())?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenIdentityInfo(id, info) => {
            let out = Object::new();

            Reflect::set(&out, &"id".into(), &IdentifierWASM::from(id.clone()).into())?;

            Reflect::set(
                &out,
                &"identityTokenInfo".into(),
                &IdentityTokenInfoWASM::from(info.clone()).into(),
            )?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenPricingSchedule(id, schedule) => {
            let js_schedule = match schedule {
                None => None,
                Some(schedule) => Some(TokenPricingScheduleWASM::from(schedule.clone())),
            };

            let out = Object::new();

            Reflect::set(&out, &"id".into(), &IdentifierWASM::from(id.clone()).into())?;

            Reflect::set(&out, &"pricingSchedule".into(), &js_schedule.into())?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenStatus(token_status) => {
            Ok(TokenStatusWASM::from(token_status.clone()).into())
        }
        StateTransitionProofResult::VerifiedTokenIdentitiesBalances(balances) => {
            let js_balances = Array::new();
            for (id, balance) in balances.iter() {
                let js_balance = Object::new();

                Reflect::set(
                    &js_balance,
                    &"identityId".into(),
                    &IdentifierWASM::from(id.clone()).into(),
                )?;
                Reflect::set(&js_balance, &"balance".into(), &balance.clone().into())?;

                js_balances.push(&js_balance);
            }

            Ok(js_balances.into())
        }
        StateTransitionProofResult::VerifiedPartialIdentity(partial_identity) => {
            Ok(PartialIdentityWASM::from(partial_identity.clone()).into())
        }
        StateTransitionProofResult::VerifiedBalanceTransfer(sender, recipient) => {
            let out = Object::new();

            Reflect::set(
                &out,
                &"sender".into(),
                &PartialIdentityWASM::from(sender.clone()).into(),
            )?;

            Reflect::set(
                &out,
                &"recipient".into(),
                &PartialIdentityWASM::from(recipient.clone()).into(),
            )?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedDocuments(documents) => {
            let js_documents = Array::new();
            for (id, document) in documents.iter() {
                let js_document = Object::new();

                Reflect::set(
                    &js_document,
                    &"id".into(),
                    &IdentifierWASM::from(id.clone()).into(),
                )?;
                Reflect::set(
                    &js_document,
                    &"balance".into(),
                    &document.clone().map(DocumentWASM::from).into(),
                )?;

                js_documents.push(&js_document);
            }

            Ok(js_documents.into())
        }
        StateTransitionProofResult::VerifiedTokenActionWithDocument(document) => {
            Ok(DocumentWASM::from(document.clone()).into())
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithDocument(group_power, document) => {
            let out = Object::new();

            Reflect::set(&out, &"groupSumPower".into(), &group_power.clone().into())?;

            Reflect::set(
                &out,
                &"document".into(),
                &document.clone().map(DocumentWASM::from).into(),
            )?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenBalance(
            group_power,
            group_action_status,
            amount,
        ) => {
            let out = Object::new();

            Reflect::set(&out, &"groupSumPower".into(), &group_power.clone().into())?;

            Reflect::set(
                &out,
                &"groupActionStatus".into(),
                &String::from(GroupActionStatusWASM::from(group_action_status.clone())).into(),
            )?;

            Reflect::set(&out, &"amount".into(), &amount.clone().into())?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenIdentityInfo(
            group_power,
            group_action_status,
            identity_token_info,
        ) => {
            let out = Object::new();

            Reflect::set(&out, &"groupSumPower".into(), &group_power.clone().into())?;

            Reflect::set(
                &out,
                &"groupActionStatus".into(),
                &String::from(GroupActionStatusWASM::from(group_action_status.clone())).into(),
            )?;

            Reflect::set(
                &out,
                &"identityTokenInfo".into(),
                &identity_token_info
                    .clone()
                    .map(IdentityTokenInfoWASM::from)
                    .into(),
            )?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedTokenGroupActionWithTokenPricingSchedule(
            group_power,
            group_action_status,
            pricing_schedule,
        ) => {
            let out = Object::new();

            Reflect::set(&out, &"groupSumPower".into(), &group_power.clone().into())?;

            Reflect::set(
                &out,
                &"groupActionStatus".into(),
                &String::from(GroupActionStatusWASM::from(group_action_status.clone())).into(),
            )?;

            Reflect::set(
                &out,
                &"pricingSchedule".into(),
                &pricing_schedule
                    .clone()
                    .map(TokenPricingScheduleWASM::from)
                    .into(),
            )?;

            Ok(out.into())
        }
        StateTransitionProofResult::VerifiedMasternodeVote(mn_vote) => {
            Ok(VoteWASM::from(mn_vote.clone()).into())
        }
        StateTransitionProofResult::VerifiedNextDistribution(vote) => {
            Ok(VoteWASM::from(vote.clone()).into())
        }
    }
}
