//! Proofs of the document queries added in v5: chained (by-id join), composite (sub-queries),
//! ranked (top-k groups) and having-range. Each query is rebuilt here exactly as the SDK
//! builds it, so it resolves to the subtree the prover used.

use dpp::data_contract::DataContract;
use dpp::data_contract::accessors::v0::DataContractV0Getters;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::document_type::accessors::DocumentTypeV0Getters;
use dpp::document::Document;
use dpp::platform_value::Value;
use dpp::prelude::Identifier;
use dpp::version::PlatformVersion;
use drive::config::DEFAULT_QUERY_LIMIT;
use drive::query::composite_document_query::{
    BindingSource, DriveSubQuery, SubQueryBinding, SubQueryKind, SubQueryResult,
};
use drive::query::drive_document_count_query::SplitCountEntry;
use drive::query::drive_document_having_query::mode_detection::detect_having_mode;
use drive::query::drive_document_having_query::resolve_having_query_for_mode;
use drive::query::drive_document_ranked_query::index_picker::resolve_ranked_query_for_mode;
use drive::query::drive_document_ranked_query::mode_detection::detect_ranked_mode;
use drive::query::drive_document_ranked_query::{
    RankedEntry, RankedEntryValue, RankedPaginationInputs,
};
use drive::query::having::{
    HavingAggregate, HavingAggregateFunction, HavingClause, HavingOperator, HavingRightOperand,
};
use drive::query::projection::{SelectFunction, SelectProjection};
use drive::query::{
    DriveDocumentQuery, InternalClauses, OrderClause, ResolvedTimeRange, WhereClause,
    key_array_element_clauses,
};
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::document::DocumentNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::utils::serde_to_js;
use crate::verify::contract_moderation::DocumentRemovalEntry;
use crate::verify::document::document::{
    parse_order_by_index_map, parse_where_clauses, parse_where_clauses_with_windows,
    resolve_window_selections,
};
use crate::verify::plain::{
    VerifiedProofNAPI, identifier_from_js, platform_version_from_js, verified, verify_error,
};

fn invalid_arg(message: impl Into<String>) -> napi::Error {
    napi::Error::new(napi::Status::InvalidArg, message.into())
}

fn document_type<'a>(
    contract: &'a DataContract,
    document_type_name: &str,
) -> Result<DocumentTypeRef<'a>, napi::Error> {
    contract
        .document_type_for_name(document_type_name)
        .map_err(verify_error)
}

fn documents_to_js(
    documents: Vec<Document>,
    contract_id: &IdentifierNAPI,
) -> Result<Vec<DocumentNAPI>, napi::Error> {
    documents
        .into_iter()
        .map(|document| {
            let mut js_document = DocumentNAPI::from(document);
            js_document.set_js_data_contract_id(Either::A(contract_id))?;
            Ok(js_document)
        })
        .collect()
}

fn order_clauses(js_order_by: Vec<Vec<String>>) -> Result<Vec<OrderClause>, napi::Error> {
    Ok(parse_order_by_index_map(js_order_by)?
        .into_values()
        .collect())
}

/// The server's limit contract: unset falls back to the default limit, above it is refused
fn documents_limit(limit: Option<u32>) -> Result<u16, napi::Error> {
    match limit {
        None | Some(0) => Ok(DEFAULT_QUERY_LIMIT),
        Some(limit) if limit > u32::from(DEFAULT_QUERY_LIMIT) => Err(invalid_arg(format!(
            "limit {limit} greater than max limit {DEFAULT_QUERY_LIMIT}"
        ))),
        Some(limit) => Ok(limit as u16),
    }
}

/// The page of a chained or composite query, built like the SDK's `DocumentQuery`
#[allow(clippy::too_many_arguments)]
fn page_query<'a>(
    contract: &'a DataContract,
    document_type_name: &str,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    limit: Option<u32>,
    offset: Option<u32>,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
) -> Result<DriveDocumentQuery<'a>, napi::Error> {
    let internal_clauses = InternalClauses::extract_from_clauses(
        parse_where_clauses(js_where)?,
        PlatformVersion::latest(),
    )
    .map_err(verify_error)?;

    let offset = offset
        .map(|offset| {
            u16::try_from(offset)
                .map_err(|_| invalid_arg(format!("offset {offset} does not fit a u16")))
        })
        .transpose()?;

    Ok(DriveDocumentQuery {
        contract,
        document_type: document_type(contract, document_type_name)?,
        internal_clauses,
        offset,
        limit: Some(documents_limit(limit)?),
        order_by: parse_order_by_index_map(js_order_by)?,
        start_at: js_start_at
            .map(identifier_from_js)
            .transpose()?
            .map(|id| id.to_buffer()),
        start_at_included,
        block_time_ms: None,
        resolved_time_ranges: vec![],
        sub_queries: vec![],
    })
}

