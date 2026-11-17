import { IdentifierLike, PlatformVersionLike, VerifiedDocuments, WhereClause } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/**
 * `blockTimeMs` reads history-keeping documents as of that time. `metadataTimeMs` (the timeMs of the
 * response metadata) resolves `IN_TIME_RANGE` selections
 **/
export declare function verifyDocumentsProof(proof: Uint8Array, contract: DataContractWASM, documentTypeName: string, whereClauses: WhereClause[] | undefined, orderBy: string[][] | undefined, limit: number | undefined | null, startAt: IdentifierLike | undefined | null, startAtIncluded: boolean, blockTimeMs: bigint | undefined | null, platformVersion: PlatformVersionLike, metadataTimeMs?: bigint): VerifiedDocuments;
