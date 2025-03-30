use dpp::prelude::{Identifier, IdentityNonce};
use dpp::state_transition::documents_batch_transition::document_base_transition::DocumentBaseTransition;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::DocumentBaseTransitionV0;
use dpp::state_transition::documents_batch_transition::document_create_transition::DocumentCreateTransitionV0;
use dpp::state_transition::documents_batch_transition::document_delete_transition::DocumentDeleteTransitionV0;
use dpp::state_transition::documents_batch_transition::document_replace_transition::DocumentReplaceTransitionV0;
use dpp::state_transition::documents_batch_transition::{
    DocumentCreateTransition, DocumentDeleteTransition, DocumentReplaceTransition,
};
use pshenmic_dpp_document::DocumentWASM;

pub fn generate_create_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    data_contract_id: Identifier,
) -> DocumentCreateTransition {
    DocumentCreateTransition::V0(DocumentCreateTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.rs_get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
        }),
        entropy: document.rs_get_entropy().unwrap(),
        data: document.rs_get_properties(),
        prefunded_voting_balance: None,
    })
}

pub fn generate_delete_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    data_contract_id: Identifier,
) -> DocumentDeleteTransition {
    DocumentDeleteTransition::V0(DocumentDeleteTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.rs_get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
        }),
    })
}

pub fn generate_replace_transition(
    document: DocumentWASM,
    identity_contract_nonce: IdentityNonce,
    document_type_name: String,
    data_contract_id: Identifier,
) -> DocumentReplaceTransition {
    DocumentReplaceTransition::V0(DocumentReplaceTransitionV0 {
        base: DocumentBaseTransition::V0(DocumentBaseTransitionV0 {
            id: document.rs_get_id(),
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
        }),
        revision: document.get_revision().unwrap(),
        data: document.rs_get_properties(),
    })
}