#[napi(js_name = "VerifiedChainedDocumentsNAPI")]
pub struct VerifiedChainedDocumentsNAPI {
    pub root_hash: Uint8Array,
    inner_documents: Vec<DocumentNAPI>,
    outer_documents: Vec<DocumentNAPI>,
    missing_outer_ids: Vec<Identifier>,
    removed_outer_documents: DynamicValue,
}

#[napi]
impl VerifiedChainedDocumentsNAPI {
    #[napi(getter, js_name = "innerDocuments")]
    pub fn inner_documents(&self) -> Vec<DocumentNAPI> {
        self.inner_documents.clone()
    }

    #[napi(getter, js_name = "outerDocuments")]
    pub fn outer_documents(&self) -> Vec<DocumentNAPI> {
        self.outer_documents.clone()
    }

    /// Join values whose deletable outer document no longer exists
    #[napi(getter, js_name = "missingOuterIds")]
    pub fn missing_outer_ids(&self) -> Vec<IdentifierNAPI> {
        self.missing_outer_ids
            .iter()
            .map(|id| (*id).into())
            .collect()
    }

    /// Join values whose moderated outer document a moderator removed, with the removal record
    #[napi(getter, js_name = "removedOuterDocuments")]
    pub fn removed_outer_documents(&self) -> DynamicValue {
        self.removed_outer_documents.clone()
    }
}

/// Verifies a chained query: an inner query whose `joinProperty` values are joined by id onto
/// documents of `outerDocumentTypeName`, proven together
#[napi(js_name = "verifyChainedDocumentsProof")]
pub fn verify_chained_documents_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    limit: Option<u32>,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
    join_property: String,
    outer_document_type_name: String,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedChainedDocumentsNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let contract_id: IdentifierNAPI = contract.id().into();

    let query = page_query(
        &contract,
        &document_type_name,
        js_where,
        js_order_by,
        limit,
        None,
        js_start_at,
        start_at_included,
    )?
    .with_by_id_join(
        join_property,
        document_type(&contract, &outer_document_type_name)?,
    );

    let (root_hash, result) = query
        .verify_chained_documents_proof(&proof, &platform_version)
        .map_err(verify_error)?;

    let removals: Vec<DocumentRemovalEntry> = result
        .removed_outer_documents
        .iter()
        .map(Into::into)
        .collect();

    Ok(VerifiedChainedDocumentsNAPI {
        root_hash: root_hash.to_vec().into(),
        inner_documents: documents_to_js(result.inner_documents, &contract_id)?,
        outer_documents: documents_to_js(result.outer_documents, &contract_id)?,
        missing_outer_ids: result.missing_outer_ids,
        removed_outer_documents: serde_to_js(&removals)?,
    })
}

#[napi(object, object_from_js = false, js_name = "CompositeSubResultNAPI")]
pub struct CompositeSubResultNAPI {
    /// Set for a `documents` sub-query
    pub documents: Option<Vec<DocumentNAPI>>,
    /// Set for a `count` sub-query: `[{ inKey, key, count }]`
    pub counts: Option<DynamicValue>,
    /// Ids a by-id join proved absent (deleted deletable documents)
    pub missing_ids: Vec<IdentifierNAPI>,
    /// Documents of a by-id join that a moderator removed, with their removal records
    pub removals: DynamicValue,
}

#[napi(js_name = "VerifiedCompositeDocumentsNAPI")]
pub struct VerifiedCompositeDocumentsNAPI {
    pub root_hash: Uint8Array,
    page_documents: Vec<DocumentNAPI>,
    sub_results: Vec<CompositeSubResultNAPI>,
}

#[napi]
impl VerifiedCompositeDocumentsNAPI {
    #[napi(getter, js_name = "pageDocuments")]
    pub fn page_documents(&self) -> Vec<DocumentNAPI> {
        self.page_documents.clone()
    }

