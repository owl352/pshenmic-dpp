use crate::token_base_transition::TokenBaseTransitionWASM;
use dpp::prelude::Identifier;
use dpp::state_transition::batch_transition::TokenMintTransition;
use dpp::state_transition::batch_transition::token_mint_transition::TokenMintTransitionV0;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Debug, Clone, PartialEq)]
#[wasm_bindgen(js_name=TokenMintTransitionWASM)]
pub struct TokenMintTransitionWASM(TokenMintTransition);

impl From<TokenMintTransition> for TokenMintTransitionWASM {
    fn from(transition: TokenMintTransition) -> Self {
        Self(transition)
    }
}

impl From<TokenMintTransitionWASM> for TokenMintTransition {
    fn from(transition: TokenMintTransitionWASM) -> Self {
        transition.0
    }
}

#[wasm_bindgen]
impl TokenMintTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "TokenMintTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        base: &TokenBaseTransitionWASM,
        js_issued_to_identity_id: &JsValue,
        amount: u64,
        public_note: Option<String>,
    ) -> Result<TokenMintTransitionWASM, JsValue> {
        let issued_to_identity_id: Option<Identifier> =
            match js_issued_to_identity_id.is_undefined() {
                false => Some(IdentifierWASM::try_from(js_issued_to_identity_id)?.into()),
                true => None,
            };

        Ok(TokenMintTransitionWASM(TokenMintTransition::V0(
            TokenMintTransitionV0 {
                base: base.clone().into(),
                issued_to_identity_id,
                amount,
                public_note,
            },
        )))
    }
}
