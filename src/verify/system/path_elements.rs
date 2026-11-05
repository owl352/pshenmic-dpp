use drive::{drive::Drive, grovedb::Element};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::DynamicValue,
    verify::{
        address_funds::entities::GroveElementNAPI,
        plain::{platform_version_from_js, verify_error},
    },
};

/// A requested key and the element proven under it.
#[napi(js_name = "VerifiedPathElementNAPI")]
pub struct VerifiedPathElementNAPI {
    pub(crate) key: Vec<u8>,
    pub(crate) element: Option<GroveElementNAPI>,
}

#[napi]
impl VerifiedPathElementNAPI {
    #[napi(getter, js_name = "key")]
    pub fn key(&self) -> Uint8Array {
        self.key.clone().into()
    }

    /// Always set in practice: the raw proof verification only yields existing
    /// elements. Optional because drive's API types it that way.
    #[napi(getter, js_name = "element")]
    pub fn element(&self) -> Option<GroveElementNAPI> {
        self.element.clone()
    }
}

#[napi(js_name = "VerifiedPathElementsNAPI")]
pub struct VerifiedPathElementsNAPI {
    pub root_hash: Uint8Array,
    pub(crate) elements: Vec<(Vec<u8>, Option<Element>)>,
}

#[napi]
impl VerifiedPathElementsNAPI {
    /// Found elements in key order; keys proven absent are omitted.
    #[napi(getter, js_name = "elements")]
    pub fn elements(&self) -> Vec<VerifiedPathElementNAPI> {
        self.elements
            .iter()
            .map(|(key, element)| VerifiedPathElementNAPI {
                key: key.clone(),
                element: element.as_ref().map(GroveElementNAPI::from),
            })
            .collect()
    }
}

/// Verifies a `getPathElements` proof: the elements stored under `keys` in the
/// subtree at `path`.
#[napi(js_name = "verifyPathElementsProof")]
pub fn verify_path_elements(
    proof: Uint8Array,
    path: Vec<Uint8Array>,
    keys: Vec<Uint8Array>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedPathElementsNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, elements) = Drive::verify_elements(
        &proof,
        path.iter().map(|segment| segment.to_vec()).collect(),
        keys.iter().map(|key| key.to_vec()).collect(),
        &platform_version,
    )
    .map_err(verify_error)?;

    Ok(VerifiedPathElementsNAPI {
        root_hash: root_hash.into(),
        elements: elements.into_iter().collect(),
    })
}
