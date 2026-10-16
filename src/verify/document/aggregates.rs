//! Proofs of the aggregate document queries (`select: count | sum | avg`). The prover picks
//! the proof primitive by drive's resolved mode (aggregate, group by `In`, range, compound);
//! each verifier here resolves the same mode and covering index from the query, exactly as
//! the SDK does, and checks the proof with the matching primitive.

use dpp::data_contract::DataContract;
use dpp::data_contract::accessors::v0::DataContractV0Getters;
use dpp::data_contract::document_type::DocumentTypeRef;
use dpp::data_contract::document_type::accessors::{DocumentTypeV0Getters, DocumentTypeV2Getters};
use dpp::version::PlatformVersion;
use drive::config::DEFAULT_QUERY_LIMIT;
use drive::query::drive_document_sum_query::index_picker::{
    find_range_summable_index_for_where_clauses,
    find_range_summable_index_with_counts_for_where_clauses, find_summable_index_for_where_clauses,
    find_summable_index_with_counts_for_where_clauses,
};
use drive::query::drive_document_sum_query::mode_detection::detect_sum_mode_from_inputs;
use drive::query::drive_document_sum_query::{DocumentSumMode, DriveDocumentSumQuery, SumMode};
use drive::query::{
    AverageEntry, CountMode, DocumentCountMode, DriveDocumentCountQuery, ResolvedTimeRange,
    SplitCountEntry, SumEntry, WhereClause, WhereOperator, key_array_element_clauses,
    validate_and_canonicalize_where_clauses,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::verify::document::document::{
    parse_order_by_index_map, parse_where_clauses_with_windows, resolve_window_selections,
};
use crate::verify::plain::{VerifiedProofNAPI, platform_version_from_js, verified, verify_error};

fn invalid_arg(message: impl Into<String>) -> napi::Error {
    napi::Error::new(napi::Status::InvalidArg, message.into())
}

/// The where clauses the prover routed on: window selections resolved, a typed array's
/// elements keyed (several only when grouped by the `In` on it), then canonicalized
struct AggregateClauses<'a> {
    document_type: DocumentTypeRef<'a>,
    where_clauses: Vec<WhereClause>,
    resolved_time_ranges: Vec<ResolvedTimeRange>,
}

fn aggregate_clauses<'a>(
    contract: &'a DataContract,
    document_type_name: &str,
    js_where: &DynamicValue,
    group_by: &[String],
    metadata_time_ms: Option<BigIntString>,
    platform_version: &PlatformVersion,
) -> Result<AggregateClauses<'a>, napi::Error> {
    let document_type = contract
        .document_type_for_name(document_type_name)
        .map_err(verify_error)?;

    let (mut where_clauses, windows) = parse_where_clauses_with_windows(js_where)?;
    let resolved_time_ranges = resolve_window_selections(
        windows,
        document_type,
        metadata_time_ms.map(|ms| ms.try_to_u64()).transpose()?,
        &mut where_clauses,
    )?;

    let grouped_by_in = match group_by {
        [field] => where_clauses.iter().any(|clause| {
            matches!(
                clause.operator,
                WhereOperator::In | WhereOperator::ContainsAny
            ) && clause.field == *field
        }),
        _ => false,
    };
    let keyed = key_array_element_clauses(
        where_clauses,
        document_type,
        grouped_by_in,
        platform_version,
    )
    .map_err(verify_error)?;
    let where_clauses =
        validate_and_canonicalize_where_clauses(keyed, platform_version).map_err(verify_error)?;

    Ok(AggregateClauses {
        document_type,
        where_clauses,
        resolved_time_ranges,
    })
}

/// The SQL-shape mode `(groupBy, where)` implies, as the server's router resolves it
enum GroupShape {
    Aggregate,
    GroupByIn,
    GroupByRange,
    GroupByCompound,
}

