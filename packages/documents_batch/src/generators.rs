use dpp::fee::Credits;
use dpp::prelude::{Identifier, IdentityNonce};
use dpp::state_transition::documents_batch_transition::document_base_transition::DocumentBaseTransition;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::DocumentBaseTransitionV0;
use dpp::state_transition::documents_batch_transition::document_create_transition::DocumentCreateTransitionV0;
use dpp::state_transition::documents_batch_transition::document_delete_transition::DocumentDeleteTransitionV0;
use dpp::state_transition::documents_batch_transition::document_replace_transition::DocumentReplaceTransitionV0;
use dpp::state_transition::documents_batch_transition::{
    DocumentCreateTransition, DocumentDeleteTransition, DocumentReplaceTransition,
};
use dpp::state_transition::documents_batch_transition::document_transition::document_transfer_transition::DocumentTransferTransitionV0;
use dpp::state_transition::documents_batch_transition::document_transition::{DocumentPurchaseTransition, DocumentTransferTransition, DocumentUpdatePriceTransition};
use dpp::state_transition::documents_batch_transition::document_transition::document_purchase_transition::DocumentPurchaseTransitionV0;
use dpp::state_transition::documents_batch_transition::document_transition::document_update_price_transition::DocumentUpdatePriceTransitionV0;
use pshenmic_dpp_document::DocumentWASM;

pub fn generate_create_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
) -> DocumentCreateTransition {
    DocumentCreateTransition::V0(DocumentCreateTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
        entropy: document.get_entropy().unwrap(),
        data: document.get_properties(),
        prefunded_voting_balance: None,
    })
}

pub fn generate_delete_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
) -> DocumentDeleteTransition {
    DocumentDeleteTransition::V0(DocumentDeleteTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
    })
}

pub fn generate_replace_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
) -> DocumentReplaceTransition {
    DocumentReplaceTransition::V0(DocumentReplaceTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
        revision: document.get_revision().unwrap(),
        data: document.get_properties(),
    })
}

pub fn generate_transfer_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,

    recipient_owner_id: Identifier,
) -> DocumentTransferTransition {
    DocumentTransferTransition::V0(DocumentTransferTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
        revision: document.get_revision().unwrap(),
        recipient_owner_id,
    })
}

pub fn generate_update_price_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,

    price: Credits,
) -> DocumentUpdatePriceTransition {
    DocumentUpdatePriceTransition::V0(DocumentUpdatePriceTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
        revision: document.get_revision().unwrap(),
        price,
    })
}

pub fn generate_purchase_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,

    price: Credits,
) -> DocumentPurchaseTransition {
    DocumentPurchaseTransition::V0(DocumentPurchaseTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id: document.get_data_contract_id(),
        }),
        revision: document.get_revision().unwrap(),
        price: price,
    })
}
