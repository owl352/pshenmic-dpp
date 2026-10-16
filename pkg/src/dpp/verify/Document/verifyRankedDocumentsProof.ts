import { dppProvider } from '../../provider.js'
import { AggregateDocumentsQuery, PlatformVersionLike, ProvenRankedPage, VerifiedProof } from '../../types.js'
import { plainProofValue, valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../../structs/DataContract.js'

/**
 * Verifies a ranked (top-k) query: the groups of `groupBy` ranked by `select`'s aggregate.
 * `orderBy` orders by the aggregate itself: `[['$count' | '$sum' | '$avg', 'desc' | 'asc']]`.
 * The contract needs a ranked index (meta-schema v3). `metadataTimeMs` (the timeMs of the response metadata) resolves `IN_TIME_RANGE` selections
 **/
export function verifyRankedDocumentsProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  query: AggregateDocumentsQuery,
  platformVersion: PlatformVersionLike,
  metadataTimeMs?: bigint
): VerifiedProof<ProvenRankedPage> {
  const result = dppProvider.dpp.verifyRankedDocumentsProof(
    proof,
    contract._rawDataContract,
    query.documentTypeName,
    valueToDynamicValue(query.where),
    query.orderBy ?? [],
    valueToDynamicValue(query.select),
    query.groupBy,
    query.limit,
    query.offset,
    valueToDynamicValue(platformVersion),
    metadataTimeMs?.toString()
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
