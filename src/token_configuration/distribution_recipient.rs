use dpp::data_contract::associated_token::token_perpetual_distribution::distribution_recipient::TokenDistributionRecipient;
use napi::{Either, bindgen_prelude::Undefined};
use napi_derive::napi;

use crate::{dynamic_value::IdentifierLikeNAPI, identifier::IdentifierNAPI};

#[derive(Clone, Debug, PartialEq)]
#[napi(js_name = "TokenDistributionRecipientNAPI")]
pub struct TokenDistributionRecipientNAPI(TokenDistributionRecipient);

impl From<TokenDistributionRecipient> for TokenDistributionRecipientNAPI {
    fn from(distribution_recipient: TokenDistributionRecipient) -> Self {
        TokenDistributionRecipientNAPI(distribution_recipient)
    }
}

impl From<TokenDistributionRecipientNAPI> for TokenDistributionRecipient {
    fn from(distribution_recipient: TokenDistributionRecipientNAPI) -> Self {
        distribution_recipient.0
    }
}

#[napi]
impl TokenDistributionRecipientNAPI {
    #[napi(js_name = "ContractOwner")]
    pub fn contract_owner() -> TokenDistributionRecipientNAPI {
        TokenDistributionRecipientNAPI(TokenDistributionRecipient::ContractOwner)
    }

    #[napi(js_name = "Identity")]
    pub fn identity(
        js_identity_id: IdentifierLikeNAPI,
    ) -> Result<TokenDistributionRecipientNAPI, napi::Error> {
        let identity_id = IdentifierNAPI::try_from(js_identity_id)?;

        Ok(TokenDistributionRecipientNAPI(
            TokenDistributionRecipient::Identity(identity_id.into()),
        ))
    }

    #[napi(js_name = "EvonodesByParticipation")]
    pub fn evonodes_by_participation() -> TokenDistributionRecipientNAPI {
        TokenDistributionRecipientNAPI(TokenDistributionRecipient::EvonodesByParticipation)
    }

    #[napi(js_name = "getType")]
    pub fn get_type(&self) -> String {
        match self.0 {
            TokenDistributionRecipient::EvonodesByParticipation => {
                String::from("EvonodesByParticipation")
            }
            TokenDistributionRecipient::ContractOwner => String::from("ContractOwner"),
            TokenDistributionRecipient::Identity(identity) => String::from(format!(
                "Identity({})",
                IdentifierNAPI::from(identity).base58()
            )),
        }
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> Either<IdentifierNAPI, Undefined> {
        match self.0 {
            TokenDistributionRecipient::EvonodesByParticipation => Either::B(()),
            TokenDistributionRecipient::ContractOwner => Either::B(()),
            TokenDistributionRecipient::Identity(identifier) => Either::A(identifier.into()),
        }
    }
}
