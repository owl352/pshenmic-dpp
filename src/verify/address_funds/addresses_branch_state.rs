use drive::{drive::Drive, grovedb::GroveBranchQueryResult};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
    verify::address_funds::entities::{
        GroveAncestorNAPI, GroveElementEntryNAPI, GroveElementNAPI, GroveLeafInfoNAPI,
    },
};

/// The verified subtree returned by a branch chunk proof.
///
/// A branch proof is checked against the hash its parent trunk (or branch)
/// proof published for this key, so it carries no root hash of its own: the
/// chain back to the platform root is what the parent already established.
#[napi(js_name = "VerifiedAddressesBranchStateNAPI")]
pub struct VerifiedAddressesBranchStateNAPI {
    pub(crate) result: GroveBranchQueryResult,
}

#[napi]
impl VerifiedAddressesBranchStateNAPI {
    /// The elements proven by this branch, keyed by their tree key.
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

    /// Subtrees this branch in turn stops at, for going a level deeper. Empty
    /// when the branch returned its whole subtree.
    #[napi(getter, js_name = "leafKeys")]
    pub fn leaf_keys(&self) -> Vec<GroveLeafInfoNAPI> {
        self.result
            .leaf_keys
            .iter()
            .map(|(key, info)| GroveLeafInfoNAPI::from_leaf(key, info))
            .collect()
    }

    /// This subtree's root hash, matching the `expectedRootHash` it was
    /// verified against.
    #[napi(getter, js_name = "branchRootHash")]
    pub fn branch_root_hash(&self) -> Uint8Array {
        self.result.branch_root_hash.to_vec().into()
    }

    /// Which truncated subtree below this branch would contain `key`.
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
    /// `minPrivacyTreeCount` elements. See the trunk equivalent for details.
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

/// Verifies a branch chunk proof for the address funds tree.
///
/// `expectedRootHash` must be the `hash` the parent trunk/branch proof reported
/// for `key`; without it the branch is unanchored and proves nothing.
///
/// `depth` is validated upstream against an allowed range, so take it from the
/// parent trunk's `chunkDepths` rather than picking a value.
#[napi(js_name = "verifyAddressesBranchState")]
pub fn verify_addresses_branch_state(
    proof: Uint8Array,
    key: Uint8Array,
    depth: u8,
    expected_root_hash: Uint8Array,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedAddressesBranchStateNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;
    let expected_root_hash: [u8; 32] = expected_root_hash.to_vec().try_into().map_err(|_| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "expectedRootHash must be 32 bytes long",
        )
    })?;

    let result = Drive::verify_address_funds_branch_query(
        proof.to_vec().as_slice(),
        key.to_vec(),
        depth,
        expected_root_hash,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedAddressesBranchStateNAPI { result })
}
