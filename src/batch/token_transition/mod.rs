use dpp::state_transition::batch_transition::batched_transition::token_transition::{
    TokenTransition, TokenTransitionV0Methods,
};
use dpp::state_transition::batch_transition::{
    TokenBurnTransition, TokenClaimTransition, TokenConfigUpdateTransition,
    TokenDestroyFrozenFundsTransition, TokenDirectPurchaseTransition,
    TokenEmergencyActionTransition, TokenFreezeTransition, TokenMintTransition,
    TokenSetPriceForDirectPurchaseTransition, TokenTransferTransition, TokenUnfreezeTransition,
};
use napi::bindgen_prelude::Either11;
use napi_derive::napi;

use crate::batch::token_transition::transitions::config_update::TokenConfigUpdateTransitionNAPI;
use crate::batch::token_transition::transitions::direct_purchase::TokenDirectPurchaseTransitionNAPI;
use crate::batch::token_transition::transitions::set_price_for_direct_purchase::TokenSetPriceForDirectPurchaseTransitionNAPI;
use crate::batch::token_transition::transitions::token_burn::TokenBurnTransitionNAPI;
use crate::batch::token_transition::transitions::token_claim::TokenClaimTransitionNAPI;
use crate::batch::token_transition::transitions::token_destroy_frozen_funds::TokenDestroyFrozenFundsTransitionNAPI;
use crate::batch::token_transition::transitions::token_emergency_action::TokenEmergencyActionTransitionNAPI;
use crate::batch::token_transition::transitions::token_freeze::TokenFreezeTransitionNAPI;
use crate::batch::token_transition::transitions::token_mint::TokenMintTransitionNAPI;
use crate::batch::token_transition::transitions::token_transfer::TokenTransferTransitionNAPI;
use crate::batch::token_transition::transitions::token_unfreeze::TokenUnFreezeTransitionNAPI;
use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;

pub mod transitions;

#[derive(Debug, Clone, PartialEq)]
#[napi(js_name = "TokenTransitionNAPI")]
pub struct TokenTransitionNAPI(TokenTransition);

impl From<TokenTransition> for TokenTransitionNAPI {
    fn from(transition: TokenTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenTransitionNAPI> for TokenTransition {
    fn from(transition: TokenTransitionNAPI) -> Self {
        transition.0
    }
}

#[napi]
impl TokenTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_transition: Either11<
            &TokenConfigUpdateTransitionNAPI,
            &TokenDirectPurchaseTransitionNAPI,
            &TokenSetPriceForDirectPurchaseTransitionNAPI,
            &TokenBurnTransitionNAPI,
            &TokenClaimTransitionNAPI,
            &TokenDestroyFrozenFundsTransitionNAPI,
            &TokenEmergencyActionTransitionNAPI,
            &TokenFreezeTransitionNAPI,
            &TokenMintTransitionNAPI,
            &TokenTransferTransitionNAPI,
            &TokenUnFreezeTransitionNAPI,
        >,
    ) -> TokenTransitionNAPI {
        let transition = match js_transition {
            Either11::A(tx) => TokenTransition::from(TokenConfigUpdateTransition::from(tx.clone())),
            Either11::B(tx) => {
                TokenTransition::from(TokenDirectPurchaseTransition::from(tx.clone()))
            }
            Either11::C(tx) => {
                TokenTransition::from(TokenSetPriceForDirectPurchaseTransition::from(tx.clone()))
            }
            Either11::D(tx) => TokenTransition::from(TokenBurnTransition::from(tx.clone())),
            Either11::E(tx) => TokenTransition::from(TokenClaimTransition::from(tx.clone())),
            Either11::F(tx) => {
                TokenTransition::from(TokenDestroyFrozenFundsTransition::from(tx.clone()))
            }
            Either11::G(tx) => {
                TokenTransition::from(TokenEmergencyActionTransition::from(tx.clone()))
            }
            Either11::H(tx) => TokenTransition::from(TokenFreezeTransition::from(tx.clone())),
            Either11::I(tx) => TokenTransition::from(TokenMintTransition::from(tx.clone())),
            Either11::J(tx) => TokenTransition::from(TokenTransferTransition::from(tx.clone())),
            Either11::K(tx) => TokenTransition::from(TokenUnfreezeTransition::from(tx.clone())),
        };

        TokenTransitionNAPI(transition)
    }

