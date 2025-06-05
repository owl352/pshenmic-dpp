use crate::token_transition::TokenTransitionWASM;
use dpp::prelude::IdentityNonce;
use dpp::state_transition::batch_transition::token_base_transition::TokenBaseTransition;
use dpp::state_transition::batch_transition::token_base_transition::v0::TokenBaseTransitionV0;
use pshenmic_dpp_group_state_transition_info::GroupStateTransitionInfoWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::IntoWasm;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=TokenBaseTransitionWASM)]
pub struct TokenBaseTransitionWASM(TokenBaseTransition);

impl From<TokenBaseTransition> for TokenBaseTransitionWASM {
    fn from(t: TokenBaseTransition) -> Self {
        TokenBaseTransitionWASM(t)
    }
}

impl From<TokenBaseTransitionWASM> for TokenBaseTransition {
    fn from(t: TokenBaseTransitionWASM) -> Self {
        t.0
    }
}

#[wasm_bindgen]
impl TokenBaseTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenBaseTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        identity_contract_nonce: IdentityNonce,
        token_contract_position: u16,
        js_data_contract_id: &JsValue,
        js_token_id: &JsValue,
        js_using_group_info: &JsValue,
    ) -> Result<TokenBaseTransitionWASM, JsValue> {
        let using_group_info: Option<GroupStateTransitionInfoWASM> =
            match js_using_group_info.is_undefined() {
                false => Some(
                    js_using_group_info
                        .to_wasm::<GroupStateTransitionInfoWASM>("GroupStateTransitionInfoWASM")?
                        .clone(),
                ),
                true => None,
            };

        Ok(TokenBaseTransitionWASM(TokenBaseTransition::V0(
            TokenBaseTransitionV0 {
                identity_contract_nonce,
                token_contract_position,
                data_contract_id: IdentifierWASM::try_from(js_data_contract_id)?.into(),
                token_id: IdentifierWASM::try_from(js_token_id)?.into(),
                using_group_info: using_group_info.map(|info| info.clone().into()),
            },
        )))
    }
}
