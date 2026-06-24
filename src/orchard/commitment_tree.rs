use grovedb_commitment_tree::{ClientMemoryCommitmentTree, Position, Retention};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::orchard::merkle_path::MerklePathNAPI;

/// Client-side Orchard note commitment tree.
///
/// Rebuild the tree by appending every note commitment (`cmx`) in tree order,
/// then produce a spend witness (`MerklePath`) for any leaf you marked. The
/// witness + [`anchor`](Self::anchor) are what a shielded spend (withdrawal,
/// unshield, transfer) needs to prove a note is in the tree.
///
/// Typical flow:
/// 1. `append(cmx, marked)` for each commitment (mark the ones you'll spend),
/// 2. `checkpoint(id)` once all commitments up to your anchor are in,
/// 3. `witness(position)` for the marked leaf and `anchor()` for the root —
///    both taken from the same state so `merklePath.root(cmx) == anchor`.
#[napi(js_name = "CommitmentTreeNAPI")]
pub struct CommitmentTreeNAPI(ClientMemoryCommitmentTree);

#[napi]
impl CommitmentTreeNAPI {
    /// Creates an empty tree. `max_checkpoints` bounds how many historical
    /// checkpoints are retained for witnessing (default 100).
    #[napi(constructor)]
    pub fn new(max_checkpoints: Option<u32>) -> Self {
        CommitmentTreeNAPI(ClientMemoryCommitmentTree::new(
            max_checkpoints.unwrap_or(100) as usize,
        ))
    }

    /// Appends a 32-byte note commitment (`cmx`). Set `marked` to `true` for
    /// commitments you intend to spend (only marked leaves can be witnessed).
    #[napi(js_name = "append")]
    pub fn append(&mut self, js_cmx: Uint8Array, marked: bool) -> Result<(), napi::Error> {
        if js_cmx.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "cmx must be 32 bytes length",
            ));
        }
        let cmx: [u8; 32] = js_cmx.to_vec().as_slice().try_into().unwrap();

        let retention = if marked {
            Retention::Marked
        } else {
            Retention::Ephemeral
        };

        self.0.append(cmx, retention).map_err(|e| {
            napi::Error::new(napi::Status::GenericFailure, format!("append failed: {e}"))
        })
    }

    /// Records a checkpoint at the current state. Witnesses are produced
    /// relative to checkpoints, so checkpoint after appending the commitments
    /// up to the anchor you want to spend against.
    #[napi(js_name = "checkpoint")]
    pub fn checkpoint(&mut self, checkpoint_id: u32) -> Result<bool, napi::Error> {
        self.0.checkpoint(checkpoint_id).map_err(|e| {
            napi::Error::new(
                napi::Status::GenericFailure,
                format!("checkpoint failed: {e}"),
            )
        })
    }

    /// Position (leaf index) of the most recently appended commitment, or
    /// `null` if the tree is empty.
    #[napi(js_name = "maxLeafPosition")]
    pub fn max_leaf_position(&self) -> Result<Option<u32>, napi::Error> {
        let pos = self.0.max_leaf_position().map_err(|e| {
            napi::Error::new(
                napi::Status::GenericFailure,
                format!("max_leaf_position failed: {e}"),
            )
        })?;

        Ok(pos.map(|p| u64::from(p) as u32))
    }

    /// Produces the Merkle witness for the marked leaf at `position`.
    /// `checkpoint_depth` is 0 for the current state, 1 for the previous
    /// checkpoint, etc. Returns `null` if no witness is available.
    #[napi(js_name = "witness")]
    pub fn witness(
        &self,
        position: u32,
        checkpoint_depth: Option<u32>,
    ) -> Result<Option<MerklePathNAPI>, napi::Error> {
        let path = self
            .0
            .witness(
                Position::from(position as u64),
                checkpoint_depth.unwrap_or(0) as usize,
            )
            .map_err(|e| {
                napi::Error::new(napi::Status::GenericFailure, format!("witness failed: {e}"))
            })?;

        Ok(path.map(MerklePathNAPI::from))
    }

    /// The current tree root as a 32-byte Orchard `Anchor` (the empty-tree
    /// anchor if nothing has been appended).
    #[napi(js_name = "anchor")]
    pub fn anchor(&self) -> Result<Uint8Array, napi::Error> {
        let anchor = self.0.anchor().map_err(|e| {
            napi::Error::new(napi::Status::GenericFailure, format!("anchor failed: {e}"))
        })?;

        Ok(Uint8Array::from(anchor.to_bytes().to_vec()))
    }
}
