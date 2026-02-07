use dpp::prelude::Identifier;
use dpp::state_transition::batch_transition::token_base_transition::token_base_transition_accessors::TokenBaseTransitionAccessors;
use dpp::state_transition::batch_transition::TokenTransferTransition;
use dpp::state_transition::batch_transition::token_transfer_transition::TokenTransferTransitionV0;
use dpp::state_transition::batch_transition::token_transfer_transition::v0::v0_methods::TokenTransferTransitionV0Methods;
use dpp::tokens::{PrivateEncryptedNote, SharedEncryptedNote};
use napi_derive::napi;

use crate::batch::token_base_transition::TokenBaseTransitionNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::encrypted_note::private_encrypted_note::PrivateEncryptedNoteNAPI;
use crate::encrypted_note::shared_encrypted_note::SharedEncryptedNoteNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenTransferTransitionNAPI")]
pub struct TokenTransferTransitionNAPI(TokenTransferTransition);

impl From<TokenTransferTransition> for TokenTransferTransitionNAPI {
    fn from(transition: TokenTransferTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenTransferTransitionNAPI> for TokenTransferTransition {
    fn from(transition: TokenTransferTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenTransferTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        base: &TokenBaseTransitionNAPI,
        js_recipient_id: IdentifierLikeNAPI,
        amount: BigIntString,
        public_note: Option<String>,
        js_shared_encrypted_note: Option<&SharedEncryptedNoteNAPI>,
        js_private_encrypted_note: Option<&PrivateEncryptedNoteNAPI>,
    ) -> Result<TokenTransferTransitionNAPI, napi::Error> {
        let recipient_id: Identifier = IdentifierNAPI::try_from(js_recipient_id)?.into();

        let shared_encrypted_note: Option<SharedEncryptedNote> =
            js_shared_encrypted_note.map(|note| note.clone().into());

        let private_encrypted_note: Option<PrivateEncryptedNote> =
            js_private_encrypted_note.map(|note| note.clone().into());

        Ok(TokenTransferTransitionNAPI(TokenTransferTransition::V0(
            TokenTransferTransitionV0 {
                base: base.clone().into(),
                recipient_id,
                amount: amount.try_to_u64()?,
                public_note,
                shared_encrypted_note,
                private_encrypted_note,
            },
        )))
    }

    #[napi(getter, js_name = "amount")]
    pub fn get_amount(&self) -> BigIntString {
        BigIntString::from_u64(self.0.amount())
    }

    #[napi(getter, js_name = "base")]
    pub fn get_base(&self) -> TokenBaseTransitionNAPI {
        self.0.base().clone().into()
    }

    #[napi(getter, js_name = "publicNote")]
    pub fn get_public_note(&self) -> Option<String> {
        self.clone().0.public_note_owned()
    }

    #[napi(getter, js_name = "sharedEncryptedNote")]
    pub fn get_shared_encrypted_note(&self) -> Option<SharedEncryptedNoteNAPI> {
        self.clone()
            .0
            .shared_encrypted_note_owned()
            .map(|note| note.clone().into())
    }

    #[napi(getter, js_name = "privateEncryptedNote")]
    pub fn get_private_encrypted_note(&self) -> Option<PrivateEncryptedNoteNAPI> {
        self.clone()
            .0
            .private_encrypted_note_owned()
            .map(|note| note.clone().into())
    }

    #[napi(getter, js_name = recipientId)]
    pub fn recipient_id(&self) -> IdentifierNAPI {
        self.0.recipient_id().into()
    }

    #[napi(setter, js_name = recipientId)]
    pub fn set_recipient_id(
        &mut self,
        js_recipient: IdentifierLikeNAPI,
    ) -> Result<(), napi::Error> {
        let recipient = IdentifierNAPI::try_from(js_recipient)?;

        self.0.set_recipient_id(recipient.into());

        Ok(())
    }

    #[napi(setter, js_name = "amount")]
    pub fn set_amount(&mut self, amount: BigIntString) -> Result<(), napi::Error> {
        self.0.set_amount(amount.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "base")]
    pub fn set_base(&mut self, base: &TokenBaseTransitionNAPI) {
        self.0.set_base(base.clone().into())
    }

    #[napi(setter, js_name = "publicNote")]
    pub fn set_public_note(&mut self, note: Option<String>) {
        self.0.set_public_note(note)
    }

    #[napi(setter, js_name = "sharedEncryptedNote")]
    pub fn set_shared_encrypted_note(
        &mut self,
        js_shared_encrypted_note: Option<&SharedEncryptedNoteNAPI>,
    ) {
        let shared_encrypted_note: Option<SharedEncryptedNote> =
            js_shared_encrypted_note.map(|note| note.clone().into());

        self.0.set_shared_encrypted_note(shared_encrypted_note)
    }

    #[napi(setter, js_name = "privateEncryptedNote")]
    pub fn set_private_encrypted_note(
        &mut self,
        js_private_encrypted_note: Option<&PrivateEncryptedNoteNAPI>,
    ) {
        let private_encrypted_note: Option<PrivateEncryptedNote> =
            js_private_encrypted_note.map(|note| note.clone().into());

        self.0.set_private_encrypted_note(private_encrypted_note)
    }
}
