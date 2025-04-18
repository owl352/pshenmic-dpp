use dpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use dpp::state_transition::identity_update_transition::v0::IdentityUpdateTransitionV0;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "IdentityUpdateTransitionWASM")]
pub struct IdentityUpdateTransitionWASM(IdentityUpdateTransition);

#[wasm_bindgen]
impl IdentityUpdateTransitionWASM {
    #[wasm_bindgen(constructor)]
    pub fn new(js_identifier: IdentitiferWASM) -> IdentityUpdateTransitionWASM {
        IdentityUpdateTransitionWASM(
            IdentityUpdateTransition::V0(IdentityUpdateTransitionV0 {
                identity_id: Default::default(),
                revision: 0,
                nonce: 0,
                add_public_keys: vec![],
                disable_public_keys: vec![],
                user_fee_increase: 0,
                signature_public_key_id: 0,
                signature: Default::default(),
            })
        )
    }
}
