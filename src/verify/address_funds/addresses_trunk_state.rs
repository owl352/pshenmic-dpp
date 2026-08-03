use drive::{drive::Drive, grovedb::GroveTrunkQueryResult, verify::RootHash};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    verify::address_funds::entities::{
        GroveAncestorNAPI, GroveElementEntryNAPI, GroveElementNAPI, GroveLeafInfoNAPI,
    },
};

/// The verified trunk of the address funds tree.
///
/// A trunk proof covers the top of the tree only; subtrees below it are
/// truncated and listed in `leafKeys`. Use `traceKeyToLeaf` to find which
/// truncated subtree holds a given address, then fetch that subtree with a
/// branch query.
#[napi(js_name = "VerifiedAddressesTrunkStateNAPI")]
pub struct VerifiedAddressesTrunkStateNAPI {
    pub root_hash: Uint8Array,
    pub(crate) result: GroveTrunkQueryResult,
}

#[napi]
impl VerifiedAddressesTrunkStateNAPI {
    /// The elements proven by the trunk, keyed by their tree key.
    #[napi(getter, js_name = "elements")]
    pub fn elements(&self) -> Vec<GroveElementEntryNAPI> {
        self.result
            .elements
            .iter()
            .map(|(key, element)| GroveElementEntryNAPI {
                key: key.clone(),
                element: GroveElementNAPI::from(element),
            })
            .collect()
    }

    /// The subtrees the trunk stops at. Empty when the whole tree fit in the
    /// trunk.
    #[napi(getter, js_name = "leafKeys")]
    pub fn leaf_keys(&self) -> Vec<GroveLeafInfoNAPI> {
        self.result
            .leaf_keys
            .iter()
            .map(|(key, info)| GroveLeafInfoNAPI::from_leaf(key, info))
            .collect()
    }

    /// Depths to split subsequent branch queries into, e.g. `[7, 7, 6]` for a
    /// tree of depth 20.
    #[napi(getter, js_name = "chunkDepths")]
    pub fn chunk_depths(&self) -> Vec<u8> {
        self.result.chunk_depths.clone()
    }

    /// The tree's total depth, derived from its element count.
    #[napi(getter, js_name = "maxTreeDepth")]
    pub fn max_tree_depth(&self) -> u8 {
        self.result.max_tree_depth
    }

    /// Which truncated subtree would contain `key`.
    ///
    /// Returns `undefined` when the key is already among `elements`, or when no
    /// subtree could hold it.
    #[napi(js_name = "traceKeyToLeaf")]
    pub fn trace_key_to_leaf(&self, key: Uint8Array) -> Option<GroveLeafInfoNAPI> {
        self.result
            .trace_key_to_leaf(key.as_ref())
            .map(|(leaf_key, info)| GroveLeafInfoNAPI::from_leaf(&leaf_key, &info))
    }

    /// Walks up from `leafKey` to the nearest ancestor holding at least
    /// `minPrivacyTreeCount` elements, so a branch query can request a subtree
    /// large enough not to reveal which leaf was wanted.
    ///
    /// Never returns the root, and returns `undefined` when the leaf has no
    /// ancestor above it.
    #[napi(js_name = "getAncestor")]
    pub fn get_ancestor(
        &self,
        leaf_key: Uint8Array,
        min_privacy_tree_count: BigIntString,
    ) -> Result<Option<GroveAncestorNAPI>, napi::Error> {
        let min_privacy_tree_count = min_privacy_tree_count.try_to_u64()?;

        Ok(self
            .result
            .get_ancestor(leaf_key.as_ref(), min_privacy_tree_count)
            .map(|(levels_up, count, key, hash)| GroveAncestorNAPI {
                levels_up,
                count: count.to_string(),
                key,
                hash: hash.to_vec(),
            }))
    }
}

#[napi(js_name = "verifyAddressesTrunkState")]
pub fn verify_addresses_trunk_state(
    proof: Uint8Array,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedAddressesTrunkStateNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;

    let (root_hash, result): (RootHash, GroveTrunkQueryResult) =
        Drive::verify_address_funds_trunk_query(
            proof.to_vec().as_slice(),
            &platform_version.into(),
        )
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedAddressesTrunkStateNAPI {
        root_hash: root_hash.into(),
        result,
    })
}