fn group_shape(
    group_by: &[String],
    where_clauses: &[WhereClause],
    is_range_operator: fn(WhereOperator) -> bool,
) -> Result<GroupShape, napi::Error> {
    let is_in_field = |field: &str| {
        where_clauses
            .iter()
            .any(|clause| clause.operator == WhereOperator::In && clause.field == field)
    };
    let is_range_field = |field: &str| {
        where_clauses
            .iter()
            .any(|clause| is_range_operator(clause.operator) && clause.field == field)
    };

    match group_by {
        [] => Ok(GroupShape::Aggregate),
        [field] if is_in_field(field) => Ok(GroupShape::GroupByIn),
        [field] if is_range_field(field) => Ok(GroupShape::GroupByRange),
        [field] => Err(invalid_arg(format!(
            "GROUP BY on field {field}, which no In or range where clause constrains, is not supported"
        ))),
        [first, second] if is_in_field(first) && is_range_field(second) => {
            Ok(GroupShape::GroupByCompound)
        }
        [_, _] => Err(invalid_arg(
            "a two-field GROUP BY must be (In field, range field)",
        )),
        _ => Err(invalid_arg(
            "GROUP BY with more than two fields is not supported",
        )),
    }
}

fn left_to_right(js_order_by: Vec<Vec<String>>) -> Result<bool, napi::Error> {
    Ok(parse_order_by_index_map(js_order_by)?
        .first()
        .map(|(_, clause)| clause.ascending)
        .unwrap_or(true))
}

/// A distinct walk: unset falls back to the platform default, as the server's dispatcher does
fn distinct_limit(limit: Option<u32>) -> Result<u16, napi::Error> {
    match limit {
        None | Some(0) => Ok(DEFAULT_QUERY_LIMIT),
        Some(limit) => u16::try_from(limit)
            .map_err(|_| invalid_arg(format!("limit {limit} does not fit a u16"))),
    }
}

fn carrier_limit(limit: Option<u32>) -> Result<Option<u16>, napi::Error> {
    match limit {
        None | Some(0) => Ok(None),
        Some(limit) => u16::try_from(limit)
            .map(Some)
            .map_err(|_| invalid_arg(format!("limit {limit} does not fit a u16"))),
    }
}

/// Index keys cross as bytes rather than as arrays of numbers
struct Bytes<'a>(&'a [u8]);

impl serde::Serialize for Bytes<'_> {
    fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_bytes(self.0)
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct AggregateEntryJs<'a> {
    in_key: Option<Bytes<'a>>,
    key: Bytes<'a>,
    #[serde(skip_serializing_if = "Option::is_none")]
    count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    sum: Option<i64>,
}

#[derive(serde::Serialize)]
struct AggregateResultJs<'a> {
    /// The proof primitive the query resolved to
    mode: &'static str,
    entries: Vec<AggregateEntryJs<'a>>,
}

fn count_entry(entry: &SplitCountEntry) -> AggregateEntryJs<'_> {
    AggregateEntryJs {
        in_key: entry.in_key.as_deref().map(Bytes),
        key: Bytes(&entry.key),
        count: entry.count,
        sum: None,
    }
}

fn sum_entry(entry: &SumEntry) -> AggregateEntryJs<'_> {
    AggregateEntryJs {
        in_key: entry.in_key.as_deref().map(Bytes),
        key: Bytes(&entry.key),
        count: None,
        sum: entry.sum,
    }
}

fn average_entry(entry: &AverageEntry) -> AggregateEntryJs<'_> {
    AggregateEntryJs {
        in_key: entry.in_key.as_deref().map(Bytes),
        key: Bytes(&entry.key),
        count: entry.count,
        sum: entry.sum,
    }
}

fn single_entry(count: Option<u64>, sum: Option<i64>) -> Vec<AggregateEntryJs<'static>> {
    vec![AggregateEntryJs {
        in_key: None,
        key: Bytes(&[]),
        count,
        sum,
    }]
}

fn result(
    root_hash: [u8; 32],
    mode: &'static str,
    entries: Vec<AggregateEntryJs>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    verified(root_hash, &AggregateResultJs { mode, entries })
}

fn no_proof_mode(mode: impl std::fmt::Debug) -> napi::Error {
    verify_error(format!(
        "mode detection resolved the no-proof mode {mode:?} for a proved query"
    ))
}

