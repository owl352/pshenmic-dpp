use dpp::tokens::PrivateEncryptedNote;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "PrivateEncryptedNoteNAPI")]
pub struct PrivateEncryptedNoteNAPI(PrivateEncryptedNote);

impl From<PrivateEncryptedNote> for PrivateEncryptedNoteNAPI {
    fn from(value: PrivateEncryptedNote) -> Self {
        PrivateEncryptedNoteNAPI(value)
    }
}

impl From<PrivateEncryptedNoteNAPI> for PrivateEncryptedNote {
    fn from(value: PrivateEncryptedNoteNAPI) -> Self {
        value.0
    }
}

#[napi]
impl PrivateEncryptedNoteNAPI {
    #[napi(constructor)]
    pub fn new(
        root_encryption_key_index: u32,
        derivation_encryption_key_index: u32,
        value: Uint8Array,
    ) -> PrivateEncryptedNoteNAPI {
        PrivateEncryptedNoteNAPI((
            root_encryption_key_index,
            derivation_encryption_key_index,
            value.to_vec(),
        ))
    }

    #[napi(getter, js_name = "rootEncryptionKeyIndex")]
    pub fn root_encryption_key_index(&self) -> u32 {
        self.0.0
    }

    #[napi(getter, js_name = "derivationEncryptionKeyIndex")]
    pub fn derivation_encryption_key_index(&self) -> u32 {
        self.0.1
    }

    #[napi(getter, js_name = "value")]
    pub fn value(&self) -> Uint8Array {
        self.0.2.clone().into()
    }

    #[napi(setter, js_name = "rootEncryptionKeyIndex")]
    pub fn set_root_encryption_key_index(&mut self, index: u32) {
        self.0.0 = index;
    }

    #[napi(setter, js_name = "derivationEncryptionKeyIndex")]
    pub fn set_derivation_encryption_key_index(&mut self, index: u32) {
        self.0.1 = index;
    }

    #[napi(setter, js_name = "value")]
    pub fn set_value(&mut self, value: Uint8Array) {
        self.0.2 = value.to_vec();
    }
}
