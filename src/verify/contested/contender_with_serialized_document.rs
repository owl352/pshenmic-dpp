use dpp::voting::contender_structs::ContenderWithSerializedDocument;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::identifier::IdentifierNAPI;

#[napi(js_name = "ContenderWithSerializedDocumentNAPI")]
pub struct ContenderWithSerializedDocumentNAPI(ContenderWithSerializedDocument);

impl From<ContenderWithSerializedDocument> for ContenderWithSerializedDocumentNAPI {
    fn from(contender: ContenderWithSerializedDocument) -> Self {
        ContenderWithSerializedDocumentNAPI(contender)
    }
}

#[napi]
impl ContenderWithSerializedDocumentNAPI {
    #[napi(getter, js_name = "identityId")]
    pub fn identity_id(&self) -> IdentifierNAPI {
        self.0.identity_id().into()
    }

    #[napi(getter, js_name = "serializedDocument")]
    pub fn serialized_document(&self) -> Option<Uint8Array> {
        self.0.serialized_document().clone().map(Uint8Array::from)
    }

    #[napi(getter, js_name = "voteTally")]
    pub fn vote_tally(&self) -> Option<u32> {
        self.0.vote_tally()
    }
}
