use crate::token_transitions::config_update::TokenConfigUpdateTransitionWASM;
use crate::token_transitions::direct_purchase::TokenDirectPurchaseTransitionWASM;
use crate::token_transitions::set_price_for_direct_purchase::TokenSetPriceForDirectPurchaseTransitionWASM;
use crate::token_transitions::token_burn::TokenBurnTransitionWASM;
use crate::token_transitions::token_claim::TokenClaimTransitionWASM;
use crate::token_transitions::token_destroy_frozen_funds::TokenDestroyFrozenFundsTransitionWASM;
use crate::token_transitions::token_emergency_action::TokenEmergencyActionTransitionWASM;
use crate::token_transitions::token_freeze::TokenFreezeTransitionWASM;
use crate::token_transitions::token_mint::TokenMintTransitionWASM;
use crate::token_transitions::token_transfer::TokenTransferTransitionWASM;
use crate::token_transitions::token_unfreeze::TokenUnFreezeTransitionWASM;
use dpp::state_transition::batch_transition::batched_transition::token_transition::TokenTransition;
use dpp::state_transition::batch_transition::{
    TokenBurnTransition, TokenClaimTransition, TokenConfigUpdateTransition,
    TokenDestroyFrozenFundsTransition, TokenDirectPurchaseTransition,
    TokenEmergencyActionTransition, TokenFreezeTransition, TokenMintTransition,
    TokenSetPriceForDirectPurchaseTransition, TokenTransferTransition, TokenUnfreezeTransition,
};
use pshenmic_dpp_utils::{IntoWasm, get_class_type};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=TokenTransitionWASM)]
pub struct TokenTransitionWASM(TokenTransition);

impl From<TokenTransition> for TokenTransitionWASM {
    fn from(transition: TokenTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenTransitionWASM> for TokenTransition {
    fn from(transition: TokenTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl TokenTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenTransitionWASM".to_string()
    }
    #[wasm_bindgen(constructor)]
    pub fn new(js_transition: &JsValue) -> Result<TokenTransitionWASM, JsValue> {
        let transition = match js_transition.is_object() {
            true => match get_class_type(js_transition)?.as_str() {
                "TokenMintTransitionWASM" => Ok(TokenTransition::from(TokenMintTransition::from(
                    js_transition
                        .to_wasm::<TokenMintTransitionWASM>("TokenMintTransitionWASM")?
                        .clone(),
                ))),
                "TokenUnFreezeTransitionWASM" => {
                    Ok(TokenTransition::from(TokenUnfreezeTransition::from(
                        js_transition
                            .to_wasm::<TokenUnFreezeTransitionWASM>("TokenUnFreezeTransitionWASM")?
                            .clone(),
                    )))
                }
                "TokenTransferTransitionWASM" => {
                    Ok(TokenTransition::from(TokenTransferTransition::from(
                        js_transition
                            .to_wasm::<TokenTransferTransitionWASM>("TokenTransferTransitionWASM")?
                            .clone(),
                    )))
                }
                "TokenFreezeTransitionWASM" => {
                    Ok(TokenTransition::from(TokenFreezeTransition::from(
                        js_transition
                            .to_wasm::<TokenFreezeTransitionWASM>("TokenFreezeTransitionWASM")?
                            .clone(),
                    )))
                }
                "TokenDestroyFrozenFundsTransitionWASM" => Ok(TokenTransition::from(
                    TokenDestroyFrozenFundsTransition::from(
                        js_transition
                            .to_wasm::<TokenDestroyFrozenFundsTransitionWASM>(
                                "TokenDestroyFrozenFundsTransitionWASM",
                            )?
                            .clone(),
                    ),
                )),
                "TokenClaimTransitionWASM" => {
                    Ok(TokenTransition::from(TokenClaimTransition::from(
                        js_transition
                            .to_wasm::<TokenClaimTransitionWASM>("TokenClaimTransitionWASM")?
                            .clone(),
                    )))
                }
                "TokenBurnTransitionWASM" => Ok(TokenTransition::from(TokenBurnTransition::from(
                    js_transition
                        .to_wasm::<TokenBurnTransitionWASM>("TokenBurnTransitionWASM")?
                        .clone(),
                ))),
                "TokenSetPriceForDirectPurchaseTransitionWASM" => Ok(TokenTransition::from(
                    TokenSetPriceForDirectPurchaseTransition::from(
                        js_transition
                            .to_wasm::<TokenSetPriceForDirectPurchaseTransitionWASM>(
                                "TokenSetPriceForDirectPurchaseTransitionWASM",
                            )?
                            .clone(),
                    ),
                )),
                "TokenDirectPurchaseTransitionWASM" => {
                    Ok(TokenTransition::from(TokenDirectPurchaseTransition::from(
                        js_transition
                            .to_wasm::<TokenDirectPurchaseTransitionWASM>(
                                "TokenDirectPurchaseTransitionWASM",
                            )?
                            .clone(),
                    )))
                }
                "TokenConfigUpdateTransitionWASM" => {
                    Ok(TokenTransition::from(TokenConfigUpdateTransition::from(
                        js_transition
                            .to_wasm::<TokenConfigUpdateTransitionWASM>(
                                "TokenConfigUpdateTransitionWASM",
                            )?
                            .clone(),
                    )))
                }
                "TokenEmergencyActionTransitionWASM" => {
                    Ok(TokenTransition::from(TokenEmergencyActionTransition::from(
                        js_transition
                            .to_wasm::<TokenEmergencyActionTransitionWASM>(
                                "TokenEmergencyActionTransitionWASM",
                            )?
                            .clone(),
                    )))
                }
                _ => Err(JsValue::from("Bad token transition input")),
            },
            false => Err(JsValue::from("Bad token transition input")),
        }?;

        Ok(TokenTransitionWASM(TokenTransition::from(transition)))
    }

    #[wasm_bindgen(js_name = "getTransition")]
    pub fn to_transition(&self) -> JsValue {
        match self.clone().0 {
            TokenTransition::Burn(token_transition) => {
                TokenBurnTransitionWASM::from(token_transition).into()
            }
            TokenTransition::Mint(token_transition) => {
                TokenMintTransitionWASM::from(token_transition).into()
            }
            TokenTransition::Transfer(token_transition) => {
                TokenTransferTransitionWASM::from(token_transition).into()
            }
            TokenTransition::Freeze(token_transition) => {
                TokenFreezeTransitionWASM::from(token_transition).into()
            }
            TokenTransition::Unfreeze(token_transition) => {
                TokenUnFreezeTransitionWASM::from(token_transition).into()
            }
            TokenTransition::DestroyFrozenFunds(token_transition) => {
                TokenDestroyFrozenFundsTransitionWASM::from(token_transition).into()
            }
            TokenTransition::Claim(token_transition) => {
                TokenClaimTransitionWASM::from(token_transition).into()
            }
            TokenTransition::EmergencyAction(token_transition) => {
                TokenEmergencyActionTransitionWASM::from(token_transition).into()
            }
            TokenTransition::ConfigUpdate(token_transition) => {
                TokenConfigUpdateTransitionWASM::from(token_transition).into()
            }
            TokenTransition::DirectPurchase(token_transition) => {
                TokenDirectPurchaseTransitionWASM::from(token_transition).into()
            }
            TokenTransition::SetPriceForDirectPurchase(token_transition) => {
                TokenSetPriceForDirectPurchaseTransitionWASM::from(token_transition).into()
            }
        }
    }

    #[wasm_bindgen(js_name = "getTransitionType")]
    pub fn get_transition_type(&self) -> u8 {
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
}
