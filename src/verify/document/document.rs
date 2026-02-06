use dpp::platform_value::Value;
use drive::query::WhereOperator::{
    Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, Equal, GreaterThan,
    GreaterThanOrEquals, In, LessThan, LessThanOrEquals, StartsWith,
};
use drive::query::{DriveDocumentQuery, InternalClauses, OrderClause, WhereClause};
use indexmap::IndexMap;
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI, TryToU64, Uint64String};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;

#[napi(js_name = "VerifiedDocumentsNAPI")]
pub struct VerifiedDocumentsNAPI {
    pub root_hash: Uint8Array,
    documents: Vec<DocumentNAPI>,
}

#[napi]
impl VerifiedDocumentsNAPI {
    #[napi(getter, js_name = "documents")]
    pub fn documents(&self) -> Vec<DocumentNAPI> {
        self.documents.clone()
    }

    #[napi(setter, js_name = "documents")]
    pub fn set_documents(&mut self, documents: Vec<&DocumentNAPI>) {
        self.documents = documents.into_iter().map(|doc| doc.clone()).collect()
    }
}

#[napi(js_name=verifyDocumentsProof)]
pub fn verify_document_proof(
    proof: Uint8Array,
    contract: &DataContractNAPI,
    document_type_name: String,
    js_where_clauses: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    limit: Option<u16>,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
    block_time_ms: Option<Uint64String>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedDocumentsNAPI, napi::Error> {
    let internal_clauses = match js_where_clauses.is_undefined_or_null() {
        true => InternalClauses::default(),
        false => parse_query_internal_clause(js_where_clauses)?,
    };

    let start_at_bytes = match js_start_at {
        Some(start_at) => Some(IdentifierNAPI::try_from(start_at)?.to_slice()),
        None => None,
    };

    let platform_version = match js_platform_version.is_undefined() | js_platform_version.is_null()
    {
        true => PlatformVersionNAPI::default(),
        false => PlatformVersionNAPI::try_from(js_platform_version)?,
    };

    let order_by_map = parse_order_by_index_map(js_order_by)?;

    let document_type = contract
        .get_document_type_ref_by_name(document_type_name)
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

    let query = DriveDocumentQuery {
        contract: &contract.clone().into(),
        document_type,
        internal_clauses,
        offset: None,
        limit,
        order_by: order_by_map,
        start_at: start_at_bytes,
        start_at_included,
        block_time_ms: block_time_ms.map(|ms| ms.try_to_u64()).transpose()?,
    };

    let (root_hash, documents) = query
        .verify_proof(&proof.to_vec(), &platform_version.into())
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

    let wasm_documents = documents
        .iter()
        .map(|doc| {
            let mut doc_js = DocumentNAPI::from(doc.clone());

            doc_js.set_js_data_contract_id(Either::A(&contract.get_id().clone()))?;

            Ok::<DocumentNAPI, napi::Error>(doc_js)
        })
        .collect::<Result<Vec<DocumentNAPI>, napi::Error>>()?;

    Ok(VerifiedDocumentsNAPI {
        root_hash: root_hash.into(),
        documents: wasm_documents,
    })
}

fn parse_query_internal_clause(
    where_clauses: &DynamicValue,
) -> Result<InternalClauses, napi::Error> {
    let mut query_where_clauses: Vec<WhereClause> = Vec::new();

    let where_clauses_arr: Vec<DynamicValue> = match where_clauses.is_array() {
        true => where_clauses.as_array().unwrap().clone(),
        false => Err(napi::Error::new(
            napi::Status::InvalidArg,
            "where_clauses must be an array",
        ))?,
    };

    for clause_arr in where_clauses_arr.iter() {
        let clause = match clause_arr.as_array() {
            Some(clause) => clause,
            None => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "clause must be an array",
            ))?,
        };

        let js_field = clause.get(0).ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "clause must contain 3 elements in array",
        ))?;
        let js_operator = clause.get(1).ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "clause must contain 3 elements in array",
        ))?;
        let js_value = clause.get(2).ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "clause must contain 3 elements in array",
        ))?;

        let field = match js_field.as_string() {
            Some(field) => Ok(field),
            None => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "field name is not a string",
            )),
        }?;

        let value = Value::try_from(js_value.clone())?;

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
                _ => Err(napi::Error::new(
                    napi::Status::InvalidArg,
                    "operator is not a known operator (=, >, >=, <, <=, <=, Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, In, StartsWith)",
                ))?,
            },
            None => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Operator not setted",
            ))?,
        };

        query_where_clauses.push(WhereClause {
            field,
            operator,
            value,
        })
    }

    Ok(InternalClauses::extract_from_clauses(query_where_clauses)
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?)
}

fn parse_order_by_index_map(
    js_order_by: Vec<Vec<String>>,
) -> Result<IndexMap<String, OrderClause>, napi::Error> {
    let mut order_by_map: IndexMap<String, OrderClause> = IndexMap::new();

    for js_order_by_value in js_order_by.iter() {
        let first_element = js_order_by_value.get(0).ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "order_by must be an array of arrays 2 elements (field_name, asc/desc)",
        ))?;

        let second_element = js_order_by_value.get(1).ok_or(napi::Error::new(
            napi::Status::InvalidArg,
            "order_by must be an array of arrays with 2 elements (field_name, asc/desc)",
        ))?;

        let ascending: bool = match second_element.to_lowercase().as_str() {
            "asc" => Ok(true),
            "desc" => Ok(false),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "order sorting direction must be a string (asc, desc)",
            )),
        }?;

        let order_clause = OrderClause {
            field: first_element.clone(),
            ascending,
        };

        order_by_map.insert(first_element.clone(), order_clause);
    }

    Ok(order_by_map)
}
