use dpp::shielded::builder::SpendableNote;
use napi_derive::napi;

use crate::orchard::{merkle_path::MerklePathNAPI, note::NoteNAPI};

/// An Orchard note to spend, paired with its Merkle inclusion path in the note
/// commitment tree — the unit consumed by a shielded spend (withdrawal, etc.).
#[napi(js_name = "SpendableNoteNAPI")]
pub struct SpendableNoteNAPI(SpendableNote);

impl Clone for SpendableNoteNAPI {
    fn clone(&self) -> Self {
        SpendableNoteNAPI(SpendableNote {
            note: self.0.note,
            merkle_path: self.0.merkle_path.clone(),
        })
    }
}

impl From<SpendableNote> for SpendableNoteNAPI {
    fn from(value: SpendableNote) -> Self {
        SpendableNoteNAPI(value)
    }
}

impl From<SpendableNoteNAPI> for SpendableNote {
    fn from(value: SpendableNoteNAPI) -> Self {
        value.0
    }
}

impl SpendableNoteNAPI {
    pub(crate) fn to_spendable(&self) -> SpendableNote {
        self.clone().0
    }
}

#[napi]
impl SpendableNoteNAPI {
    #[napi(constructor)]
    pub fn new(js_note: &NoteNAPI, js_merkle_path: &MerklePathNAPI) -> Self {
        SpendableNoteNAPI(SpendableNote {
            note: js_note.clone().into(),
            merkle_path: js_merkle_path.clone().into(),
        })
    }

    #[napi(getter, js_name = "note")]
    pub fn note(&self) -> NoteNAPI {
        NoteNAPI::from(self.0.note)
    }

    #[napi(getter, js_name = "merklePath")]
    pub fn merkle_path(&self) -> MerklePathNAPI {
        MerklePathNAPI::from(self.0.merkle_path.clone())
    }

    #[napi(setter, js_name = "note")]
    pub fn set_note(&mut self, js_note: &NoteNAPI) {
        self.0.note = js_note.clone().into();
    }

    #[napi(setter, js_name = "merklePath")]
    pub fn set_merkle_path(&mut self, js_merkle_path: &MerklePathNAPI) {
        self.0.merkle_path = js_merkle_path.clone().into();
    }
}