/// Verifies a `COUNT(*)` query. Without `groupBy` the single entry is the total; grouped by an
/// `In` and/or range field there is one entry per group (`inKey` / `key` are the serialized
/// index values). Window selections (`IN_TIME_RANGE`) resolve against `metadataTimeMs`, the
/// timeMs of the response metadata
#[allow(clippy::too_many_arguments)]
#[napi(js_name = "verifyDocumentsCountProof")]
pub fn verify_documents_count_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    group_by: Vec<String>,
    limit: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let contract_id = contract.id().to_buffer();
    let AggregateClauses {
        document_type,
        where_clauses,
        resolved_time_ranges,
    } = aggregate_clauses(
        &contract,
        &document_type_name,
        js_where,
        &group_by,
        metadata_time_ms,
        &platform_version,
    )?;

    let count_mode = match group_shape(
        &group_by,
        &where_clauses,
        DriveDocumentCountQuery::is_range_operator,
    )? {
        GroupShape::Aggregate => CountMode::Aggregate,
        GroupShape::GroupByIn => CountMode::GroupByIn,
        GroupShape::GroupByRange => CountMode::GroupByRange,
        GroupShape::GroupByCompound => CountMode::GroupByCompound,
    };
    let mode = DriveDocumentCountQuery::detect_mode_versioned(
        &where_clauses,
        count_mode,
        true,
        &platform_version,
    )
    .map_err(verify_error)?;

    // An unfiltered count of a `documentsCountable` type proves the primary-key count tree
    if matches!(mode, DocumentCountMode::PointLookupProof)
        && where_clauses.is_empty()
        && document_type.documents_countable()
    {
        let (root_hash, count) = DriveDocumentCountQuery::verify_primary_key_count_tree_proof(
            &proof,
            contract_id,
            &document_type_name,
            &platform_version,
        )
        .map_err(verify_error)?;
        return result(root_hash, "primaryKeyTree", single_entry(Some(count), None));
    }

    let needs_range_index = matches!(
        mode,
        DocumentCountMode::RangeProof
            | DocumentCountMode::RangeDistinctProof
            | DocumentCountMode::RangeAggregateCarrierProof
    );
    let index = if needs_range_index {
        DriveDocumentCountQuery::find_range_countable_index_for_where_clauses(
            document_type.indexes(),
            &where_clauses,
            &resolved_time_ranges,
        )
        .ok_or_else(|| {
            invalid_arg(
                "a range count needs a rangeCountable index whose last property is the range field",
            )
        })?
    } else {
        DriveDocumentCountQuery::find_countable_index_for_where_clauses(
            document_type.indexes(),
            &where_clauses,
            &resolved_time_ranges,
        )
        .ok_or_else(|| {
            invalid_arg(
                "a count needs a countable index whose properties match the where clause fields, \
                 or documentsCountable on the type for an unfiltered count",
            )
        })?
    };

    let query = DriveDocumentCountQuery {
        document_type,
        contract_id,
        document_type_name,
        index,
        where_clauses,
    };

    match mode {
        DocumentCountMode::PointLookupProof => {
            let (root_hash, entries) = query
                .verify_point_lookup_count_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(
                root_hash,
                "pointLookup",
                entries.iter().map(count_entry).collect(),
            )
        }
        DocumentCountMode::RangeProof => {
            let (root_hash, count) = query
                .verify_aggregate_count_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(root_hash, "aggregate", single_entry(Some(count), None))
        }
        DocumentCountMode::RangeDistinctProof => {
            let (root_hash, entries) = query
                .verify_distinct_count_proof(
                    &proof,
                    distinct_limit(limit)?,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "distinct",
                entries.iter().map(count_entry).collect(),
            )
        }
        DocumentCountMode::RangeAggregateCarrierProof => {
            // The same limit the server's dispatcher computes, unset walking the default
            let carrier_limit = DriveDocumentCountQuery::carrier_aggregate_count_limit(
                &query.where_clauses,
                limit.filter(|limit| *limit != 0),
            )
            .map_err(verify_error)?;
            let (root_hash, per_key) = query
                .verify_carrier_aggregate_count_proof(
                    &proof,
                    carrier_limit,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "carrierAggregate",
                per_key
                    .iter()
                    .map(|(in_key, count)| AggregateEntryJs {
                        in_key: Some(Bytes(in_key)),
                        key: Bytes(&[]),
                        count: Some(*count),
                        sum: None,
                    })
                    .collect(),
            )
        }
        other => Err(no_proof_mode(other)),
    }
}

/// Sum and average queries route through the same sum-mode router and differ only in the
/// index they need (an average also needs counts) and the primitives proving them
#[derive(Clone, Copy, PartialEq)]
enum SumKind {
    Sum,
    Average,
}

