use dpp::shielded::SerializedAction;
use grovedb_commitment_tree::DashMemo;
use grovedb_commitment_tree::{
    COMPACT_NOTE_SIZE, CompactAction, EphemeralKeyBytes, ExtractedNoteCommitment, Nullifier,
    OrchardDomain, PreparedIncomingViewingKey, Scope, try_compact_note_decryption,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::orchard::{
    note::NoteNAPI, serialized_action::SerializedActionNAPI,
    viewing_key::full_viewing_key_from_seed,
};

/// A note recovered from a shielded action by trial-decryption, together with
/// the index of the action it was found in (its on-wire / tree-leaf order
/// within the transition's actions).
#[napi(js_name = "RecoveredNoteNAPI")]
pub struct RecoveredNoteNAPI {
    index: u32,
    note: NoteNAPI,
    nullifier: [u8; 32],
}

#[napi]
impl RecoveredNoteNAPI {
    #[napi(getter, js_name = "index")]
    pub fn index(&self) -> u32 {
        self.index
    }

    #[napi(getter, js_name = "note")]
    pub fn note(&self) -> NoteNAPI {
        self.note.clone()
    }

    /// The note's nullifier (32 bytes). Check it against `getShieldedNullifiers`
    /// to tell whether this note has already been spent.
    #[napi(getter, js_name = "nullifier")]
    pub fn nullifier(&self) -> Uint8Array {
        Uint8Array::from(self.nullifier.to_vec())
    }
}

/// Recovers your own notes from a list of shielded actions by trial-decrypting
/// each action's `encrypted_note` with the incoming viewing key derived from
/// `seed` via ZIP-32 (`m/32'/coin_type'/account'`, External scope).
///
/// Only actions addressed to you decrypt; the rest are skipped. Each returned
/// entry carries the action `index` (use it as the leaf position when building
/// the spend witness) and the recovered [`NoteNAPI`] (value, rho, rseed,
/// address) — everything needed to spend it.
#[napi(js_name = "recoverNotes")]
pub fn recover_notes(
    js_actions: Vec<&SerializedActionNAPI>,
    js_seed: Uint8Array,
    js_coin_type: u32,
    js_account: u32,
) -> Result<Vec<RecoveredNoteNAPI>, napi::Error> {
    let fvk = full_viewing_key_from_seed(js_seed.as_ref(), js_coin_type, js_account)?;
    let ivk = PreparedIncomingViewingKey::new(&fvk.to_ivk(Scope::External));

    let mut recovered = Vec::new();

    for (index, js_action) in js_actions.into_iter().enumerate() {
        let action: SerializedAction = js_action.clone().into();

        // encrypted_note layout: epk(32) || enc_ciphertext(104) || out_ciphertext(80).
        // Compact decryption needs epk + the first COMPACT_NOTE_SIZE (52) bytes
        // of enc_ciphertext.
        if action.encrypted_note.len() < 32 + COMPACT_NOTE_SIZE {
            continue;
        }

        let nullifier = match Option::from(Nullifier::from_bytes(&action.nullifier)) {
            Some(n) => n,
            None => continue,
        };
        let cmx = match Option::from(ExtractedNoteCommitment::from_bytes(&action.cmx)) {
            Some(c) => c,
            None => continue,
        };

        let mut epk = [0u8; 32];
        epk.copy_from_slice(&action.encrypted_note[0..32]);
        let ephemeral_key = EphemeralKeyBytes(epk);

        let mut enc_compact = [0u8; COMPACT_NOTE_SIZE];
        enc_compact.copy_from_slice(&action.encrypted_note[32..32 + COMPACT_NOTE_SIZE]);

        let compact_action = CompactAction::from_parts(nullifier, cmx, ephemeral_key, enc_compact);
        let domain = OrchardDomain::<DashMemo>::for_compact_action(&compact_action);

        if let Some((note, _addr)) = try_compact_note_decryption(&domain, &ivk, &compact_action) {
            let note_nullifier = note.nullifier(&fvk).to_bytes();
            recovered.push(RecoveredNoteNAPI {
                index: index as u32,
                note: NoteNAPI::from(note),
                nullifier: note_nullifier,
            });
        }
    }

    Ok(recovered)
}
