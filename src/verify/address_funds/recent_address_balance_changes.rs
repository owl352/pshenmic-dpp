use dpp::balances::credits::CreditOperation;
use drive::{drive::Drive, verify::RootHash};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    platform_address::PlatformAddressNAPI,
};

/// How one address's balance changed in a block.
#[derive(Clone)]
#[napi(js_name = "AddressBalanceChangeNAPI")]
pub struct AddressBalanceChangeNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) operation: String,
    pub(crate) credits: BigIntString,
}

#[napi]
impl AddressBalanceChangeNAPI {
    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    /// Either "setCredits", where `credits` is the new balance, or
    /// "addToCredits", where `credits` is the amount added to it.
    #[napi(getter, js_name = "operation")]
    pub fn operation(&self) -> String {
        self.operation.clone()
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> BigIntString {
        self.credits.clone()
    }
}

/// The address balance changes that happened in a single block.
#[derive(Clone)]
#[napi(js_name = "BlockAddressBalanceChangesNAPI")]
pub struct BlockAddressBalanceChangesNAPI {
    pub(crate) block_height: BigIntString,
    pub(crate) changes: Vec<AddressBalanceChangeNAPI>,
}

#[napi]
impl BlockAddressBalanceChangesNAPI {
    #[napi(getter, js_name = "blockHeight")]
    pub fn block_height(&self) -> BigIntString {
        self.block_height.clone()
    }

    #[napi(getter, js_name = "changes")]
    pub fn changes(&self) -> Vec<AddressBalanceChangeNAPI> {
        self.changes.clone()
    }
}

#[napi(js_name = "VerifiedRecentAddressBalanceChangesNAPI")]
pub struct VerifiedRecentAddressBalanceChangesNAPI {
    pub root_hash: Uint8Array,
    pub(crate) blocks: Vec<BlockAddressBalanceChangesNAPI>,
}

#[napi]
impl VerifiedRecentAddressBalanceChangesNAPI {
    /// The proven blocks, in ascending block-height order.
    #[napi(getter, js_name = "blocks")]
    pub fn blocks(&self) -> Vec<BlockAddressBalanceChangesNAPI> {
        self.blocks.clone()
    }
}

/// Verifies a proof of the address balance changes from a block height onwards.
///
/// `startHeightExclusive` mirrors the request flag of the same name: when
/// false the proof is a `RangeFrom` starting at `startBlockHeight`, when true a
/// `RangeAfter` starting just past it. It must match what was asked for, since
/// the two produce different queries and so different proofs.
#[napi(js_name = "verifyRecentAddressBalanceChanges")]
pub fn verify_recent_address_balance_changes(
    proof: Uint8Array,
    start_block_height: BigIntString,
    start_height_exclusive: bool,
    limit: Option<u16>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedRecentAddressBalanceChangesNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;
    let start_block_height = start_block_height.try_to_u64()?;

    let verify = if start_height_exclusive {
        Drive::verify_recent_address_balance_changes_after
    } else {
        Drive::verify_recent_address_balance_changes
    };

    let (root_hash, blocks): (RootHash, _) = verify(
        proof.to_vec().as_slice(),
        start_block_height,
        limit,
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedRecentAddressBalanceChangesNAPI {
        root_hash: root_hash.into(),
        blocks: blocks
            .into_iter()
            .map(|(block_height, changes)| BlockAddressBalanceChangesNAPI {
                block_height: block_height.to_string(),
                changes: changes
                    .into_iter()
                    .map(|(address, operation)| {
                        let (operation, credits) = match operation {
                            CreditOperation::SetCredits(credits) => ("setCredits", credits),
                            CreditOperation::AddToCredits(credits) => ("addToCredits", credits),
                        };

                        AddressBalanceChangeNAPI {
                            address: address.into(),
                            operation: operation.to_string(),
                            credits: credits.to_string(),
                        }
                    })
                    .collect(),
            })
            .collect(),
    })
}