#[allow(clippy::too_many_arguments)]
fn verify_sum_or_average(
    kind: SumKind,
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    group_by: Vec<String>,
    field: String,
    limit: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    if field.is_empty() {
        return Err(invalid_arg("the summed field is required"));
    }

    let platform_version = platform_version_from_js(js_platform_version)?;
    let contract: DataContract = js_contract.clone().into();
    let contract_id = contract.id().to_buffer();
    let AggregateClauses {
        document_type,
        where_clauses,
        resolved_time_ranges,
    } = aggregate_clauses(
        &contract,
        &document_type_name,
        js_where,
        &group_by,
        metadata_time_ms,
        &platform_version,
    )?;

    let sum_mode = match group_shape(
        &group_by,
        &where_clauses,
        drive::query::drive_document_sum_query::is_range_operator,
    )? {
        GroupShape::Aggregate => SumMode::Aggregate,
        GroupShape::GroupByIn => SumMode::GroupByIn,
        GroupShape::GroupByRange => SumMode::GroupByRange,
        GroupShape::GroupByCompound => SumMode::GroupByCompound,
    };
    let mode = detect_sum_mode_from_inputs(&where_clauses, sum_mode, true, &platform_version)
        .map_err(verify_error)?;

    // An unfiltered sum of the type-level `documentsSummable` field proves the primary-key tree
    let sums_type_field = document_type.documents_summable() == Some(field.as_str());
    if matches!(mode, DocumentSumMode::PointLookupProof) && where_clauses.is_empty() {
        match kind {
            SumKind::Sum if sums_type_field => {
                let (root_hash, sum) = DriveDocumentSumQuery::verify_primary_key_sum_tree_proof(
                    &proof,
                    contract_id,
                    &document_type_name,
                    &platform_version,
                )
                .map_err(verify_error)?;
                return result(root_hash, "primaryKeyTree", single_entry(None, Some(sum)));
            }
            SumKind::Average if sums_type_field && document_type.documents_countable() => {
                let (root_hash, count, sum) =
                    DriveDocumentSumQuery::verify_primary_key_count_sum_tree_proof(
                        &proof,
                        contract_id,
                        &document_type_name,
                        &platform_version,
                    )
                    .map_err(verify_error)?;
                return result(
                    root_hash,
                    "primaryKeyTree",
                    single_entry(Some(count), Some(sum)),
                );
            }
            _ => {}
        }
    }

    let needs_range_index = matches!(
        mode,
        DocumentSumMode::RangeProof
            | DocumentSumMode::RangeDistinctProof
            | DocumentSumMode::RangeAggregateCarrierProof
    );
    let indexes = document_type.indexes();
    let index = match (kind, needs_range_index) {
        (SumKind::Sum, true) => find_range_summable_index_for_where_clauses(
            indexes,
            &where_clauses,
            &field,
            &resolved_time_ranges,
        ),
        (SumKind::Sum, false) => find_summable_index_for_where_clauses(
            indexes,
            &where_clauses,
            &field,
            &resolved_time_ranges,
        ),
        (SumKind::Average, true) => find_range_summable_index_with_counts_for_where_clauses(
            indexes,
            &where_clauses,
            &field,
            &resolved_time_ranges,
        ),
        (SumKind::Average, false) => find_summable_index_with_counts_for_where_clauses(
            indexes,
            &where_clauses,
            &field,
            &resolved_time_ranges,
        ),
    }
    .ok_or_else(|| {
        invalid_arg(format!(
            "no summable index on {field} covers the where clause fields{}",
            if needs_range_index {
                " with the range field last (rangeSummable)"
            } else {
                ", and the type does not declare it documentsSummable"
            }
        ))
    })?;

    let query = DriveDocumentSumQuery {
        document_type,
        contract_id,
        document_type_name,
        index,
        where_clauses,
        sum_property: field,
    };

    match (kind, mode) {
        (SumKind::Sum, DocumentSumMode::PointLookupProof) => {
            let (root_hash, entries) = query
                .verify_point_lookup_sum_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(
                root_hash,
                "pointLookup",
                entries.iter().map(sum_entry).collect(),
            )
        }
        (SumKind::Average, DocumentSumMode::PointLookupProof) => {
            let (root_hash, entries) = query
                .verify_point_lookup_count_and_sum_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(
                root_hash,
                "pointLookup",
                entries.iter().map(average_entry).collect(),
            )
        }
        (SumKind::Sum, DocumentSumMode::RangeProof) => {
            let (root_hash, sum) = query
                .verify_aggregate_sum_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(root_hash, "aggregate", single_entry(None, Some(sum)))
        }
        (SumKind::Average, DocumentSumMode::RangeProof) => {
            let (root_hash, count, sum) = query
                .verify_aggregate_count_and_sum_proof(&proof, &platform_version)
                .map_err(verify_error)?;
            result(root_hash, "aggregate", single_entry(Some(count), Some(sum)))
        }
        (SumKind::Sum, DocumentSumMode::RangeDistinctProof) => {
            let (root_hash, entries) = query
                .verify_distinct_sum_proof(
                    &proof,
                    distinct_limit(limit)?,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "distinct",
                entries.iter().map(sum_entry).collect(),
            )
        }
        (SumKind::Average, DocumentSumMode::RangeDistinctProof) => {
            let (root_hash, entries) = query
                .verify_distinct_count_and_sum_proof(
                    &proof,
                    distinct_limit(limit)?,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "distinct",
                entries.iter().map(average_entry).collect(),
            )
        }
        (SumKind::Sum, DocumentSumMode::RangeAggregateCarrierProof) => {
            let (root_hash, per_key) = query
                .verify_carrier_aggregate_sum_proof(
                    &proof,
                    carrier_limit(limit)?,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "carrierAggregate",
                per_key
                    .iter()
                    .map(|(in_key, sum)| AggregateEntryJs {
                        in_key: Some(Bytes(in_key)),
                        key: Bytes(&[]),
                        count: None,
                        sum: Some(*sum),
                    })
                    .collect(),
            )
        }
        (SumKind::Average, DocumentSumMode::RangeAggregateCarrierProof) => {
            let (root_hash, per_key) = query
                .verify_carrier_aggregate_count_and_sum_proof(
                    &proof,
                    carrier_limit(limit)?,
                    left_to_right(js_order_by)?,
                    &platform_version,
                )
                .map_err(verify_error)?;
            result(
                root_hash,
                "carrierAggregate",
                per_key
                    .iter()
                    .map(|(in_key, count, sum)| AggregateEntryJs {
                        in_key: Some(Bytes(in_key)),
                        key: Bytes(&[]),
                        count: Some(*count),
                        sum: Some(*sum),
                    })
                    .collect(),
            )
        }
        (_, other) => Err(no_proof_mode(other)),
    }
}

