import { dppProvider } from '../../provider.js'
import { GroupActionStatusName, IdentifierLike, PlatformVersionLike, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** Whether a member's approval of a contract team action is proven, with the action's status **/
export function verifyContractTeamActionSignatureProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  actionId: IdentifierLike,
  signerId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<GroupActionStatusName> {
  const result = dppProvider.dpp.verifyContractTeamActionSignatureProof(
    proof,
    prepareIdentifierValue(contractId),
    prepareIdentifierValue(actionId),
    prepareIdentifierValue(signerId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