    /// One result per sub-query, in sub-query order
    #[napi(getter, js_name = "subResults")]
    pub fn sub_results(&mut self) -> Vec<CompositeSubResultNAPI> {
        std::mem::take(&mut self.sub_results)
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct SplitCount<'a> {
    in_key: Option<&'a serde_bytes_like::Bytes>,
    key: &'a serde_bytes_like::Bytes,
    count: Option<u64>,
}

/// Index keys cross as bytes rather than as arrays of numbers
mod serde_bytes_like {
    #[repr(transparent)]
    pub struct Bytes(pub [u8]);

    impl Bytes {
        pub fn new(bytes: &[u8]) -> &Bytes {
            // SAFETY: `Bytes` is a transparent wrapper over `[u8]`
            unsafe { &*(bytes as *const [u8] as *const Bytes) }
        }
    }

    impl serde::Serialize for Bytes {
        fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
            serializer.serialize_bytes(&self.0)
        }
    }
}

use serde_bytes_like::Bytes;

impl<'a> From<&'a SplitCountEntry> for SplitCount<'a> {
    fn from(entry: &'a SplitCountEntry) -> Self {
        SplitCount {
            in_key: entry.in_key.as_deref().map(Bytes::new),
            key: Bytes::new(&entry.key),
            count: entry.count,
        }
    }
}

fn sub_query_field<'a>(
    object: &'a std::collections::BTreeMap<String, DynamicValue>,
    key: &str,
) -> Option<&'a DynamicValue> {
    object
        .get(key)
        .filter(|value| !value.is_undefined_or_null())
}

/// `{ documentTypeName, kind: 'documents' | 'count', where?, orderBy?, limit?,
/// binding?: { source: 'page' | <sub-query index>, sourceProperty, field } }`
fn parse_sub_query<'a>(
    contract: &'a DataContract,
    js_sub_query: &DynamicValue,
) -> Result<DriveSubQuery<'a>, napi::Error> {
    let object = js_sub_query
        .as_object()
        .ok_or_else(|| invalid_arg("a sub-query must be an object"))?;

    let document_type_name = sub_query_field(object, "documentTypeName")
        .and_then(DynamicValue::as_string)
        .ok_or_else(|| invalid_arg("a sub-query needs a documentTypeName"))?;

    let kind = match sub_query_field(object, "kind")
        .and_then(DynamicValue::as_string)
        .as_deref()
    {
        None | Some("documents") => SubQueryKind::Documents,
        Some("count") => SubQueryKind::Count,
        Some(other) => {
            return Err(invalid_arg(format!(
                "unknown sub-query kind {other} (documents, count)"
            )));
        }
    };

    let where_clauses = match sub_query_field(object, "where") {
        Some(js_where) => parse_where_clauses(js_where)?,
        None => vec![],
    };

    let order_by = match sub_query_field(object, "orderBy") {
        Some(js_order_by) => order_clauses(
            js_order_by
                .as_array()
                .ok_or_else(|| invalid_arg("orderBy must be an array"))?
                .iter()
                .map(|clause| {
                    clause
                        .as_array()
                        .ok_or_else(|| invalid_arg("an orderBy clause must be an array"))?
                        .iter()
                        .map(|part| {
                            part.as_string()
                                .ok_or_else(|| invalid_arg("orderBy parts must be strings"))
                        })
                        .collect::<Result<Vec<String>, napi::Error>>()
                })
                .collect::<Result<Vec<Vec<String>>, napi::Error>>()?,
        )?,
        None => vec![],
    };

    let limit = sub_query_field(object, "limit")
        .map(|limit| {
            let limit = limit.try_to_u64()?;
            u16::try_from(limit).map_err(|_| invalid_arg(format!("limit {limit} too large")))
        })
        .transpose()?;

    let binding = sub_query_field(object, "binding")
        .map(|js_binding| {
            let binding = js_binding
                .as_object()
                .ok_or_else(|| invalid_arg("a binding must be an object"))?;
            let source = sub_query_field(binding, "source")
                .ok_or_else(|| invalid_arg("a binding needs a source"))?;
            let source = match source.as_string().as_deref() {
                Some("page") => BindingSource::Page,
                Some(other) => {
                    return Err(invalid_arg(format!(
                        "binding source must be 'page' or a sub-query index, got {other}"
                    )));
                }
                None => BindingSource::SubQuery(source.try_to_u64()? as usize),
            };
            let text = |key: &str| {
                sub_query_field(binding, key)
                    .and_then(DynamicValue::as_string)
                    .ok_or_else(|| invalid_arg(format!("a binding needs a {key}")))
            };

            Ok(SubQueryBinding {
                source,
                source_property: text("sourceProperty")?,
                field: text("field")?,
            })
        })
        .transpose()?;

    Ok(DriveSubQuery {
        contract,
        document_type: document_type(contract, &document_type_name)?,
        kind,
        where_clauses,
        order_by,
        limit,
        binding,
    })
}

