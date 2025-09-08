#![no_std]
#![no_main]

#[global_allocator]
static ALLOCATOR: talc::Talck<talc::locking::AssumeUnlockable, talc::ClaimOnOom> = unsafe {
    use core::{mem::MaybeUninit, ptr::addr_of_mut};

    const MEMORY_SIZE: usize = 128 * 1024 * 1024;
    static mut MEMORY: [MaybeUninit<u8>; MEMORY_SIZE] = [MaybeUninit::uninit(); MEMORY_SIZE];
    let span = talc::Span::from_array(addr_of_mut!(MEMORY));
    let oom_handler = { talc::ClaimOnOom::new(span) };
    talc::Talc::new(oom_handler).lock()
};

pub use pshenmic_dpp_batch;
pub use pshenmic_dpp_consensus_error;
pub use pshenmic_dpp_data_contract;
pub use pshenmic_dpp_data_contract_transitions;
pub use pshenmic_dpp_enums;
pub use pshenmic_dpp_identifier;
pub use pshenmic_dpp_identity;
pub use pshenmic_dpp_identity_transitions;
pub use pshenmic_dpp_masternode_vote;
pub use pshenmic_dpp_partial_identity;
pub use pshenmic_dpp_state_transition;
pub use pshenmic_dpp_verify;
