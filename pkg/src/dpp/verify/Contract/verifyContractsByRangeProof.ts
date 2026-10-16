import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedContractsByRange } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'
import { DataContractWASM } from '../../structs/DataContract.js'

/** A page of the contracts tree in id order; with `idsOnly` no contract is returned **/
export function verifyContractsByRangeProof (
  proof: Uint8Array,
  startAt: IdentifierLike | undefined,
  startAtIncluded: boolean,
  limit: number,
  idsOnly: boolean,
  platformVersion: PlatformVersionLike
): VerifiedContractsByRange {
  const result = dppProvider.dpp.verifyContractsByRangeProof(
    proof,
    startAt != null ? prepareIdentifierValue(startAt) : undefined,
    startAtIncluded,
    limit,
    idsOnly,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    contracts: result.contracts.map(contract => ({
      id: IdentifierWASM.createFromRawInstance(contract.id),
      dataContract: contract.dataContract != null ? DataContractWASM.createFromRawInstance(contract.dataContract) : undefined
    }))
  }
}
