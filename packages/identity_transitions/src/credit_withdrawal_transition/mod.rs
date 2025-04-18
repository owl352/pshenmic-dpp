use dpp::state_transition::identity_credit_withdrawal_transition::IdentityCreditWithdrawalTransition;
use dpp::state_transition::identity_credit_withdrawal_transition::v0::IdentityCreditWithdrawalTransitionV0;
use dpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use dpp::state_transition::identity_update_transition::v0::IdentityUpdateTransitionV0;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityCreditWithdrawalTransitionWASM")]
pub struct IdentityCreditWithdrawalTransitionWASM(IdentityCreditWithdrawalTransition);

#[wasm_bindgen]
impl IdentityCreditWithdrawalTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: IdentitiferWASM) -> IdentityCreditWithdrawalTransitionWASM {
        IdentityCreditWithdrawalTransitionWASM(
            IdentityCreditWithdrawalTransition::V0(IdentityCreditWithdrawalTransitionV0 {
                identity_id: Default::default(),
                amount: 0,
                core_fee_per_byte: 0,
                pooling: Default::default(),
                output_script: Default::default(),
                nonce: 0,
                user_fee_increase: 0,
                signature_public_key_id: 0,
                signature: Default::default(),
            })
        )
    }
}