/// Verifies a composite query: a page plus up to 10 sub-queries, each optionally bound to
/// values the page or an earlier sub-query proved. `subQueryContracts[i]` is the contract
/// of `subQueries[i]`
#[napi(js_name = "verifyCompositeDocumentsProof")]
pub fn verify_composite_documents_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    limit: Option<u32>,
    offset: Option<u32>,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
    js_sub_queries: Vec<&DynamicValue>,
    js_sub_query_contracts: Vec<&DataContractNAPI>,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedCompositeDocumentsNAPI, napi::Error> {
    if js_sub_queries.len() != js_sub_query_contracts.len() {
        return Err(invalid_arg(
            "subQueryContracts must hold one contract per sub-query",
        ));
    }

    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let sub_query_contracts: Vec<DataContract> = js_sub_query_contracts
        .into_iter()
        .map(|contract| contract.clone().into())
        .collect();

    let mut query = page_query(
        &contract,
        &document_type_name,
        js_where,
        js_order_by,
        limit,
        offset,
        js_start_at,
        start_at_included,
    )?;
    query.sub_queries = js_sub_queries
        .into_iter()
        .zip(sub_query_contracts.iter())
        .map(|(js_sub_query, sub_contract)| parse_sub_query(sub_contract, js_sub_query))
        .collect::<Result<_, napi::Error>>()?;

    let (root_hash, result) = query
        .verify_composite_documents_proof(&proof, &platform_version)
        .map_err(verify_error)?;

    let mut missing_ids = result.sub_result_missing_ids.into_iter();
    let mut removals = result.sub_result_removals.into_iter();

    let sub_results = result
        .sub_results
        .into_iter()
        .zip(sub_query_contracts.iter())
        .map(|(sub_result, sub_contract)| {
            let (documents, counts) = match sub_result {
                SubQueryResult::Documents(documents) => (
                    Some(documents_to_js(documents, &sub_contract.id().into())?),
                    None,
                ),
                SubQueryResult::Counts(counts) => {
                    let counts: Vec<SplitCount> = counts.iter().map(Into::into).collect();
                    (None, Some(serde_to_js(&counts)?))
                }
            };
            let removed = removals.next().unwrap_or_default();
            let removed: Vec<DocumentRemovalEntry> = removed.iter().map(Into::into).collect();

            Ok(CompositeSubResultNAPI {
                documents,
                counts,
                missing_ids: missing_ids
                    .next()
                    .unwrap_or_default()
                    .into_iter()
                    .map(Into::into)
                    .collect(),
                removals: serde_to_js(&removed)?,
            })
        })
        .collect::<Result<Vec<_>, napi::Error>>()?;

    Ok(VerifiedCompositeDocumentsNAPI {
        root_hash: root_hash.to_vec().into(),
        page_documents: documents_to_js(result.page_documents, &contract.id().into())?,
        sub_results,
    })
}

/// `{ function: 'count' | 'sum' | 'avg' | 'min' | 'max', field? }`
fn parse_select(js_select: &DynamicValue) -> Result<SelectProjection, napi::Error> {
    let object = js_select
        .as_object()
        .ok_or_else(|| invalid_arg("select must be an object"))?;
    let field = sub_query_field(object, "field")
        .and_then(DynamicValue::as_string)
        .unwrap_or_default();
    let function = match sub_query_field(object, "function")
        .and_then(DynamicValue::as_string)
        .map(|function| function.to_lowercase())
        .as_deref()
    {
        Some("documents") => SelectFunction::Documents,
        Some("count") => SelectFunction::Count,
        Some("sum") => SelectFunction::Sum,
        Some("avg") => SelectFunction::Avg,
        Some("min") => SelectFunction::Min,
        Some("max") => SelectFunction::Max,
        _ => {
            return Err(invalid_arg(
                "select function must be one of documents, count, sum, avg, min, max",
            ));
        }
    };

    Ok(SelectProjection { function, field })
}

