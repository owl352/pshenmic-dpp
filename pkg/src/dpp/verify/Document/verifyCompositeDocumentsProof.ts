import { dppProvider } from '../../provider.js'
import { CompositeSubQuery, DocumentsQuery, PlatformVersionLike, VerifiedCompositeDocuments } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import { DocumentWASM } from '../../structs/Document.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

/**
 * Verifies a composite query: a page plus up to 10 sub-queries, each optionally bound to
 * values the page or an earlier sub-query proved
 **/
export function verifyCompositeDocumentsProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  query: DocumentsQuery & { offset?: number },
  subQueries: CompositeSubQuery[],
  platformVersion: PlatformVersionLike
): VerifiedCompositeDocuments {
  const result = dppProvider.dpp.verifyCompositeDocumentsProof(
    proof,
    contract._rawDataContract,
    query.documentTypeName,
    valueToDynamicValue(query.where),
    query.orderBy ?? [],
    query.limit,
    query.offset,
    query.startAt != null ? prepareIdentifierValue(query.startAt) : undefined,
    query.startAtIncluded ?? false,
    subQueries.map(({ dataContract, ...subQuery }) => valueToDynamicValue(subQuery)),
    subQueries.map(subQuery => (subQuery.dataContract ?? contract)._rawDataContract),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    pageDocuments: result.pageDocuments.map(DocumentWASM.createFromRawInstance),
    subResults: result.subResults.map(subResult => ({
      documents: subResult.documents?.map(DocumentWASM.createFromRawInstance),
      counts: subResult.counts != null ? plainProofValue(subResult.counts) : undefined,
      missingIds: subResult.missingIds.map(IdentifierWASM.createFromRawInstance),
      removals: plainProofValue(subResult.removals)
    }))
  }
}
