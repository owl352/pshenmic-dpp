use dpp::tokens::SharedEncryptedNote;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "SharedEncryptedNoteNAPI")]
pub struct SharedEncryptedNoteNAPI(SharedEncryptedNote);

impl From<SharedEncryptedNote> for SharedEncryptedNoteNAPI {
    fn from(note: SharedEncryptedNote) -> Self {
        Self(note)
    }
}

impl From<SharedEncryptedNoteNAPI> for SharedEncryptedNote {
    fn from(note: SharedEncryptedNoteNAPI) -> Self {
        note.0
    }
}

#[napi]
impl SharedEncryptedNoteNAPI {
    #[napi(constructor)]
    pub fn new(sender_key_index: u32, recipient_key_index: u32, value: Uint8Array) -> Self {
        SharedEncryptedNoteNAPI((sender_key_index, recipient_key_index, value.to_vec()))
    }

    #[napi(getter, js_name = "senderKeyIndex")]
    pub fn sender_key_index(&self) -> u32 {
        self.0.0
    }

    #[napi(getter, js_name = "recipientKeyIndex")]
    pub fn recipient_key_index(&self) -> u32 {
        self.0.1
    }

    #[napi(getter, js_name = "value")]
    pub fn value(&self) -> Uint8Array {
        self.0.2.clone().into()
    }

    #[napi(setter, js_name = "senderKeyIndex")]
    pub fn set_sender_key_index(&mut self, index: u32) {
        self.0.0 = index;
    }

    #[napi(setter, js_name = "recipientKeyIndex")]
    pub fn set_recipient_key_index(&mut self, index: u32) {
        self.0.1 = index;
    }

    #[napi(setter, js_name = "value")]
    pub fn set_value(&mut self, value: Uint8Array) {
        self.0.2 = value.to_vec();
    }
}
