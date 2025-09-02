use dpp::voting::contender_structs::ContenderWithSerializedDocument;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "ContenderWithSerializedDocumentWASM")]
pub struct ContenderWithSerializedDocumentWASM(ContenderWithSerializedDocument);

impl From<ContenderWithSerializedDocument> for ContenderWithSerializedDocumentWASM {
    fn from(contender: ContenderWithSerializedDocument) -> Self {
        ContenderWithSerializedDocumentWASM(contender)
    }
}

#[wasm_bindgen]
impl ContenderWithSerializedDocumentWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "ContenderWithSerializedDocumentWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "ContenderWithSerializedDocumentWASM".to_string()
    }

    #[wasm_bindgen(getter = "identityId")]
    pub fn identity_id(&self) -> IdentifierWASM {
        self.0.identity_id().into()
    }

    #[wasm_bindgen(getter = "serializedDocument")]
    pub fn serialized_document(&self) -> Option<Vec<u8>> {
        self.0.serialized_document().clone()
    }

    #[wasm_bindgen(getter = "voteTally")]
    pub fn vote_tally(&self) -> Option<u32> {
        self.0.vote_tally()
    }
}