/// `[{ function: 'count' | 'sum' | 'avg', field?, operator, value }]`
fn parse_having(js_having: Option<&DynamicValue>) -> Result<Vec<HavingClause>, napi::Error> {
    let Some(js_having) = js_having.filter(|value| !value.is_undefined_or_null()) else {
        return Ok(vec![]);
    };

    js_having
        .as_array()
        .ok_or_else(|| invalid_arg("having must be an array"))?
        .iter()
        .map(|js_clause| {
            let object = js_clause
                .as_object()
                .ok_or_else(|| invalid_arg("a having clause must be an object"))?;
            let function = match sub_query_field(object, "function")
                .and_then(DynamicValue::as_string)
                .map(|function| function.to_lowercase())
                .as_deref()
            {
                Some("count") => HavingAggregateFunction::Count,
                Some("sum") => HavingAggregateFunction::Sum,
                Some("avg") => HavingAggregateFunction::Avg,
                _ => return Err(invalid_arg("having function must be count, sum or avg")),
            };
            let operator = match sub_query_field(object, "operator")
                .and_then(DynamicValue::as_string)
                .as_deref()
            {
                Some("=" | "==") => HavingOperator::Equal,
                Some("!=") => HavingOperator::NotEqual,
                Some(">") => HavingOperator::GreaterThan,
                Some(">=") => HavingOperator::GreaterThanOrEquals,
                Some("<") => HavingOperator::LessThan,
                Some("<=") => HavingOperator::LessThanOrEquals,
                Some("between" | "Between") => HavingOperator::Between,
                Some("betweenExcludeBounds" | "BetweenExcludeBounds") => {
                    HavingOperator::BetweenExcludeBounds
                }
                Some("betweenExcludeLeft" | "BetweenExcludeLeft") => {
                    HavingOperator::BetweenExcludeLeft
                }
                Some("betweenExcludeRight" | "BetweenExcludeRight") => {
                    HavingOperator::BetweenExcludeRight
                }
                Some("in" | "In") => HavingOperator::In,
                _ => return Err(invalid_arg("unknown having operator")),
            };
            let value = sub_query_field(object, "value")
                .ok_or_else(|| invalid_arg("a having clause needs a value"))?;

            Ok(HavingClause {
                aggregate: HavingAggregate {
                    function,
                    field: sub_query_field(object, "field")
                        .and_then(DynamicValue::as_string)
                        .unwrap_or_default(),
                },
                operator,
                right: HavingRightOperand::Value(Value::try_from(value.clone())?),
            })
        })
        .collect()
}

/// The parts of a ranked or having query rs-drive's mode detection reads
struct AggregateQuery {
    select: SelectProjection,
    group_by: Vec<String>,
    having: Vec<HavingClause>,
    order_by: Vec<OrderClause>,
    where_clauses: Vec<WhereClause>,
    resolved_time_ranges: Vec<ResolvedTimeRange>,
    pagination: RankedPaginationInputs,
}

