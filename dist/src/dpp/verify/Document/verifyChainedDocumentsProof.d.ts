import { DocumentsQuery, PlatformVersionLike, VerifiedChainedDocuments } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
/**
 * Verifies a chained query: `query` (the inner query, with an explicit limit) whose
 * `joinProperty` values are joined by id onto documents of `outerDocumentTypeName`
 **/
export declare function verifyChainedDocumentsProof(proof: Uint8Array, contract: DataContractWASM, query: DocumentsQuery, joinProperty: string, outerDocumentTypeName: string, platformVersion: PlatformVersionLike): VerifiedChainedDocuments;
