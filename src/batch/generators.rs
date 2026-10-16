use dpp::fee::Credits;
use dpp::prelude::{Identifier, IdentityNonce};
use dpp::state_transition::batch_transition::batched_transition::document_index_only_delete_transition::v0::DocumentIndexOnlyDeleteTransitionV0;
use dpp::state_transition::batch_transition::batched_transition::document_purchase_transition::DocumentPurchaseTransitionV0;
use dpp::state_transition::batch_transition::batched_transition::document_transfer_transition::DocumentTransferTransitionV0;
use dpp::state_transition::batch_transition::batched_transition::document_update_price_transition::DocumentUpdatePriceTransitionV0;
use dpp::state_transition::batch_transition::batched_transition::{
    DocumentIndexOnlyDeleteTransition, DocumentPurchaseTransition, DocumentTransferTransition,
    DocumentUpdatePriceTransition,
};
use dpp::state_transition::batch_transition::document_base_transition::DocumentBaseTransition;
use dpp::state_transition::batch_transition::document_base_transition::v1::DocumentBaseTransitionV1;
use dpp::state_transition::batch_transition::document_base_transition::v2::DocumentBaseTransitionV2;
use dpp::state_transition::batch_transition::document_create_transition::DocumentCreateTransitionV0;
use dpp::state_transition::batch_transition::document_delete_transition::DocumentDeleteTransitionV0;
use dpp::state_transition::batch_transition::document_replace_transition::DocumentReplaceTransitionV0;
use dpp::state_transition::batch_transition::{
    DocumentCreateTransition, DocumentDeleteTransition, DocumentReplaceTransition,
};

use crate::batch::action_fee_agreement::DocumentActionFeeAgreementNAPI;
use crate::batch::prefunded_voting_balance::PrefundedVotingBalanceNAPI;
use crate::batch::token_payment_info::TokenPaymentInfoNAPI;
use crate::document::DocumentNAPI;

/// V2 carries the action fee agreement (protocol version 14). Without one the base stays V1,
/// which every protocol version accepts.
pub fn generate_base_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentBaseTransition {
    let id = document.rs_get_id();
    let data_contract_id = document.rs_get_data_contract_id();
    let token_payment_info = token_payment_info.map(|info| info.clone().into());

    match action_fee_agreement {
        Some(agreement) => DocumentBaseTransition::V2(DocumentBaseTransitionV2 {
            id,
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
            token_payment_info,
            action_fee_agreement: Some((*agreement).into()),
        }),
        None => DocumentBaseTransition::V1(DocumentBaseTransitionV1 {
            id,
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
            token_payment_info,
        }),
    }
}

pub fn generate_create_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    prefunded_voting_balance: Option<&PrefundedVotingBalanceNAPI>,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentCreateTransition {
    DocumentCreateTransition::V0(DocumentCreateTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        entropy: document.rs_get_entropy().unwrap_or([0; 32]),
        data: document.rs_get_properties(),
        prefunded_voting_balance: prefunded_voting_balance.map(|pb| pb.clone().into()),
    })
}

pub fn generate_delete_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentDeleteTransition {
    DocumentDeleteTransition::V0(DocumentDeleteTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
    })
}

pub fn generate_index_only_delete_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentIndexOnlyDeleteTransition {
    DocumentIndexOnlyDeleteTransition::V0(DocumentIndexOnlyDeleteTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        data: document.rs_get_properties(),
    })
}

pub fn generate_purchase_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    price: Credits,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentPurchaseTransition {
    DocumentPurchaseTransition::V0(DocumentPurchaseTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        revision: document.rs_get_revision().unwrap_or(1) + 1,
        price,
    })
}

pub fn generate_replace_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentReplaceTransition {
    DocumentReplaceTransition::V0(DocumentReplaceTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        revision: document.rs_get_revision().unwrap_or(1) + 1,
        data: document.rs_get_properties(),
    })
}

pub fn generate_transfer_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    recipient_owner_id: Identifier,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentTransferTransition {
    DocumentTransferTransition::V0(DocumentTransferTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        revision: document.rs_get_revision().unwrap_or(1) + 1,
        recipient_owner_id,
    })
}

pub fn generate_update_price_transition(
    document: &DocumentNAPI,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    price: Credits,
    token_payment_info: Option<&TokenPaymentInfoNAPI>,
    action_fee_agreement: Option<&DocumentActionFeeAgreementNAPI>,
) -> DocumentUpdatePriceTransition {
    DocumentUpdatePriceTransition::V0(DocumentUpdatePriceTransitionV0 {
        base: generate_base_transition(
            document,
            identity_contract_nonce,
            document_type_name,
            token_payment_info,
            action_fee_agreement,
        ),
        revision: document.rs_get_revision().unwrap_or(1) + 1,
        price,
    })
}
