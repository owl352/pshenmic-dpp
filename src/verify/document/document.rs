use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::platform_value::Value;
use drive::query::WhereOperator::{
    Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, Contains, ContainsAny,
    Equal, GreaterThan, GreaterThanOrEquals, In, LessThan, LessThanOrEquals, StartsWith,
};
use drive::query::{
    DriveDocumentQuery, IntegerRangeGridSpec, InternalClauses, OrderClause, ResolvedTimeRange,
    TimeRangeGridSpec, TimeRangeSelector, WhereClause, resolve_integer_range_bucket_clause,
    resolve_time_range_bucket_clause, validate_resolved_time_range_clause_shapes,
};
use indexmap::IndexMap;
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::platform_version::PlatformVersionNAPI;
use crate::identifier::IdentifierNAPI;
use dpp::version::PlatformVersion;

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

#[allow(clippy::too_many_arguments)]
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
    block_time_ms: Option<BigIntString>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedDocumentsNAPI, napi::Error> {
    let platform_version: PlatformVersion =
        match js_platform_version.is_undefined() | js_platform_version.is_null() {
            true => PlatformVersionNAPI::default(),
            false => PlatformVersionNAPI::try_from(js_platform_version)?,
        }
        .into();

    // The point in time a history-keeping document is read at: part of the proved path
    let block_time_ms = block_time_ms.map(|ms| ms.try_to_u64()).transpose()?;
    let metadata_time_ms = metadata_time_ms.map(|ms| ms.try_to_u64()).transpose()?;

    let document_type = contract
        .get_document_type_ref_by_name(document_type_name)
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

    // Window selections resolve against the block time the server used: the response metadata
    let (mut where_clauses, windows) = parse_where_clauses_with_windows(js_where_clauses)?;
    let resolved_time_ranges =
        resolve_window_selections(windows, document_type, metadata_time_ms, &mut where_clauses)?;
    let internal_clauses = InternalClauses::extract_from_clauses(where_clauses, &platform_version)
        .map_err(|err| napi::Error::new(napi::Status::GenericFailure, err.to_string()))?;

    let start_at_bytes = match js_start_at {
        Some(start_at) => Some(IdentifierNAPI::try_from(start_at)?.to_slice()),
        None => None,
    };

    let order_by_map = parse_order_by_index_map(js_order_by)?;

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
        resolved_time_ranges,
        sub_queries: vec![],
    };

    let (root_hash, documents) = query
        .verify_proof(&proof.to_vec(), &platform_version)
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

/// `[[field, operator, value], ...]`; undefined or null is no clause.
/// Window selections (`IN_TIME_RANGE`, `IN_INTEGER_RANGE`) are refused here: only the
/// verifiers that resolve them read them, through [`parse_where_clauses_with_windows`]
pub(crate) fn parse_where_clauses(
    where_clauses: &DynamicValue,
) -> Result<Vec<WhereClause>, napi::Error> {
    let (clauses, windows) = parse_where_clauses_with_windows(where_clauses)?;
    if !windows.is_empty() {
        return Err(napi::Error::new(
            napi::Status::InvalidArg,
            "IN_TIME_RANGE / IN_INTEGER_RANGE selections are not supported by this query",
        ));
    }
    Ok(clauses)
}

/// A window selection of a where clause, resolved against the contract into the equality
/// on the window start the prover used (see [`resolve_window_selections`])
pub(crate) enum WindowSelection {
    Time {
        field: String,
        selector: TimeRangeSelector,
        grid: Option<TimeRangeGridSpec>,
    },
    Integer {
        field: String,
        start: Value,
        grid: Option<IntegerRangeGridSpec>,
    },
}

fn window_error(message: impl Into<String>) -> napi::Error {
    napi::Error::new(napi::Status::InvalidArg, message.into())
}

fn map_entry<'a>(value: &'a Value, key: &str) -> Option<&'a Value> {
    match value {
        Value::Map(entries) => entries
            .iter()
            .find(|(k, _)| matches!(k, Value::Text(text) if text == key))
            .map(|(_, v)| v)
            .filter(|v| !v.is_null()),
        _ => None,
    }
}

fn map_u64(value: &Value, key: &str, required: bool) -> Result<Option<u64>, napi::Error> {
    match map_entry(value, key) {
        Some(entry) => entry
            .to_integer::<u64>()
            .map(Some)
            .map_err(|_| window_error(format!("{key} must be a non-negative integer"))),
        None if required => Err(window_error(format!("{key} is required"))),
        None => Ok(None),
    }
}

