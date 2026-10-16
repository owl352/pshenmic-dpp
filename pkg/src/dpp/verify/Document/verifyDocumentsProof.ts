import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedDocuments, WhereClause } from '../../types.js'
import { DocumentWASM } from '../../structs/Document.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/**
 * `blockTimeMs` reads history-keeping documents as of that time. `metadataTimeMs` (the timeMs of the
 * response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyDocumentsProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  documentTypeName: string,
  whereClauses: WhereClause[] | undefined,
  orderBy: string[][] | undefined,
  limit: number | undefined | null,
  startAt: IdentifierLike | undefined | null,
  startAtIncluded: boolean,
  blockTimeMs: bigint | undefined | null,
  platformVersion: PlatformVersionLike,
  metadataTimeMs?: bigint
): VerifiedDocuments {
  const result = dppProvider.dpp.verifyDocumentsProof(
    proof,
    contract._rawDataContract,
    documentTypeName,
    valueToDynamicValue(whereClauses),
    orderBy ?? [],
    limit,
    startAt != null ? prepareIdentifierValue(startAt) : undefined,
    startAtIncluded,
    blockTimeMs?.toString(),
    valueToDynamicValue(platformVersion),
    metadataTimeMs?.toString()
  )

  return {
    rootHash: result.rootHash,
    documents: result.documents.map(DocumentWASM.createFromRawInstance)
  }
}