/// Verifies a `SUM(field)` query: one entry with the total without `groupBy`, one per group
/// with it. Window selections (`IN_TIME_RANGE`) resolve against `metadataTimeMs`, the timeMs
/// of the response metadata
#[allow(clippy::too_many_arguments)]
#[napi(js_name = "verifyDocumentsSumProof")]
pub fn verify_documents_sum_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    group_by: Vec<String>,
    field: String,
    limit: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    verify_sum_or_average(
        SumKind::Sum,
        proof,
        js_contract,
        document_type_name,
        js_where,
        js_order_by,
        group_by,
        field,
        limit,
        js_platform_version,
        metadata_time_ms,
    )
}

/// Verifies an `AVG(field)` query: each entry carries the proved `count` and `sum` the average
/// is their quotient of. Window selections (`IN_TIME_RANGE`) resolve against `metadataTimeMs`,
/// the timeMs of the response metadata
#[allow(clippy::too_many_arguments)]
#[napi(js_name = "verifyDocumentsAverageProof")]
pub fn verify_documents_average_proof(
    proof: Uint8Array,
    js_contract: &DataContractNAPI,
    document_type_name: String,
    js_where: &DynamicValue,
    js_order_by: Vec<Vec<String>>,
    group_by: Vec<String>,
    field: String,
    limit: Option<u32>,
    js_platform_version: &DynamicValue,
    metadata_time_ms: Option<BigIntString>,
) -> Result<VerifiedProofNAPI, napi::Error> {
    verify_sum_or_average(
        SumKind::Average,
        proof,
        js_contract,
        document_type_name,
        js_where,
        js_order_by,
        group_by,
        field,
        limit,
        js_platform_version,
        metadata_time_ms,
    )
}
