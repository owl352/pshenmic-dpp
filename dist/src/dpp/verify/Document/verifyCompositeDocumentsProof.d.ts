import { CompositeSubQuery, DocumentsQuery, PlatformVersionLike, VerifiedCompositeDocuments } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/**
 * Verifies a composite query: a page plus up to 10 sub-queries, each optionally bound to
 * values the page or an earlier sub-query proved
 **/
export declare function verifyCompositeDocumentsProof(proof: Uint8Array, contract: DataContractWASM, query: DocumentsQuery & {
    offset?: number;
}, subQueries: CompositeSubQuery[], platformVersion: PlatformVersionLike): VerifiedCompositeDocuments;
