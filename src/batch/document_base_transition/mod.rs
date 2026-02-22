use dpp::state_transition::batch_transition::document_base_transition::DocumentBaseTransition;
use dpp::state_transition::batch_transition::document_base_transition::v0::v0_methods::DocumentBaseTransitionV0Methods;
use dpp::state_transition::batch_transition::document_base_transition::v1::DocumentBaseTransitionV1;
use dpp::state_transition::batch_transition::document_base_transition::v1::v1_methods::DocumentBaseTransitionV1Methods;
use dpp::tokens::token_payment_info::TokenPaymentInfo;
use napi_derive::napi;

use crate::{
    batch::token_payment_info::TokenPaymentInfoNAPI,
    dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64},
    identifier::IdentifierNAPI,
};

#[derive(Clone)]
#[napi(js_name = "DocumentBaseTransitionNAPI")]
pub struct DocumentBaseTransitionNAPI(DocumentBaseTransition);

impl From<DocumentBaseTransition> for DocumentBaseTransitionNAPI {
    fn from(v: DocumentBaseTransition) -> Self {
        DocumentBaseTransitionNAPI(v)
    }
}

impl From<DocumentBaseTransitionNAPI> for DocumentBaseTransition {
    fn from(v: DocumentBaseTransitionNAPI) -> Self {
        v.0
    }
}

#[napi]
impl DocumentBaseTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_document_id: IdentifierLikeNAPI,
        identity_contract_nonce: BigIntString,
        document_type_name: String,
        js_data_contract_id: IdentifierLikeNAPI,
        js_token_payment_info: Option<&TokenPaymentInfoNAPI>,
    ) -> Result<DocumentBaseTransitionNAPI, napi::Error> {
        let token_payment_info: Option<TokenPaymentInfo> =
            js_token_payment_info.map(|info| info.clone().into());

        Ok(DocumentBaseTransitionNAPI(DocumentBaseTransition::from(
            DocumentBaseTransitionV1 {
                id: IdentifierNAPI::try_from(js_document_id)?.into(),
                identity_contract_nonce: identity_contract_nonce.try_to_u64()?,
                document_type_name,
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                token_payment_info,
            },
        )))
    }

    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.0.id().into()
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_contract_nonce())
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        self.0.data_contract_id().into()
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn get_document_type_name(&self) -> String {
        self.0.document_type_name().to_string()
    }

    #[napi(getter, js_name = "tokenPaymentInfo")]
    pub fn get_token_payment_info(&self) -> Option<TokenPaymentInfoNAPI> {
        self.0.token_payment_info().map(Into::into)
    }

    #[napi(setter, js_name = "id")]
    pub fn set_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        self.0.set_id(IdentifierNAPI::try_from(js_id)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_identity_contract_nonce(nonce.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        self.0
            .set_data_contract_id(IdentifierNAPI::try_from(js_data_contract_id)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.0.set_document_type_name(document_type_name)
    }

    #[napi(setter, js_name = "tokenPaymentInfo")]
    pub fn set_token_payment_info(&mut self, token_payment_info: &TokenPaymentInfoNAPI) {
        self.0
            .set_token_payment_info(token_payment_info.clone().into())
    }

    #[napi(js_name = "clearTokenPaymentInfo")]
    pub fn clear_token_payment_info(&mut self) {
        self.0.clear_token_payment_info();
    }
}
