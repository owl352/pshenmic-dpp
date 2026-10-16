use dpp::state_transition::batch_transition::batched_transition::token_transition::{
    TokenTransition, TokenTransitionV0Methods,
};
use dpp::state_transition::batch_transition::{
    TokenBurnFromPoolTransition, TokenBurnTransition, TokenClaimToPoolTransition,
    TokenClaimTransition, TokenConfigUpdateTransition, TokenDestroyFrozenFundsTransition,
    TokenDirectPurchaseToPoolTransition, TokenDirectPurchaseTransition,
    TokenEmergencyActionTransition, TokenFreezeTransition, TokenMintToPoolTransition,
    TokenMintTransition, TokenSetPriceForDirectPurchaseTransition, TokenShieldTransition,
    TokenShieldedTransferTransition, TokenTransferTransition, TokenUnfreezeTransition,
    TokenUnshieldTransition,
};
use napi::bindgen_prelude::Either18;
use napi_derive::napi;

use crate::batch::token_transition::transitions::config_update::TokenConfigUpdateTransitionNAPI;
use crate::batch::token_transition::transitions::direct_purchase::TokenDirectPurchaseTransitionNAPI;
use crate::batch::token_transition::transitions::set_price_for_direct_purchase::TokenSetPriceForDirectPurchaseTransitionNAPI;
use crate::batch::token_transition::transitions::token_burn::TokenBurnTransitionNAPI;
use crate::batch::token_transition::transitions::token_burn_from_pool::TokenBurnFromPoolTransitionNAPI;
use crate::batch::token_transition::transitions::token_claim::TokenClaimTransitionNAPI;
use crate::batch::token_transition::transitions::token_claim_to_pool::TokenClaimToPoolTransitionNAPI;
use crate::batch::token_transition::transitions::token_destroy_frozen_funds::TokenDestroyFrozenFundsTransitionNAPI;
use crate::batch::token_transition::transitions::token_direct_purchase_to_pool::TokenDirectPurchaseToPoolTransitionNAPI;
use crate::batch::token_transition::transitions::token_emergency_action::TokenEmergencyActionTransitionNAPI;
use crate::batch::token_transition::transitions::token_freeze::TokenFreezeTransitionNAPI;
use crate::batch::token_transition::transitions::token_mint::TokenMintTransitionNAPI;
use crate::batch::token_transition::transitions::token_mint_to_pool::TokenMintToPoolTransitionNAPI;
use crate::batch::token_transition::transitions::token_shield::TokenShieldTransitionNAPI;
use crate::batch::token_transition::transitions::token_shielded_transfer::TokenShieldedTransferTransitionNAPI;
use crate::batch::token_transition::transitions::token_transfer::TokenTransferTransitionNAPI;
use crate::batch::token_transition::transitions::token_unfreeze::TokenUnFreezeTransitionNAPI;
use crate::batch::token_transition::transitions::token_unshield::TokenUnshieldTransitionNAPI;
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
        js_transition: Either18<
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
            &TokenShieldTransitionNAPI,
            &TokenUnshieldTransitionNAPI,
            &TokenShieldedTransferTransitionNAPI,
            &TokenMintToPoolTransitionNAPI,
            &TokenBurnFromPoolTransitionNAPI,
            &TokenClaimToPoolTransitionNAPI,
            &TokenDirectPurchaseToPoolTransitionNAPI,
        >,
    ) -> TokenTransitionNAPI {
        let transition = match js_transition {
            Either18::A(tx) => TokenTransition::from(TokenConfigUpdateTransition::from(tx.clone())),
            Either18::B(tx) => {
                TokenTransition::from(TokenDirectPurchaseTransition::from(tx.clone()))
            }
            Either18::C(tx) => {
                TokenTransition::from(TokenSetPriceForDirectPurchaseTransition::from(tx.clone()))
            }
            Either18::D(tx) => TokenTransition::from(TokenBurnTransition::from(tx.clone())),
            Either18::E(tx) => TokenTransition::from(TokenClaimTransition::from(tx.clone())),
            Either18::F(tx) => {
                TokenTransition::from(TokenDestroyFrozenFundsTransition::from(tx.clone()))
            }
            Either18::G(tx) => {
                TokenTransition::from(TokenEmergencyActionTransition::from(tx.clone()))
            }
            Either18::H(tx) => TokenTransition::from(TokenFreezeTransition::from(tx.clone())),
            Either18::I(tx) => TokenTransition::from(TokenMintTransition::from(tx.clone())),
            Either18::J(tx) => TokenTransition::from(TokenTransferTransition::from(tx.clone())),
            Either18::K(tx) => TokenTransition::from(TokenUnfreezeTransition::from(tx.clone())),
            Either18::L(tx) => TokenTransition::from(TokenShieldTransition::from(tx.clone())),
            Either18::M(tx) => TokenTransition::from(TokenUnshieldTransition::from(tx.clone())),
            Either18::N(tx) => {
                TokenTransition::from(TokenShieldedTransferTransition::from(tx.clone()))
            }
            Either18::O(tx) => TokenTransition::from(TokenMintToPoolTransition::from(tx.clone())),
            Either18::P(tx) => TokenTransition::from(TokenBurnFromPoolTransition::from(tx.clone())),
            Either18::Q(tx) => TokenTransition::from(TokenClaimToPoolTransition::from(tx.clone())),
            Either18::R(tx) => {
                TokenTransition::from(TokenDirectPurchaseToPoolTransition::from(tx.clone()))
            }
        };

        TokenTransitionNAPI(transition)
    }

    #[napi(js_name = "getTransition")]
    pub fn to_transition(
        &self,
    ) -> Result<
        Either18<
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
            TokenShieldTransitionNAPI,
            TokenUnshieldTransitionNAPI,
            TokenShieldedTransferTransitionNAPI,
            TokenMintToPoolTransitionNAPI,
            TokenBurnFromPoolTransitionNAPI,
            TokenClaimToPoolTransitionNAPI,
            TokenDirectPurchaseToPoolTransitionNAPI,
        >,
        napi::Error,
    > {
        let transition = match self.clone().0 {
            TokenTransition::ConfigUpdate(token_transition) => {
                Either18::A(TokenConfigUpdateTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::DirectPurchase(token_transition) => {
                Either18::B(TokenDirectPurchaseTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::SetPriceForDirectPurchase(token_transition) => Either18::C(
                TokenSetPriceForDirectPurchaseTransitionNAPI::from(token_transition).into(),
            ),
            TokenTransition::Burn(token_transition) => {
                Either18::D(TokenBurnTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Claim(token_transition) => {
                Either18::E(TokenClaimTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::DestroyFrozenFunds(token_transition) => {
                Either18::F(TokenDestroyFrozenFundsTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::EmergencyAction(token_transition) => {
                Either18::G(TokenEmergencyActionTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Freeze(token_transition) => {
                Either18::H(TokenFreezeTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Mint(token_transition) => {
                Either18::I(TokenMintTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Transfer(token_transition) => {
                Either18::J(TokenTransferTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Unfreeze(token_transition) => {
                Either18::K(TokenUnFreezeTransitionNAPI::from(token_transition).into())
            }
            TokenTransition::Shield(token_transition) => {
                Either18::L(TokenShieldTransitionNAPI::from(token_transition))
            }
            TokenTransition::Unshield(token_transition) => {
                Either18::M(TokenUnshieldTransitionNAPI::from(token_transition))
            }
            TokenTransition::ShieldedTransfer(token_transition) => {
                Either18::N(TokenShieldedTransferTransitionNAPI::from(token_transition))
            }
            TokenTransition::MintToPool(token_transition) => {
                Either18::O(TokenMintToPoolTransitionNAPI::from(token_transition))
            }
            TokenTransition::BurnFromPool(token_transition) => {
                Either18::P(TokenBurnFromPoolTransitionNAPI::from(token_transition))
            }
            TokenTransition::ClaimToPool(token_transition) => {
                Either18::Q(TokenClaimToPoolTransitionNAPI::from(token_transition))
            }
            TokenTransition::DirectPurchaseToPool(token_transition) => Either18::R(
                TokenDirectPurchaseToPoolTransitionNAPI::from(token_transition),
            ),
        };

        Ok(transition)
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
            TokenTransition::Shield(_) => 11,
            TokenTransition::Unshield(_) => 12,
            TokenTransition::ShieldedTransfer(_) => 13,
            TokenTransition::MintToPool(_) => 14,
            TokenTransition::BurnFromPool(_) => 15,
            TokenTransition::ClaimToPool(_) => 16,
            TokenTransition::DirectPurchaseToPool(_) => 17,
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
            TokenTransition::Shield(_) => "Shield".to_string(),
            TokenTransition::Unshield(_) => "Unshield".to_string(),
            TokenTransition::ShieldedTransfer(_) => "ShieldedTransfer".to_string(),
            TokenTransition::MintToPool(_) => "MintToPool".to_string(),
            TokenTransition::BurnFromPool(_) => "BurnFromPool".to_string(),
            TokenTransition::ClaimToPool(_) => "ClaimToPool".to_string(),
            TokenTransition::DirectPurchaseToPool(_) => "DirectPurchaseToPool".to_string(),
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
