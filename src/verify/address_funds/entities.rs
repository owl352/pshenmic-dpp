//! Shared JS projections of the GroveDB types returned by the address funds
//! trunk/branch chunk proofs.

use drive::grovedb::{Element, LeafInfo};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::BigIntString;

/// A GroveDB element flattened into a JS-friendly shape.
///
/// `Element` is a wide enum whose variants carry different combinations of a
/// value, a sum and a count. Rather than model that union in JS, every variant
/// is projected onto the fields it actually populates and identified by `type`,
/// so callers switch on `type` and read the fields it implies.
///
/// The projection is deliberately lossy: element flags, reference paths, and
/// the structural parameters of the append-only tree variants (chunk power,
/// height) are dropped. The address funds tree stores none of those, so what
/// survives is everything that tree can actually hold.
#[derive(Clone)]
#[napi(js_name = "GroveElementNAPI")]
pub struct GroveElementNAPI {
    pub(crate) element_type: String,
    pub(crate) wrapper: Option<String>,
    pub(crate) value: Option<Vec<u8>>,
    pub(crate) sum: Option<BigIntString>,
    pub(crate) count: Option<BigIntString>,
}

#[napi]
impl GroveElementNAPI {
    /// The `Element` variant, e.g. "Item", "SumTree" or "ProvableCountSumTree".
    #[napi(getter, js_name = "type")]
    pub fn element_type(&self) -> String {
        self.element_type.clone()
    }

    /// Set when the element was wrapped to opt out of contributing to its
    /// parent's aggregates: "NonCounted", "NotSummed" or "NotCountedOrSummed".
    /// `type` then describes the wrapped element itself.
    #[napi(getter, js_name = "wrapper")]
    pub fn wrapper(&self) -> Option<String> {
        self.wrapper.clone()
    }

    /// An item's payload, or a subtree's root key. Absent for an empty subtree,
    /// and for variants that carry neither (`Reference`, `SumItem`).
    #[napi(getter, js_name = "value")]
    pub fn value(&self) -> Option<Uint8Array> {
        self.value.clone().map(Uint8Array::from)
    }

    /// The sum, for the sum-bearing variants only.
    #[napi(getter, js_name = "sum")]
    pub fn sum(&self) -> Option<BigIntString> {
        self.sum.clone()
    }

    /// The element count, for the count-bearing variants only.
    #[napi(getter, js_name = "count")]
    pub fn count(&self) -> Option<BigIntString> {
        self.count.clone()
    }
}

impl From<&Element> for GroveElementNAPI {
    fn from(element: &Element) -> Self {
        GroveElementNAPI::project(element, None)
    }
}

impl GroveElementNAPI {
    fn project(element: &Element, wrapper: Option<&str>) -> Self {
        let (element_type, value, sum, count) = match element {
            // The three wrappers delegate to the element they wrap, recording
            // which one was seen. A wrapper may not wrap another wrapper, so
            // this recurses at most one level.
            Element::NonCounted(inner) => return Self::project(inner, Some("NonCounted")),
            Element::NotSummed(inner) => return Self::project(inner, Some("NotSummed")),
            Element::NotCountedOrSummed(inner) => {
                return Self::project(inner, Some("NotCountedOrSummed"));
            }

            Element::Item(value, _) => ("Item", Some(value.clone()), None, None),
            Element::ItemWithSumItem(value, sum, _) => (
                "ItemWithSumItem",
                Some(value.clone()),
                Some(sum.to_string()),
                None,
            ),
            Element::SumItem(sum, _) => ("SumItem", None, Some(sum.to_string()), None),

            // References carry a path type rather than a value, so only the
            // tag and any attached sum survive the projection.
            Element::Reference(..) => ("Reference", None, None, None),
            Element::ReferenceWithSumItem(_, _, sum, _) => {
                ("ReferenceWithSumItem", None, Some(sum.to_string()), None)
            }

            // Subtrees: `value` is the root key, absent when the subtree is
            // empty.
            Element::Tree(root_key, _) => ("Tree", root_key.clone(), None, None),
            Element::SumTree(root_key, sum, _) => {
                ("SumTree", root_key.clone(), Some(sum.to_string()), None)
            }
            Element::BigSumTree(root_key, sum, _) => {
                ("BigSumTree", root_key.clone(), Some(sum.to_string()), None)
            }
            Element::ProvableSumTree(root_key, sum, _) => (
                "ProvableSumTree",
                root_key.clone(),
                Some(sum.to_string()),
                None,
            ),
            Element::CountTree(root_key, count, _) => {
                ("CountTree", root_key.clone(), None, Some(count.to_string()))
            }
            Element::ProvableCountTree(root_key, count, _) => (
                "ProvableCountTree",
                root_key.clone(),
                None,
                Some(count.to_string()),
            ),
            Element::CountSumTree(root_key, count, sum, _) => (
                "CountSumTree",
                root_key.clone(),
                Some(sum.to_string()),
                Some(count.to_string()),
            ),
            Element::ProvableCountSumTree(root_key, count, sum, _) => (
                "ProvableCountSumTree",
                root_key.clone(),
                Some(sum.to_string()),
                Some(count.to_string()),
            ),
            Element::ProvableCountProvableSumTree(root_key, count, sum, _) => (
                "ProvableCountProvableSumTree",
                root_key.clone(),
                Some(sum.to_string()),
                Some(count.to_string()),
            ),

            // Append-only trees keep their root hash outside the element; the
            // only field worth surfacing is how many items they hold.
            Element::CommitmentTree(total_count, _, _) => {
                ("CommitmentTree", None, None, Some(total_count.to_string()))
            }
            Element::MmrTree(mmr_size, _) => ("MmrTree", None, None, Some(mmr_size.to_string())),
            Element::BulkAppendTree(total_count, _, _) => {
                ("BulkAppendTree", None, None, Some(total_count.to_string()))
            }
            Element::DenseAppendOnlyFixedSizeTree(count, _, _) => (
                "DenseAppendOnlyFixedSizeTree",
                None,
                None,
                Some(count.to_string()),
            ),
        };

        GroveElementNAPI {
            element_type: element_type.to_string(),
            wrapper: wrapper.map(str::to_string),
            value,
            sum,
            count,
        }
    }
}

