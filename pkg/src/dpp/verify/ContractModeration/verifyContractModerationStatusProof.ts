import { dppProvider } from '../../provider.js'
import { ContractModerationListName, IdentifierLike, PlatformVersionLike, ProvenModerationListStatus, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** An identity's status on the requested moderation lists of a contract **/
export function verifyContractModerationStatusProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  identityId: IdentifierLike,
  lists: ContractModerationListName[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenModerationListStatus[]> {
  const result = dppProvider.dpp.verifyContractModerationStatusProof(
    proof,
    prepareIdentifierValue(contractId),
    prepareIdentifierValue(identityId),
    valueToDynamicValue(lists),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
