use crate::verify_contested::contender_with_serialized_document::ContenderWithSerializedDocumentWASM;
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
                        Reflect::set(&winner, &"type".into(), &"NoWinner".into())
                            .map_err(|_| JsValue::from_str("Failed to set winner type"))?;
                    }
                    ContestedDocumentVotePollWinnerInfo::Locked => {
                        Reflect::set(&winner, &"type".into(), &"Locked".into())
                            .map_err(|_| JsValue::from_str("Failed to set winner type"))?;
                    }
                    ContestedDocumentVotePollWinnerInfo::WonByIdentity(winner_id) => {
                        Reflect::set(&winner, &"type".into(), &"WonByIdentity".into())
                            .map_err(|_| JsValue::from_str("Failed to set winner type"))?;

                        let id_array = Uint8Array::from(winner_id.as_slice());
                        Reflect::set(&winner, &"identityId".into(), &id_array)
                            .map_err(|_| JsValue::from_str("Failed to set winner identity"))?;
                    }
                }

                let block_info = winner_info.1.clone();

                let block_info_obj = Object::new();
                Reflect::set(&block_info_obj, &"height".into(), &block_info.height.into())
                    .map_err(|_| JsValue::from_str("Failed to set block height"))?;
                Reflect::set(
                    &block_info_obj,
                    &"coreHeight".into(),
                    &block_info.core_height.into(),
                )
                .map_err(|_| JsValue::from_str("Failed to set core height"))?;
                Reflect::set(
                    &block_info_obj,
                    &"timeMs".into(),
                    &block_info.time_ms.into(),
                )
                .map_err(|_| JsValue::from_str("Failed to set time ms"))?;

                Reflect::set(
                    &block_info_obj,
                    &"epoch".into(),
                    &block_info.epoch.index.into(),
                )
                .map_err(|_| JsValue::from_str("Failed to set epoch"))?;

                Reflect::set(&winner, &"blockInfo".into(), &block_info_obj)
                    .map_err(|_| JsValue::from_str("Failed to set block info"))?;

                Ok(winner.into())
            }
        }
    }

    #[wasm_bindgen(getter = "skipped")]
    pub fn skipped(&self) -> u16 {
        self.0.skipped
    }
}