/// A proven element together with the key it is stored under.
#[derive(Clone)]
#[napi(js_name = "GroveElementEntryNAPI")]
pub struct GroveElementEntryNAPI {
    pub(crate) key: Vec<u8>,
    pub(crate) element: GroveElementNAPI,
}

#[napi]
impl GroveElementEntryNAPI {
    #[napi(getter, js_name = "key")]
    pub fn key(&self) -> Uint8Array {
        self.key.clone().into()
    }

    #[napi(getter, js_name = "element")]
    pub fn element(&self) -> GroveElementNAPI {
        self.element.clone()
    }
}

/// A truncated subtree: the proof stops here, and `hash` is what a follow-up
/// branch proof for this key must reproduce.
#[derive(Clone)]
#[napi(js_name = "GroveLeafInfoNAPI")]
pub struct GroveLeafInfoNAPI {
    pub(crate) key: Vec<u8>,
    pub(crate) hash: Vec<u8>,
    pub(crate) count: Option<BigIntString>,
}

#[napi]
impl GroveLeafInfoNAPI {
    #[napi(getter, js_name = "key")]
    pub fn key(&self) -> Uint8Array {
        self.key.clone().into()
    }

    /// Pass this as `expectedRootHash` when verifying the branch proof for this
    /// key.
    #[napi(getter, js_name = "hash")]
    pub fn hash(&self) -> Uint8Array {
        self.hash.clone().into()
    }

    /// How many elements the truncated subtree holds. Only the counted tree
    /// types carry this.
    #[napi(getter, js_name = "count")]
    pub fn count(&self) -> Option<BigIntString> {
        self.count.clone()
    }
}

impl GroveLeafInfoNAPI {
    pub(crate) fn from_leaf(key: &[u8], info: &LeafInfo) -> Self {
        GroveLeafInfoNAPI {
            key: key.to_vec(),
            hash: info.hash.to_vec(),
            count: info.count.map(|count| count.to_string()),
        }
    }
}

/// An ancestor of a leaf whose subtree is large enough to hide which leaf was
/// actually wanted.
#[derive(Clone)]
#[napi(js_name = "GroveAncestorNAPI")]
pub struct GroveAncestorNAPI {
    pub levels_up: u8,
    pub(crate) count: BigIntString,
    pub(crate) key: Vec<u8>,
    pub(crate) hash: Vec<u8>,
}

#[napi]
impl GroveAncestorNAPI {
    #[napi(getter, js_name = "count")]
    pub fn count(&self) -> BigIntString {
        self.count.clone()
    }

    #[napi(getter, js_name = "key")]
    pub fn key(&self) -> Uint8Array {
        self.key.clone().into()
    }

    #[napi(getter, js_name = "hash")]
    pub fn hash(&self) -> Uint8Array {
        self.hash.clone().into()
    }
}
