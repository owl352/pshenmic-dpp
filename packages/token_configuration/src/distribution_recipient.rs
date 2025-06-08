use dpp::data_contract::associated_token::token_perpetual_distribution::distribution_recipient::TokenDistributionRecipient;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone, Debug, PartialEq)]
#[wasm_bindgen(js_name = "TokenDistributionRecipientWASM")]
pub struct TokenDistributionRecipientWASM(TokenDistributionRecipient);

impl From<TokenDistributionRecipient> for TokenDistributionRecipientWASM {
    fn from(distribution_recipient: TokenDistributionRecipient) -> Self {
        TokenDistributionRecipientWASM(distribution_recipient)
    }
}

impl From<TokenDistributionRecipientWASM> for TokenDistributionRecipient {
    fn from(distribution_recipient: TokenDistributionRecipientWASM) -> Self {
        distribution_recipient.0
    }
}

#[wasm_bindgen]
impl TokenDistributionRecipientWASM {
    #[wasm_bindgen(js_name = "ContractOwner")]
    pub fn contract_owner() -> TokenDistributionRecipientWASM {
        TokenDistributionRecipientWASM(TokenDistributionRecipient::ContractOwner)
    }

    #[wasm_bindgen(js_name = "Identity")]
    pub fn identity(js_identity_id: &JsValue) -> Result<TokenDistributionRecipientWASM, JsValue> {
        let identity_id = IdentifierWASM::try_from(js_identity_id)?;

        Ok(TokenDistributionRecipientWASM(
            TokenDistributionRecipient::Identity(identity_id.into()),
        ))
    }

    #[wasm_bindgen(js_name = "EvonodesByParticipation")]
    pub fn evonodes_by_participation() -> TokenDistributionRecipientWASM {
        TokenDistributionRecipientWASM(TokenDistributionRecipient::EvonodesByParticipation)
    }

    #[wasm_bindgen(getter = "value")]
    pub fn get_value(&self) -> JsValue {
        match self.0 {
            TokenDistributionRecipient::EvonodesByParticipation => {
                String::from("EvonodesByParticipation").into()
            }
            TokenDistributionRecipient::ContractOwner => String::from("ContractOwner").into(),
            TokenDistributionRecipient::Identity(identifier) => {
                IdentifierWASM::from(identifier).into()
            }
        }
    }
}
