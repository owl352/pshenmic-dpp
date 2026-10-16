import { dppProvider } from '../../provider.js'
import { AggregateDocumentsQuery, HavingClause, PlatformVersionLike, ProvenRankedEntry, VerifiedProof } from '../../types.js'
import { plainProofValue, valueToDynamicValue } from '../../utils.js'
import { DataContractWASM } from '../../structs/DataContract.js'

/**
 * Verifies a having-range query: the groups of `groupBy` whose aggregate falls within the
 * `having` bounds. Time-range selections are not supported
 **/
export function verifyHavingDocumentsProof (
  proof: Uint8Array,
  contract: DataContractWASM,
  query: AggregateDocumentsQuery & { having: HavingClause[] },
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenRankedEntry[]> {
  const result = dppProvider.dpp.verifyHavingDocumentsProof(
    proof,
    contract._rawDataContract,
    query.documentTypeName,
    valueToDynamicValue(query.where),
    query.orderBy ?? [],
    valueToDynamicValue(query.select),
    query.groupBy,
    valueToDynamicValue(query.having),
    query.limit,
    query.offset,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
