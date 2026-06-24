use grovedb_commitment_tree::{MerkleHashOrchard, MerklePath, NOTE_COMMITMENT_TREE_DEPTH};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

/// Converts a JS array of 32-byte sibling hashes into the fixed-size Orchard
/// auth path (`NOTE_COMMITMENT_TREE_DEPTH` entries).
fn build_auth_path(
    js_auth_path: &[Uint8Array],
) -> Result<[MerkleHashOrchard; NOTE_COMMITMENT_TREE_DEPTH], napi::Error> {
    if js_auth_path.len() != NOTE_COMMITMENT_TREE_DEPTH {
        return Err(napi::Error::new(
            napi::Status::InvalidArg,
            format!("authPath must have exactly {NOTE_COMMITMENT_TREE_DEPTH} sibling hashes"),
        ));
    }

    let mut hashes: Vec<MerkleHashOrchard> = Vec::with_capacity(NOTE_COMMITMENT_TREE_DEPTH);
    for (i, node) in js_auth_path.iter().enumerate() {
        if node.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!("authPath[{i}] must be 32 bytes length"),
            ));
        }
        let bytes: [u8; 32] = node.to_vec().as_slice().try_into().unwrap();
        let hash = Option::from(MerkleHashOrchard::from_bytes(&bytes)).ok_or_else(|| {
            napi::Error::new(
                napi::Status::InvalidArg,
                format!("authPath[{i}] is not a valid Merkle node"),
            )
        })?;
        hashes.push(hash);
    }

    hashes
        .try_into()
        .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "failed to build authPath"))
}

/// The Merkle path from a note commitment leaf to the tree anchor: the leaf
/// `position` plus the `NOTE_COMMITMENT_TREE_DEPTH` sibling hashes.
#[napi(js_name = "MerklePathNAPI")]
#[derive(Clone)]
pub struct MerklePathNAPI(MerklePath);

impl From<MerklePath> for MerklePathNAPI {
    fn from(value: MerklePath) -> Self {
        MerklePathNAPI(value)
    }
}

impl From<MerklePathNAPI> for MerklePath {
    fn from(value: MerklePathNAPI) -> Self {
        value.0
    }
}

#[napi]
impl MerklePathNAPI {
    #[napi(constructor)]
    pub fn new(js_position: u32, js_auth_path: Vec<Uint8Array>) -> Result<Self, napi::Error> {
        Ok(MerklePathNAPI(MerklePath::from_parts(
            js_position,
            build_auth_path(&js_auth_path)?,
        )))
    }

    #[napi(getter, js_name = "position")]
    pub fn position(&self) -> u32 {
        self.0.position()
    }

    #[napi(getter, js_name = "authPath")]
    pub fn auth_path(&self) -> Vec<Uint8Array> {
        self.0
            .auth_path()
            .iter()
            .map(|hash| Uint8Array::from(hash.to_bytes().to_vec()))
            .collect()
    }

    #[napi(setter, js_name = "position")]
    pub fn set_position(&mut self, js_position: u32) {
        self.0 = MerklePath::from_parts(js_position, self.0.auth_path());
    }

    #[napi(setter, js_name = "authPath")]
    pub fn set_auth_path(&mut self, js_auth_path: Vec<Uint8Array>) -> Result<(), napi::Error> {
        self.0 = MerklePath::from_parts(self.0.position(), build_auth_path(&js_auth_path)?);

        Ok(())
    }
}
