use dpp::state_transition::identity_topup_transition::IdentityTopUpTransition;
use dpp::state_transition::identity_topup_transition::v0::IdentityTopUpTransitionV0;
use dpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use dpp::state_transition::identity_update_transition::v0::IdentityUpdateTransitionV0;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityTopUpTransitionWASM")]
pub struct IdentityTopUpTransitionWASM(IdentityTopUpTransition);

#[wasm_bindgen]
impl IdentityTopUpTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: IdentitiferWASM) -> IdentityTopUpTransitionWASM {
        IdentityTopUpTransitionWASM(
            IdentityTopUpTransition::V0(IdentityTopUpTransitionV0 {
                asset_lock_proof: Default::default(),
                identity_id: Default::default(),
                user_fee_increase: 0,
                signature: Default::default(),
            })
        )
    }
}