#[allow(clippy::too_many_arguments)]
fn aggregate_query(
    contract: &DataContract,
    document_type_name: &str,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    js_select: &DynamicValue,
    group_by: Vec<String>,
    js_having: Option<&DynamicValue>,
    limit: Option<u32>,
    offset: Option<u32>,
    metadata_time_ms: Option<BigIntString>,
    platform_version: &PlatformVersion,
) -> Result<AggregateQuery, napi::Error> {
    let document_type = document_type(contract, document_type_name)?;

    // Window selections are resolved first, against the block time the server used
    let (mut where_clauses, windows) = parse_where_clauses_with_windows(js_where)?;
    let resolved_time_ranges = resolve_window_selections(
        windows,
        document_type,
        metadata_time_ms.map(|ms| ms.try_to_u64()).transpose()?,
        &mut where_clauses,
    )?;

    // Typed-array elements are keyed as the server keys them: one pinned element at most
    let where_clauses =
        key_array_element_clauses(where_clauses, document_type, false, platform_version)
            .map_err(verify_error)?;

    Ok(AggregateQuery {
        select: parse_select(js_select)?,
        group_by,
        having: parse_having(js_having)?,
        order_by: order_clauses(js_order_by)?,
        where_clauses,
        resolved_time_ranges,
        pagination: RankedPaginationInputs {
            limit: limit.filter(|limit| *limit != 0),
            offset,
            has_start_at: false,
        },
    })
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct RankedEntryValueJs {
    #[serde(skip_serializing_if = "Option::is_none")]
    count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    sum: Option<i64>,
    /// Fixed point, scaled by 10^19
    #[serde(skip_serializing_if = "Option::is_none")]
    avg_fixed_point: Option<i128>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct RankedEntryJs<'a> {
    key: &'a Bytes,
    in_key: Option<&'a Bytes>,
    value: RankedEntryValueJs,
}

impl<'a> From<&'a RankedEntry> for RankedEntryJs<'a> {
    fn from(entry: &'a RankedEntry) -> Self {
        let value = match entry.value {
            RankedEntryValue::Count(count) => RankedEntryValueJs {
                count: Some(count),
                sum: None,
                avg_fixed_point: None,
            },
            RankedEntryValue::Sum(sum) => RankedEntryValueJs {
                count: None,
                sum: Some(sum),
                avg_fixed_point: None,
            },
            RankedEntryValue::AvgFixedPoint(avg) => RankedEntryValueJs {
                count: None,
                sum: None,
                avg_fixed_point: Some(avg),
            },
        };

        RankedEntryJs {
            key: Bytes::new(&entry.key),
            in_key: entry.in_key.as_deref().map(Bytes::new),
            value,
        }
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct RankedPageJs<'a> {
    skipped: u64,
    entries: Vec<RankedEntryJs<'a>>,
}

/// Verifies a ranked (top-k) query: groups of `groupBy` ranked by `select`'s aggregate in the
/// order `orderBy` names. Window selections (`IN_TIME_RANGE`) resolve against `metadataTimeMs`,
/// the timeMs of the response metadata
#[napi(js_name = "verifyRankedDocumentsProof")]
pub fn verify_ranked_documents_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    js_select: &DynamicValue,
    group_by: Vec<String>,
    limit: Option<u32>,
    offset: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let document_type = document_type(&contract, &document_type_name)?;

    let query = aggregate_query(
        &contract,
        &document_type_name,
        js_where,
        js_order_by,
        js_select,
        group_by,
        None,
        limit,
        offset,
        metadata_time_ms,
        &platform_version,
    )?;

    let mode = detect_ranked_mode(
        &query.select,
        &query.group_by,
        &query.having,
        &query.order_by,
        &query.where_clauses,
        query.pagination,
        &platform_version,
    )
    .map_err(verify_error)?;

    let ranked_query = resolve_ranked_query_for_mode(
        contract.id().to_buffer(),
        document_type,
        document_type_name,
        document_type.indexes(),
        &mode,
        &query.resolved_time_ranges,
        &platform_version,
    )
    .map_err(verify_error)?;

    let (root_hash, page) = ranked_query
        .verify_ranked_top_k_proof(&proof, &platform_version)
        .map_err(verify_error)?;

    verified(
        root_hash,
        &RankedPageJs {
            skipped: page.skipped,
            entries: page.entries.iter().map(Into::into).collect(),
        },
    )
}

/// Verifies a having-range query: the groups of `groupBy` whose aggregate falls within the
/// `having` bounds. Window selections (`IN_TIME_RANGE`) resolve against `metadataTimeMs`,
/// the timeMs of the response metadata
#[napi(js_name = "verifyHavingDocumentsProof")]
pub fn verify_having_documents_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    js_select: &DynamicValue,
    group_by: Vec<String>,
    js_having: &DynamicValue,
    limit: Option<u32>,
    offset: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let document_type = document_type(&contract, &document_type_name)?;

    let query = aggregate_query(
        &contract,
        &document_type_name,
        js_where,
        js_order_by,
        js_select,
        group_by,
        Some(js_having),
        limit,
        offset,
        metadata_time_ms,
        &platform_version,
    )?;

    let mode = detect_having_mode(
        &query.select,
        &query.group_by,
        &query.having,
        &query.order_by,
        &query.where_clauses,
        query.pagination,
        &platform_version,
    )
    .map_err(verify_error)?;

    let having_query = resolve_having_query_for_mode(
        contract.id().to_buffer(),
        document_type,
        document_type_name,
        document_type.indexes(),
        &mode,
        &query.resolved_time_ranges,
        &platform_version,
    )
    .map_err(verify_error)?;

    let (root_hash, entries) = having_query
        .verify_having_range_proof(&proof, &platform_version)
        .map_err(verify_error)?;

    let entries: Vec<RankedEntryJs> = entries.iter().map(Into::into).collect();

    verified(root_hash, &entries)
}
