import { AggregateDocumentsQuery, HavingClause, PlatformVersionLike, ProvenRankedEntry, VerifiedProof } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/**
 * Verifies a having-range query: the groups of `groupBy` whose aggregate falls within the
 * `having` bounds. `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export declare function verifyHavingDocumentsProof(proof: Uint8Array, contract: DataContractWASM, query: AggregateDocumentsQuery & {
    having: HavingClause[];
}, platformVersion: PlatformVersionLike, metadataTimeMs?: bigint): VerifiedProof<ProvenRankedEntry[]>;
