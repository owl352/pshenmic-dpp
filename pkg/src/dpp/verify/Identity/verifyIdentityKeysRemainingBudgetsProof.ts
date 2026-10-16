import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, ProvenKeyRemainingBudget, VerifiedProof } from '../../types.js'
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** What is left of the budget of each requested key; `remainingBudget` is null for a key without a budget **/
export function verifyIdentityKeysRemainingBudgetsProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  keyIds: number[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedProof<ProvenKeyRemainingBudget[]> {
  const result = dppProvider.dpp.verifyIdentityKeysRemainingBudgetsProof(
    proof,
    prepareIdentifierValue(identityId),
    keyIds,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    value: plainProofValue(result.value)
  }
}
