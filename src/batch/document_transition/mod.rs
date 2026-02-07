use dpp::prelude::{Identifier};
use dpp::state_transition::batch_transition::batched_transition::document_transition::{
    DocumentTransition, DocumentTransitionV0Methods,
};
use dpp::state_transition::batch_transition::batched_transition::document_transition_action_type::{DocumentTransitionActionType, DocumentTransitionActionTypeGetter};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::batch::document_transition::transitions::create::DocumentCreateTransitionNAPI;
use crate::batch::document_transition::transitions::delete::DocumentDeleteTransitionNAPI;
use crate::batch::document_transition::transitions::purchase::DocumentPurchaseTransitionNAPI;
use crate::batch::document_transition::transitions::replace::DocumentReplaceTransitionNAPI;
use crate::batch::document_transition::transitions::transfer::DocumentTransferTransitionNAPI;
use crate::batch::document_transition::transitions::update_price::DocumentUpdatePriceTransitionNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::enums::batch_type::BatchTypeNAPI;
use crate::identifier::IdentifierNAPI;

pub mod transitions;

#[derive(Clone)]
#[napi(js_name = "DocumentTransitionNAPI")]
pub struct DocumentTransitionNAPI(DocumentTransition);

impl From<DocumentTransition> for DocumentTransitionNAPI {
    fn from(transition: DocumentTransition) -> Self {
        DocumentTransitionNAPI(transition)
    }
}

impl From<DocumentTransitionNAPI> for DocumentTransition {
    fn from(transition: DocumentTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl DocumentTransitionNAPI {
    #[napi(getter, js_name = "actionType")]
    pub fn get_action_type(&self) -> String {
        BatchTypeNAPI::from(self.0.action_type()).into()
    }

    #[napi(getter, js_name = "actionTypeNumber")]
    pub fn get_action_type_number(&self) -> u8 {
        match self.0.action_type() {
            DocumentTransitionActionType::Create => 0,
            DocumentTransitionActionType::Replace => 1,
            DocumentTransitionActionType::Delete => 2,
            DocumentTransitionActionType::Transfer => 3,
            DocumentTransitionActionType::Purchase => 4,
            DocumentTransitionActionType::UpdatePrice => 5,
            DocumentTransitionActionType::IgnoreWhileBumpingRevision => 6,
        }
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn get_data_contract_id(&self) -> IdentifierNAPI {
        self.0.data_contract_id().into()
    }

    #[napi(getter, js_name = "id")]
    pub fn get_id(&self) -> IdentifierNAPI {
        self.0.get_id().into()
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn get_document_type_name(&self) -> String {
        self.0.document_type_name().clone()
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_contract_nonce())
    }

    #[napi(getter, js_name = "revision")]
    pub fn get_revision(&self) -> Option<BigIntString> {
        self.0.revision().map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "entropy")]
    pub fn get_entropy(&self) -> Option<Uint8Array> {
        self.0.entropy().map(Into::into)
    }

    #[napi(getter, js_name = "createTransition")]
    pub fn get_create_transition(&self) -> Result<DocumentCreateTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::Create(create) => Ok(DocumentCreateTransitionNAPI::from(create)),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(getter, js_name = "deleteTransition")]
    pub fn get_delete_transition(&self) -> Result<DocumentDeleteTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::Delete(delete) => Ok(DocumentDeleteTransitionNAPI::from(delete)),
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(getter, js_name = "purchaseTransition")]
    pub fn get_purchase_transition(&self) -> Result<DocumentPurchaseTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::Purchase(purchase) => {
                Ok(DocumentPurchaseTransitionNAPI::from(purchase))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(getter, js_name = "replaceTransition")]
    pub fn get_replace_transition(&self) -> Result<DocumentReplaceTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::Replace(replace) => {
                Ok(DocumentReplaceTransitionNAPI::from(replace))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(getter, js_name = "transferTransition")]
    pub fn get_transfer_transition(&self) -> Result<DocumentTransferTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::Transfer(transfer) => {
                Ok(DocumentTransferTransitionNAPI::from(transfer))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(getter, js_name = "updatePriceTransition")]
    pub fn get_update_price_transition(
        &self,
    ) -> Result<DocumentUpdatePriceTransitionNAPI, napi::Error> {
        match self.0.clone() {
            DocumentTransition::UpdatePrice(update_price) => {
                Ok(DocumentUpdatePriceTransitionNAPI::from(update_price))
            }
            _ => Err(napi::Error::new(
                napi::Status::GenericFailure,
                "transition type mismatch",
            )),
        }
    }

    #[napi(setter, js_name = "dataContractId")]
    pub fn set_data_contract_id(
        &mut self,
        js_data_contract_id: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_data_contract_id(IdentifierNAPI::try_from(js_data_contract_id)?.into()))
    }

    #[napi(setter, js_name = "revision")]
    pub fn set_revision(&mut self, revision: BigIntString) -> Result<(), napi::Error> {
        Ok(self.0.set_revision(revision.try_to_u64()?))
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(
        &mut self,
        identity_contract_nonce: BigIntString,
    ) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_identity_contract_nonce(identity_contract_nonce.try_to_u64()?))
    }
}

impl DocumentTransitionNAPI {
    pub fn rs_get_data_contract_id(&self) -> Identifier {
        self.0.data_contract_id()
    }

    pub fn rs_get_id(&self) -> Identifier {
        self.0.get_id()
    }

    pub fn rs_get_entropy(&self) -> Option<Vec<u8>> {
        self.0.entropy()
    }

    pub fn rs_get_revision(&self) -> Option<u64> {
        self.0.revision()
    }

    pub fn rs_get_identity_contract_nonce(&self) -> u64 {
        self.0.identity_contract_nonce()
    }
}