    #[napi(js_name = "getTransition")]
    pub fn to_transition(
        &self,
    ) -> Either11<
        TokenConfigUpdateTransitionNAPI,
        TokenDirectPurchaseTransitionNAPI,
        TokenSetPriceForDirectPurchaseTransitionNAPI,
        TokenBurnTransitionNAPI,
        TokenClaimTransitionNAPI,
        TokenDestroyFrozenFundsTransitionNAPI,
        TokenEmergencyActionTransitionNAPI,
        TokenFreezeTransitionNAPI,
        TokenMintTransitionNAPI,
        TokenTransferTransitionNAPI,
        TokenUnFreezeTransitionNAPI,
    > {
        match self.clone().0 {
            TokenTransition::ConfigUpdate(token_transition) => {
                Either11::A(TokenConfigUpdateTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::DirectPurchase(token_transition) => {
                Either11::B(TokenDirectPurchaseTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::SetPriceForDirectPurchase(token_transition) => Either11::C(
                TokenSetPriceForDirectPurchaseTransitionNAPI::from(token_transition).into(),
            ),
            TokenTransition::Burn(token_transition) => {
                Either11::D(TokenBurnTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Claim(token_transition) => {
                Either11::E(TokenClaimTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::DestroyFrozenFunds(token_transition) => {
                Either11::F(TokenDestroyFrozenFundsTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::EmergencyAction(token_transition) => {
                Either11::G(TokenEmergencyActionTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Freeze(token_transition) => {
                Either11::H(TokenFreezeTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Mint(token_transition) => {
                Either11::I(TokenMintTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Transfer(token_transition) => {
                Either11::J(TokenTransferTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Unfreeze(token_transition) => {
                Either11::K(TokenUnFreezeTransitionNAPI::from(token_transition).into())
            }
        }
    }

    #[napi(js_name = "getTransitionTypeNumber")]
    pub fn get_transition_type_number(&self) -> u8 {
        match self.clone().0 {
            TokenTransition::Burn(_) => 0,
            TokenTransition::Mint(_) => 1,
            TokenTransition::Transfer(_) => 2,
            TokenTransition::Freeze(_) => 3,
            TokenTransition::Unfreeze(_) => 4,
            TokenTransition::DestroyFrozenFunds(_) => 5,
            TokenTransition::Claim(_) => 6,
            TokenTransition::EmergencyAction(_) => 7,
            TokenTransition::ConfigUpdate(_) => 8,
            TokenTransition::DirectPurchase(_) => 9,
            TokenTransition::SetPriceForDirectPurchase(_) => 10,
        }
    }

    #[napi(js_name = "getTransitionType")]
    pub fn get_transition_type(&self) -> String {
        match self.clone().0 {
            TokenTransition::Burn(_) => "Burn".to_string(),
            TokenTransition::Mint(_) => "Mint".to_string(),
            TokenTransition::Transfer(_) => "Transfer".to_string(),
            TokenTransition::Freeze(_) => "Freeze".to_string(),
            TokenTransition::Unfreeze(_) => "Unfreeze".to_string(),
            TokenTransition::DestroyFrozenFunds(_) => "DestroyFrozenFunds".to_string(),
            TokenTransition::Claim(_) => "Claim".to_string(),
            TokenTransition::EmergencyAction(_) => "EmergencyAction".to_string(),
            TokenTransition::ConfigUpdate(_) => "ConfigUpdate".to_string(),
            TokenTransition::DirectPurchase(_) => "DirectPurchase".to_string(),
            TokenTransition::SetPriceForDirectPurchase(_) => {
                "SetPriceForDirectPurchase".to_string()
            }
        }
    }

    #[napi(js_name = "getHistoricalDocumentTypeName")]
    pub fn get_historical_document_type_name(&self) -> String {
        self.0.historical_document_type_name().to_string()
    }

    #[napi(js_name = "getHistoricalDocumentId")]
    pub fn get_historical_document_id(
        &self,
        js_owner: IdentifierLikeNAPI,
    ) -> Result<IdentifierNAPI, napi::Error> {
        let owner = IdentifierNAPI::try_from(js_owner)?;
        Ok(self.0.historical_document_id(owner.into()).into())
    }

    #[napi(getter, js_name = "identityContractNonce")]
    pub fn get_identity_contract_nonce(&self) -> BigIntString {
        BigIntString::from_u64(self.0.identity_contract_nonce())
    }

    #[napi(getter, js_name = "tokenId")]
    pub fn get_token_id(&self) -> IdentifierNAPI {
        self.0.token_id().into()
    }

    #[napi(getter, js_name = "contractId")]
    pub fn get_contract_id(&self) -> IdentifierNAPI {
        self.0.data_contract_id().into()
    }

    #[napi(setter, js_name = "identityContractNonce")]
    pub fn set_identity_contract_nonce(&mut self, nonce: BigIntString) -> Result<(), napi::Error> {
        self.0.set_identity_contract_nonce(nonce.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "tokenId")]
    pub fn set_token_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let id = IdentifierNAPI::try_from(js_id)?;

        self.0.set_token_id(id.into());

        Ok(())
    }

    #[napi(setter, js_name = "contractId")]
    pub fn set_contract_id(&mut self, js_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let id = IdentifierNAPI::try_from(js_id)?;

        self.0.set_data_contract_id(id.into());

        Ok(())
    }
}
