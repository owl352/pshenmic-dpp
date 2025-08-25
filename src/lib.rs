#![no_std]
#![no_main]

extern crate wee_alloc;

// allows to save 7 kb
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub use pshenmic_dpp_batch;
pub use pshenmic_dpp_consensus_error;
pub use pshenmic_dpp_data_contract;
pub use pshenmic_dpp_data_contract_transitions;
pub use pshenmic_dpp_document_search;
pub use pshenmic_dpp_enums;
pub use pshenmic_dpp_identifier;
pub use pshenmic_dpp_identity;
pub use pshenmic_dpp_identity_transitions;
pub use pshenmic_dpp_masternode_vote;
pub use pshenmic_dpp_state_transition;
