use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use drive::query::WhereOperator::{
    Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, Equal, GreaterThan,
    GreaterThanOrEquals, In, LessThan, LessThanOrEquals, StartsWith,
};
use drive::query::{DriveDocumentQuery, InternalClauses, OrderClause, WhereClause};
use drive::verify::RootHash;
use indexmap::IndexMap;
use js_sys::{Array, Uint8Array};
use pshenmic_dpp_data_contract::DataContractWASM;
use pshenmic_dpp_document::DocumentWASM;
use pshenmic_dpp_enums::platform::PlatformVersionWASM;
use pshenmic_dpp_identifier::IdentifierWASM;
use pshenmic_dpp_utils::ToSerdeJSONExt;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name = "VerifiedDocumentsWASM")]
pub struct VerifiedDocumentsWASM {
    root_hash: RootHash,
    documents: Vec<DocumentWASM>,
}

#[wasm_bindgen]
impl VerifiedDocumentsWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "VerifiedDocumentsWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "VerifiedDocumentsWASM".to_string()
    }

    #[wasm_bindgen(getter = "rootHash")]
    pub fn root_hash(&self) -> String {
        let bytes: [u8; 32] = self.root_hash;

        bytes.to_hex_string(Case::Lower)
    }

    #[wasm_bindgen(getter = "documents")]
    pub fn documents(&self) -> Vec<DocumentWASM> {
        self.documents.clone()
    }
}

#[wasm_bindgen(js_name=verifyDocumentsProof)]
pub fn verify_document_proof(
    proof: &Uint8Array,
    contract: &DataContractWASM,
    document_type_name: String,
    js_where_clauses: &JsValue,
    js_order_by: &JsValue,
    limit: Option<u16>,
    js_start_at: &JsValue,
    start_at_included: bool,
    block_time_ms: Option<u64>,
    js_platform_version: JsValue,
) -> Result<VerifiedDocumentsWASM, JsValue> {
    let internal_clauses = match js_where_clauses.is_undefined() | js_order_by.is_null() {
        true => InternalClauses::default(),
        false => parse_query_internal_clause(js_where_clauses)?,
    };

    let start_at_bytes = match js_start_at.is_undefined() |js_start_at.is_null() {
        true => None,
        false => Some(IdentifierWASM::try_from(js_start_at.clone())?.to_slice()),
    };

    let platform_version = match js_platform_version.is_undefined() | js_platform_version.is_null() {
        true => PlatformVersionWASM::default(),
        false => PlatformVersionWASM::try_from(js_platform_version)?,
    };

    let order_by_map = parse_order_by_index_map(js_order_by)?;

    let document_type = contract
        .get_document_type_ref_by_name(document_type_name)
        .map_err(|err| JsValue::from(err.to_string()))?;

    let query = DriveDocumentQuery {
        contract: &contract.clone().into(),
        document_type,
        internal_clauses,
        offset: None,
        limit,
        order_by: order_by_map,
        start_at: start_at_bytes,
        start_at_included,
        block_time_ms,
    };

    let (root_hash, documents) = query
        .verify_proof(&proof.to_vec(), &platform_version.into())
        .map_err(|e| JsValue::from(e.to_string()))?;
    
    let wasm_documents = documents
        .iter()
        .map(|doc| DocumentWASM::from(doc.clone()))
        .collect();

    Ok(VerifiedDocumentsWASM {
        root_hash,
        documents: wasm_documents,
    })
}

fn parse_query_internal_clause(where_clauses: &JsValue) -> Result<InternalClauses, JsValue> {
    let query_clauses_array = Array::from(where_clauses);
    let mut query_where_clauses: Vec<WhereClause> = Vec::new();

    for clause in query_clauses_array.iter() {
        let clause_array = Array::from(&clause.clone());

        let js_field = Array::get(&clause_array, 0);
        let js_operator = Array::get(&clause_array, 1);
        let js_value = Array::get(&clause_array, 2);

        let field = match js_field.as_string() {
            None => Err(JsValue::from(&format!(
                "field is not a string {}",
                where_clauses.as_string().unwrap()
            ))),
            Some(field) => Ok(field),
        }?;

        let value = js_value.with_serde_to_platform_value()?;

        let operator = match js_operator.as_string().as_deref() {
            Some(str) => match str {
                "=" | "==" => Equal,
                ">" => GreaterThan,
                ">=" => GreaterThanOrEquals,
                "<" => LessThan,
                "<=" => LessThanOrEquals,
                "Between" | "between" => Between,
                "BetweenExcludeBounds"
                | "betweenExcludeBounds"
                | "betweenexcludebounds"
                | "between_exclude_bounds" => BetweenExcludeBounds,
                "BetweenExcludeLeft"
                | "betweenExcludeLeft"
                | "betweenexcludeleft"
                | "between_exclude_left" => BetweenExcludeLeft,
                "BetweenExcludeRight"
                | "betweenExcludeRight"
                | "betweenexcluderight"
                | "between_exclude_right" => BetweenExcludeRight,
                "In" | "in" => In,
                "StartsWith" | "startsWith" | "startswith" | "starts_with" => StartsWith,
                _ => Err(JsValue::from(
                    "operator is not a known operator (=, >, >=, <, <=, <=, Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, In, StartsWith)",
                ))?,
            },
            None => Err(JsValue::from("Operator not setted"))?,
        };

        query_where_clauses.push(WhereClause {
            field,
            operator,
            value,
        })
    }

    Ok(InternalClauses::extract_from_clauses(query_where_clauses).map_err(JsError::from)?)
}

fn parse_order_by_index_map(
    js_order_by: &JsValue,
) -> Result<IndexMap<String, OrderClause>, JsValue> {
    let mut order_by_map: IndexMap<String, OrderClause> = IndexMap::new();

    if !(js_order_by.is_undefined() | js_order_by.is_null()) {
        let js_order_by_array = Array::from(&js_order_by);

        for js_order_by_value in js_order_by_array.iter() {
            let js_order_by = Array::from(&js_order_by_value);

            let field = match Array::get(&js_order_by, 0).as_string() {
                Some(field) => Ok(field),
                None => Err(JsValue::from("order field name must be a string")),
            }?;

            let ascending: bool = match Array::get(&js_order_by, 1).as_string() {
                Some(order) => Ok(order.as_str() == "asc"),
                None => Err(JsValue::from(
                    "order sorting direction must be a string (asc, desc)",
                )),
            }?;

            let order_clause = OrderClause {
                field: field.clone(),
                ascending,
            };

            order_by_map.insert(field, order_clause);
        }
    }

    Ok(order_by_map)
}
