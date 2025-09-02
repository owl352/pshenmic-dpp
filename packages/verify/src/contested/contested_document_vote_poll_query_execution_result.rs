use crate::contested::contender_with_serialized_document::ContenderWithSerializedDocumentWASM;
use dpp::voting::vote_info_storage::contested_document_vote_poll_winner_info::ContestedDocumentVotePollWinnerInfo;
use drive::query::vote_poll_vote_state_query::ContestedDocumentVotePollDriveQueryExecutionResult;
use js_sys::{Object, Reflect, Uint8Array};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "ContestedDocumentVotePollQueryExecutionResultWASM")]
pub struct ContestedDocumentVotePollQueryExecutionResultWASM(
    ContestedDocumentVotePollDriveQueryExecutionResult,
);

impl From<ContestedDocumentVotePollDriveQueryExecutionResult>
    for ContestedDocumentVotePollQueryExecutionResultWASM
{
    fn from(contract: ContestedDocumentVotePollDriveQueryExecutionResult) -> Self {
        ContestedDocumentVotePollQueryExecutionResultWASM(contract)
    }
}

#[wasm_bindgen]
impl ContestedDocumentVotePollQueryExecutionResultWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "ContestedDocumentVotePollQueryExecutionResultWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "ContestedDocumentVotePollQueryExecutionResultWASM".to_string()
    }

    #[wasm_bindgen(getter = "contenders")]
    pub fn contenders(&self) -> Vec<ContenderWithSerializedDocumentWASM> {
        self.0
            .contenders
            .iter()
            .map(|contender| contender.clone().into())
            .collect()
    }

    #[wasm_bindgen(getter = "lockedVoteTally")]
    pub fn locked_vote_tally(&self) -> Option<u32> {
        self.0.locked_vote_tally
    }

    #[wasm_bindgen(getter = "abstainingVoteTally")]
    pub fn abstaining_vote_tally(&self) -> Option<u32> {
        self.0.abstaining_vote_tally
    }

    #[wasm_bindgen(getter = "winner")]
    pub fn winner(&self) -> Result<JsValue, JsValue> {
        match self.0.winner {
            None => Ok(JsValue::UNDEFINED),
            Some(winner_info) => {
                let winner = Object::new();

                match winner_info.0 {
                    ContestedDocumentVotePollWinnerInfo::NoWinner => {
                        Reflect::set(
                            &winner,
                            &JsValue::from_str("type"),
                            &JsValue::from_str("NoWinner"),
                        )
                        .map_err(|_| JsValue::from_str("Failed to set winner type"))?;
                    }
                    ContestedDocumentVotePollWinnerInfo::Locked => {
                        Reflect::set(
                            &winner,
                            &JsValue::from_str("type"),
                            &JsValue::from_str("Locked"),
                        )
                        .map_err(|_| JsValue::from_str("Failed to set winner type"))?;
                    }
                    ContestedDocumentVotePollWinnerInfo::WonByIdentity(winner_id) => {
                        Reflect::set(
                            &winner,
                            &JsValue::from_str("type"),
                            &JsValue::from_str("WonByIdentity"),
                        )
                        .map_err(|_| JsValue::from_str("Failed to set winner type"))?;

                        let id_array = Uint8Array::from(winner_id.as_slice());
                        Reflect::set(&winner, &JsValue::from_str("identityId"), &id_array)
                            .map_err(|_| JsValue::from_str("Failed to set winner identity"))?;
                    }
                }

                let block_info = winner_info.1.clone();

                let block_info_obj = Object::new();
                Reflect::set(
                    &block_info_obj,
                    &JsValue::from_str("height"),
                    &JsValue::from_f64(block_info.height as f64),
                )
                .map_err(|_| JsValue::from_str("Failed to set block height"))?;
                Reflect::set(
                    &block_info_obj,
                    &JsValue::from_str("coreHeight"),
                    &JsValue::from(block_info.core_height),
                )
                .map_err(|_| JsValue::from_str("Failed to set core height"))?;
                Reflect::set(
                    &block_info_obj,
                    &JsValue::from_str("timeMs"),
                    &JsValue::from_f64(block_info.time_ms as f64),
                )
                .map_err(|_| JsValue::from_str("Failed to set time ms"))?;

                Reflect::set(
                    &block_info_obj,
                    &JsValue::from_str("epoch"),
                    &JsValue::from(block_info.epoch.index),
                )
                .map_err(|_| JsValue::from_str("Failed to set epoch"))?;

                Reflect::set(&winner, &JsValue::from_str("blockInfo"), &block_info_obj)
                    .map_err(|_| JsValue::from_str("Failed to set block info"))?;

                Ok(JsValue::from(winner))
            }
        }
    }

    #[wasm_bindgen(getter = "skipped")]
    pub fn skipped(&self) -> u16 {
        self.0.skipped
    }
}
