import { dppProvider } from '../../provider.js'
import { ContractModerationListName, IdentifierLike, PlatformVersionLike, ProvenModerationEntry, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** A page of one of a contract's moderation lists **/
export function verifyContractModerationEntriesProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  list: ContractModerationListName,
  startAfter: IdentifierLike | undefined,
  limit: number,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenModerationEntry[]> {
  const result = dppProvider.dpp.verifyContractModerationEntriesProof(
    proof,
    prepareIdentifierValue(contractId),
    valueToDynamicValue(list),
    startAfter != null ? prepareIdentifierValue(startAfter) : undefined,
    limit,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