/// `"newest"` | `"oldest"` | a window start in ms |
/// `{ selector: "newest" | "oldest" | "byStart", startMs?, grid?: { rangeSeconds, stepSeconds, phaseSeconds? } }`
fn parse_time_range_selection(
    field: String,
    value: &Value,
) -> Result<WindowSelection, napi::Error> {
    let selector_of = |text: &str, start_ms: Option<u64>| match text {
        "byStart" => Ok(TimeRangeSelector::ByStart {
            start_ms: start_ms.ok_or_else(|| window_error("a byStart selection needs startMs"))?,
        }),
        other => TimeRangeSelector::from_string(other).ok_or_else(|| {
            window_error(format!(
                "unknown time range selector {other} (newest, oldest, byStart)"
            ))
        }),
    };

    let (selector, grid) = match value {
        Value::Text(text) => (selector_of(text, None)?, None),
        Value::Map(_) => {
            let selector = match map_entry(value, "selector") {
                Some(Value::Text(text)) => selector_of(text, map_u64(value, "startMs", false)?)?,
                Some(_) => return Err(window_error("selector must be a string")),
                None => selector_of("byStart", map_u64(value, "startMs", false)?)?,
            };
            let grid = map_entry(value, "grid")
                .map(|grid| {
                    Ok::<_, napi::Error>(TimeRangeGridSpec {
                        range_seconds: map_u64(grid, "rangeSeconds", true)?.unwrap_or_default(),
                        step_seconds: map_u64(grid, "stepSeconds", true)?.unwrap_or_default(),
                        phase_seconds: map_u64(grid, "phaseSeconds", false)?.unwrap_or_default(),
                    })
                })
                .transpose()?;
            (selector, grid)
        }
        integer => (
            TimeRangeSelector::ByStart {
                start_ms: integer.to_integer::<u64>().map_err(|_| {
                    window_error(
                        "an IN_TIME_RANGE selection must be a selector, a start or an object",
                    )
                })?,
            },
            None,
        ),
    };

    Ok(WindowSelection::Time {
        field,
        selector,
        grid,
    })
}

/// A window start | `{ start, grid?: { range, step, phase? } }`
fn parse_integer_range_selection(
    field: String,
    value: &Value,
) -> Result<WindowSelection, napi::Error> {
    let (start, grid) = match value {
        Value::Map(_) => {
            let start = map_entry(value, "start")
                .cloned()
                .ok_or_else(|| window_error("an IN_INTEGER_RANGE selection needs a start"))?;
            let grid = map_entry(value, "grid")
                .map(|grid| {
                    Ok::<_, napi::Error>(IntegerRangeGridSpec {
                        range: map_u64(grid, "range", true)?.unwrap_or_default(),
                        step: map_u64(grid, "step", true)?.unwrap_or_default(),
                        phase: map_u64(grid, "phase", false)?.unwrap_or_default(),
                    })
                })
                .transpose()?;
            (start, grid)
        }
        start => (start.clone(), None),
    };

    Ok(WindowSelection::Integer { field, start, grid })
}

/// Resolves window selections the way the server did: into an equality on the window start,
/// appended to `where_clauses`, plus the provenance that pins index selection to the grid.
/// A time-range selection needs the authoritative block time: the quorum-signed `timeMs` of
/// the response metadata
pub(crate) fn resolve_window_selections(
    windows: Vec<WindowSelection>,
    document_type: DocumentTypeRef,
    block_time_ms: Option<u64>,
    where_clauses: &mut Vec<WhereClause>,
) -> Result<Vec<ResolvedTimeRange>, napi::Error> {
    let mut resolved_time_ranges = Vec::with_capacity(windows.len());

    for window in windows {
        let (clause, resolved) = match window {
            WindowSelection::Time {
                field,
                selector,
                grid,
            } => {
                let block_time_ms = block_time_ms.ok_or_else(|| {
                    window_error(
                        "an IN_TIME_RANGE selection needs metadataTimeMs: the timeMs of the response metadata",
                    )
                })?;
                resolve_time_range_bucket_clause(&field, selector, grid, document_type, block_time_ms)
            }
            WindowSelection::Integer { field, start, grid } => {
                resolve_integer_range_bucket_clause(&field, &start, grid, document_type)
            }
        }
        .map_err(|err| window_error(err.to_string()))?;

        where_clauses.push(clause);
        resolved_time_ranges.push(resolved);
    }

    validate_resolved_time_range_clause_shapes(where_clauses, &resolved_time_ranges)
        .map_err(|err| window_error(err.to_string()))?;

    Ok(resolved_time_ranges)
}

/// [`parse_where_clauses`] that hands window selections back instead of refusing them
pub(crate) fn parse_where_clauses_with_windows(
    where_clauses: &DynamicValue,
) -> Result<(Vec<WhereClause>, Vec<WindowSelection>), napi::Error> {
    if where_clauses.is_undefined_or_null() {
        return Ok((vec![], vec![]));
    }

    let mut query_where_clauses: Vec<WhereClause> = Vec::new();
    let mut windows: Vec<WindowSelection> = Vec::new();

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

        match js_operator.as_string().as_deref() {
            Some("IN_TIME_RANGE" | "inTimeRange" | "intimerange" | "in_time_range") => {
                windows.push(parse_time_range_selection(field, &value)?);
                continue;
            }
            Some("IN_INTEGER_RANGE" | "inIntegerRange" | "inintegerrange" | "in_integer_range") => {
                windows.push(parse_integer_range_selection(field, &value)?);
                continue;
            }
            _ => {}
        }

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
                "Contains" | "contains" => Contains,
                "ContainsAny" | "containsAny" | "containsany" | "contains_any" => ContainsAny,
                _ => Err(napi::Error::new(
                    napi::Status::InvalidArg,
                    "operator is not a known operator (=, >, >=, <, <=, <=, Between, BetweenExcludeBounds, BetweenExcludeLeft, BetweenExcludeRight, In, StartsWith, Contains, ContainsAny, IN_TIME_RANGE, IN_INTEGER_RANGE)",
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

    Ok((query_where_clauses, windows))
}

pub(crate) fn parse_order_by_index_map(
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
