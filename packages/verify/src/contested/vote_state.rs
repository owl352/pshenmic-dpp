use crate::contested::contested_document_vote_poll_query_execution_result::ContestedDocumentVotePollQueryExecutionResultWASM;
use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::data_contract::DataContract;
use dpp::platform_value::Value;
use dpp::voting::vote_polls::contested_document_resource_vote_poll::ContestedDocumentResourceVotePoll;
use drive::query::vote_poll_vote_state_query::{
    ContestedDocumentVotePollDriveQuery, ContestedDocumentVotePollDriveQueryResultType,
};
use drive::verify::RootHash;
use js_sys::{Reflect, Uint8Array};
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_enums::contested::vote_state_result_type::VoteStateResultTypeWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "VerifiedVoteStateWASM")]
pub struct VerifiedVoteStateWASM {
    root_hash: RootHash,
    result: ContestedDocumentVotePollQueryExecutionResultWASM,
}

#[wasm_bindgen]
impl VerifiedVoteStateWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedVoteStateWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedVoteStateWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "result")]
    pub fn result(&self) -> ContestedDocumentVotePollQueryExecutionResultWASM {
        self.result.clone()
    }
}

#[wasm_bindgen(js_name = "verifyVotePollVoteStateProof")]
pub fn verify_vote_state_proof(
    proof: &Uint8Array,
    contract: &DataContractWASM,
    document_type_name: &str,
    index_name: &str,
    js_index_values: Vec<Uint8Array>,
    js_result_type: &JsValue,
    allow_include_locked_and_abstaining_vote_tally: bool,
    count: Option<u16>,
    js_start_at: &JsValue,
    js_platform_version: &JsValue,
) -> Result<VerifiedVoteStateWASM, JsValue> {
    let index_values: Vec<Value> = js_index_values
        .iter()
        .map(|js_index_value| {
            let js_index_value_bytes = js_index_value.to_vec();

            let value_type = js_index_value_bytes.get(0).unwrap();
            let _value_len = js_index_value_bytes.get(0).unwrap();

            if *value_type != 0x12 {
                return Err(JsValue::from("can be used only string type (0x12)"));
            }

            let (_, value_bytes) = js_index_value_bytes.split_at(2);

            let value = core::str::from_utf8(value_bytes).unwrap();

            Ok(Value::Text(value.to_string()))
        })
        .collect::<Result<Vec<Value>, JsValue>>()?;

    let result_type = match VoteStateResultTypeWASM::try_from(js_result_type.clone())? {
        VoteStateResultTypeWASM::Documents => {
            ContestedDocumentVotePollDriveQueryResultType::Documents
        }
        VoteStateResultTypeWASM::VoteTally => {
            ContestedDocumentVotePollDriveQueryResultType::VoteTally
        }
        VoteStateResultTypeWASM::DocumentsAndVoteTally => {
            ContestedDocumentVotePollDriveQueryResultType::DocumentsAndVoteTally
        }
    };

    let start_at: Option<([u8; 32], bool)> = match js_start_at.is_object() {
        false => None,
        true => {
            let start_identifier =
                Reflect::get(&js_start_at, &JsValue::from_str("startIdentifier"))?;
            let start_identifier_included =
                Reflect::get(&js_start_at, &JsValue::from_str("startIdentifierIncluded"))?
                    .as_bool()
                    .unwrap();

            Some((
                IdentifierWASM::try_from(start_identifier)?.to_slice(),
                start_identifier_included,
            ))
        }
    };

    let platform_version = PlatformVersionWASM::try_from(js_platform_version.clone())?;

    let query = ContestedDocumentVotePollDriveQuery {
        vote_poll: ContestedDocumentResourceVotePoll {
            contract_id: contract.get_id().into(),
            document_type_name: document_type_name.to_string(),
            index_name: index_name.to_string(),
            index_values,
        },
        result_type,
        offset: None,
        limit: count,
        start_at,
        allow_include_locked_and_abstaining_vote_tally,
    };

    // need to increase lifetime before he is dropped
    let rs_contract: DataContract = contract.clone().into();

    let resolved_query = query
        .resolve_with_provided_borrowed_contract(&rs_contract)
        .map_err(|e| JsValue::from(e.to_string()))?;

    let (root_hash, execution_result) = resolved_query
        .verify_vote_poll_vote_state_proof(&proof.to_vec(), &platform_version.into())
        .map_err(|e| JsValue::from(e.to_string()))?;

    Ok(VerifiedVoteStateWASM {
        root_hash,
        result: execution_result.into(),
    })
}
