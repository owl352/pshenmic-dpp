import { AggregateProofQuery, PlatformVersionLike, ProvenAggregate, VerifiedProof } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/**
 * Verifies a `COUNT(*)` documents query. Without `groupBy` the single entry is the total; grouped by an
 * `In` and/or range field there is one entry per group. The proof primitive is resolved from the query
 * the way drive picks it. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE`
 * selections
 **/
export declare function verifyDocumentsCountProof(proof: Uint8Array, contract: DataContractWASM, query: AggregateProofQuery, platformVersion: PlatformVersionLike, metadataTimeMs?: bigint): VerifiedProof<ProvenAggregate>;
/**
 * Verifies a `SUM(field)` documents query: one entry with the total without `groupBy`, one per group with it.
 * `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export declare function verifyDocumentsSumProof(proof: Uint8Array, contract: DataContractWASM, query: AggregateProofQuery, field: string, platformVersion: PlatformVersionLike, metadataTimeMs?: bigint): VerifiedProof<ProvenAggregate>;
/**
 * Verifies an `AVG(field)` documents query: each entry carries the proved `count` and `sum`, the average
 * being `sum / count`. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export declare function verifyDocumentsAverageProof(proof: Uint8Array, contract: DataContractWASM, query: AggregateProofQuery, field: string, platformVersion: PlatformVersionLike, metadataTimeMs?: bigint): VerifiedProof<ProvenAggregate>;
