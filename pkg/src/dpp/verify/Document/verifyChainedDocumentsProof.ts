import { dppProvider } from '../../provider.js'
import { DocumentsQuery, PlatformVersionLike, VerifiedChainedDocuments } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import { DocumentWASM } from '../../structs/Document.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

/**
 * Verifies a chained query: `query` (the inner query, with an explicit limit) whose
 * `joinProperty` values are joined by id onto documents of `outerDocumentTypeName`
 **/
export function verifyChainedDocumentsProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  query: DocumentsQuery,
  joinProperty: string,
  outerDocumentTypeName: string,
  platformVersion: PlatformVersionLike
): VerifiedChainedDocuments {
  const result = dppProvider.dpp.verifyChainedDocumentsProof(
    proof,
    contract._rawDataContract,
    query.documentTypeName,
    valueToDynamicValue(query.where),
    query.orderBy ?? [],
    query.limit,
    query.startAt != null ? prepareIdentifierValue(query.startAt) : undefined,
    query.startAtIncluded ?? false,
    joinProperty,
    outerDocumentTypeName,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    innerDocuments: result.innerDocuments.map(DocumentWASM.createFromRawInstance),
    outerDocuments: result.outerDocuments.map(DocumentWASM.createFromRawInstance),
    missingOuterIds: result.missingOuterIds.map(IdentifierWASM.createFromRawInstance),
    removedOuterDocuments: plainProofValue(result.removedOuterDocuments)
  }
}
