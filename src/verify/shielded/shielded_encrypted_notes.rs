use drive::drive::Drive;
use drive::verify::shielded::verify_shielded_encrypted_notes::VerifiedShieldedEncryptedNote;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, DynamicValue, TryToU64},
    enums::platform_version::PlatformVersionNAPI,
};

#[napi(js_name = "VerifiedShieldedEncryptedNoteNAPI")]
pub struct VerifiedShieldedEncryptedNoteNAPI {
    pub cmx: Uint8Array,
    pub nullifier: Uint8Array,
    pub cv_net: Uint8Array,
    pub encrypted_note: Uint8Array,
}

impl From<&VerifiedShieldedEncryptedNote> for VerifiedShieldedEncryptedNoteNAPI {
    fn from(n: &VerifiedShieldedEncryptedNote) -> Self {
        VerifiedShieldedEncryptedNoteNAPI {
            cmx: Uint8Array::from(n.cmx.to_vec()),
            nullifier: Uint8Array::from(n.nullifier.to_vec()),
            cv_net: Uint8Array::from(n.cv_net.to_vec()),
            encrypted_note: Uint8Array::from(n.encrypted_note.to_vec()),
        }
    }
}

#[napi(js_name = "VerifiedShieldedEncryptedNotesNAPI")]
pub struct VerifiedShieldedEncryptedNotesNAPI {
    pub root_hash: Uint8Array,
    pub(crate) notes: Vec<VerifiedShieldedEncryptedNote>,
    pub total_count: BigIntString,
}

#[napi]
impl VerifiedShieldedEncryptedNotesNAPI {
    #[napi(getter, js_name = "notes")]
    pub fn notes(&self) -> Vec<VerifiedShieldedEncryptedNoteNAPI> {
        self.notes.iter().map(Into::into).collect()
    }
}

#[napi(js_name = "verifyShieldedEncryptedNotesProof")]
pub fn verify_shielded_encrypted_notes(
    proof: Uint8Array,
    start_index: BigIntString,
    count: u32,
    max_elements: u32,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedShieldedEncryptedNotesNAPI, napi::Error> {
    let platform_version = PlatformVersionNAPI::try_from(js_platform_version)?;
    let start_index: u64 = start_index.try_to_u64()?;

    let (root_hash, notes, total_count) = Drive::verify_shielded_encrypted_notes(
        &proof.to_vec(),
        start_index,
        count,
        max_elements,
        verify_subset_of_proof,
        &platform_version.into(),
    )
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, e.to_string()))?;

    Ok(VerifiedShieldedEncryptedNotesNAPI {
        root_hash: root_hash.into(),
        notes,
        total_count: BigIntString::from_u64(total_count),
    })
}
