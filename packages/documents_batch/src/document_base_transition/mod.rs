use dpp::prelude::IdentityNonce;
use dpp::state_transition::documents_batch_transition::document_base_transition::DocumentBaseTransition;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::DocumentBaseTransitionV0;
use dpp::state_transition::documents_batch_transition::document_base_transition::v0::v0_methods::DocumentBaseTransitionV0Methods;
use pshenmic_dpp_utils::identifier_from_js_value;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "DocumentBaseTransitionWASM")]
pub struct DocumentBaseTransitionWASM(DocumentBaseTransition);

impl From<DocumentBaseTransition> for DocumentBaseTransitionWASM {
    fn from(v: DocumentBaseTransition) -> Self {
        DocumentBaseTransitionWASM(v)
    }
}

impl From<DocumentBaseTransitionWASM> for DocumentBaseTransition {
    fn from(v: DocumentBaseTransitionWASM) -> Self {
        v.0
    }
}

#[wasm_bindgen]
impl DocumentBaseTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(
        js_document_id: JsValue,
        identity_contract_nonce: IdentityNonce,
        document_type_name: String,
        js_data_contract_id: JsValue,
    ) -> Result<DocumentBaseTransitionWASM, JsValue> {
        let document_id = identifier_from_js_value(&js_document_id)?;
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        let rs_base_v0 = DocumentBaseTransitionV0 {
            id: document_id,
            identity_contract_nonce,
            document_type_name,
            data_contract_id,
        };

        Ok(DocumentBaseTransitionWASM(DocumentBaseTransition::from(
            rs_base_v0,
        )))
    }

    #[wasm_bindgen(getter = "id")]
    pub fn get_id(&self) -> Vec<u8> {
        self.0.id().to_vec()
    }

    #[wasm_bindgen(getter = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> IdentityNonce {
        self.0.identity_contract_nonce()
    }

    #[wasm_bindgen(getter = "dataContractId")]
    pub fn get_data_contract_id(&self) -> Vec<u8> {
        self.0.data_contract_id().to_vec()
    }

    #[wasm_bindgen(getter = "documentTypeName")]
    pub fn get_document_type_name(&self) -> String {
        self.0.document_type_name().to_string()
    }

    #[wasm_bindgen(setter = "id")]
    pub fn set_id(&mut self, js_id: JsValue) -> Result<(), JsValue> {
        let id = identifier_from_js_value(&js_id)?;

        Ok(self.0.set_id(id))
    }

    #[wasm_bindgen(setter = "identityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: IdentityNonce) {
        self.0.set_identity_contract_nonce(nonce)
    }

    #[wasm_bindgen(setter = "dataContractId")]
    pub fn set_data_contract_id(&mut self, js_data_contract_id: JsValue) -> Result<(), JsValue> {
        let data_contract_id = identifier_from_js_value(&js_data_contract_id)?;

        Ok(self.0.set_data_contract_id(data_contract_id))
    }

    #[wasm_bindgen(setter = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.0.set_document_type_name(document_type_name)
    }
}
