import { dppProvider } from '../../provider.js'
import { GroupActionStatusLike, IdentifierLike, PlatformVersionLike, ProvenContractTeamAction, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** A page of a contract's active or closed team actions **/
export function verifyContractTeamActionsProof (
  proof: Uint8Array,
  contractId: IdentifierLike,
  status: GroupActionStatusLike,
  startAt: IdentifierLike | undefined,
  startAtIncluded: boolean,
  limit: number,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenContractTeamAction[]> {
  const result = dppProvider.dpp.verifyContractTeamActionsProof(
    proof,
    prepareIdentifierValue(contractId),
    valueToDynamicValue(status),
    startAt != null ? prepareIdentifierValue(startAt) : undefined,
    startAtIncluded,
    limit,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
