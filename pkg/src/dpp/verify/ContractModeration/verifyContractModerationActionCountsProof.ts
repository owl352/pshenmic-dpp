import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, ProvenModeratorActionCount, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** How many moderation actions each moderator of a contract took **/
export function verifyContractModerationActionCountsProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenModeratorActionCount[]> {
  const result = dppProvider.dpp.verifyContractModerationActionCountsProof(
    proof,
    prepareIdentifierValue(contractId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
