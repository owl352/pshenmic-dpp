use dpp::balances::credits::BlockAwareCreditOperation;
use drive::{drive::Drive, verify::RootHash};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    platform_address::PlatformAddressNAPI,
};

/// One add-to-credits operation, kept tagged with the block it happened in so a
/// partially-synced client can tell which additions it has already applied.
#[derive(Clone)]
#[napi(js_name = "BlockHeightCreditNAPI")]
pub struct BlockHeightCreditNAPI {
    pub(crate) block_height: BigIntString,
    pub(crate) credits: BigIntString,
}

#[napi]
impl BlockHeightCreditNAPI {
    #[napi(getter, js_name = "blockHeight")]
    pub fn block_height(&self) -> BigIntString {
        self.block_height.clone()
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> BigIntString {
        self.credits.clone()
    }
}

/// How one address's balance changed across a compacted range of blocks.
#[derive(Clone)]
#[napi(js_name = "CompactedAddressBalanceChangeNAPI")]
pub struct CompactedAddressBalanceChangeNAPI {
    pub(crate) address: PlatformAddressNAPI,
    pub(crate) operation: String,
    pub(crate) set_credits: Option<BigIntString>,
    pub(crate) add_to_credits_operations: Vec<BlockHeightCreditNAPI>,
}

#[napi]
impl CompactedAddressBalanceChangeNAPI {
    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> PlatformAddressNAPI {
        self.address.clone()
    }

    /// Either "setCredits" or "addToCreditsOperations", naming which of the two
    /// fields below is populated.
    #[napi(getter, js_name = "operation")]
    pub fn operation(&self) -> String {
        self.operation.clone()
    }

    /// The final balance, when a set overwrote everything before it in the
    /// range.
    #[napi(getter, js_name = "setCredits")]
    pub fn set_credits(&self) -> Option<BigIntString> {
        self.set_credits.clone()
    }

    /// The individual additions, kept per block rather than summed so a client
    /// can apply only the ones past its sync height.
    #[napi(getter, js_name = "addToCreditsOperations")]
    pub fn add_to_credits_operations(&self) -> Vec<BlockHeightCreditNAPI> {
        self.add_to_credits_operations.clone()
    }
}

/// The compacted changes covering blocks `startBlockHeight` through
/// `endBlockHeight` inclusive.
#[derive(Clone)]
#[napi(js_name = "CompactedBlockAddressBalanceChangesNAPI")]
pub struct CompactedBlockAddressBalanceChangesNAPI {
    pub(crate) start_block_height: BigIntString,
    pub(crate) end_block_height: BigIntString,
    pub(crate) changes: Vec<CompactedAddressBalanceChangeNAPI>,
}

#[napi]
impl CompactedBlockAddressBalanceChangesNAPI {
    #[napi(getter, js_name = "startBlockHeight")]
    pub fn start_block_height(&self) -> BigIntString {
        self.start_block_height.clone()
    }

    #[napi(getter, js_name = "endBlockHeight")]
    pub fn end_block_height(&self) -> BigIntString {
        self.end_block_height.clone()
    }

    #[napi(getter, js_name = "changes")]
    pub fn changes(&self) -> Vec<CompactedAddressBalanceChangeNAPI> {
        self.changes.clone()
    }
}

#[napi(js_name = "VerifiedRecentCompactedAddressBalanceChangesNAPI")]
pub struct VerifiedRecentCompactedAddressBalanceChangesNAPI {
    pub root_hash: Uint8Array,
    pub(crate) ranges: Vec<CompactedBlockAddressBalanceChangesNAPI>,
}

#[napi]
impl VerifiedRecentCompactedAddressBalanceChangesNAPI {
    /// The proven compacted ranges, in ascending block-height order.
    #[napi(getter, js_name = "ranges")]
    pub fn ranges(&self) -> Vec<CompactedBlockAddressBalanceChangesNAPI> {
        self.ranges.clone()
    }
}

/// Verifies a proof of the compacted address balance changes from a block
/// height onwards.
///
/// Unlike the uncompacted query there is no subset flag: the proof is a
/// self-contained envelope whose predecessor half authenticates which range
/// covers the requested height, so the forward half has nothing to be a subset
/// of.
#[napi(js_name = "verifyRecentCompactedAddressBalanceChanges")]
pub fn verify_recent_compacted_address_balance_changes(
    proof: Uint8Array,
    start_block_height: BigIntString,
    limit: Option<u16>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedRecentCompactedAddressBalanceChangesNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;
    let start_block_height = start_block_height.try_to_u64()?;

    let (root_hash, ranges): (RootHash, _) = Drive::verify_compacted_address_balance_changes(
        proof.to_vec().as_slice(),
        start_block_height,
        limit,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedRecentCompactedAddressBalanceChangesNAPI {
        root_hash: root_hash.into(),
        ranges: ranges
            .into_iter()
            .map(|(start_block_height, end_block_height, changes)| {
                CompactedBlockAddressBalanceChangesNAPI {
                    start_block_height: start_block_height.to_string(),
                    end_block_height: end_block_height.to_string(),
                    changes: changes
                        .into_iter()
                        .map(|(address, operation)| {
                            let (operation, set_credits, add_to_credits_operations) =
                                match operation {
                                    BlockAwareCreditOperation::SetCredits(credits) => {
                                        ("setCredits", Some(credits.to_string()), Vec::new())
                                    }
                                    BlockAwareCreditOperation::AddToCreditsOperations(
                                        operations,
                                    ) => (
                                        "addToCreditsOperations",
                                        None,
                                        operations
                                            .into_iter()
                                            .map(|(block_height, credits)| BlockHeightCreditNAPI {
                                                block_height: block_height.to_string(),
                                                credits: credits.to_string(),
                                            })
                                            .collect(),
                                    ),
                                };

                            CompactedAddressBalanceChangeNAPI {
                                address: address.into(),
                                operation: operation.to_string(),
                                set_credits,
                                add_to_credits_operations,
                            }
                        })
                        .collect(),
                }
            })
            .collect(),
    })
}
