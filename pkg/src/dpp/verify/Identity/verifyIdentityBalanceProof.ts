import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentityBalanceRootHash } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

export function verifyIdentityBalanceProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedIdentityBalanceRootHash {
  const result = dppProvider.dpp.verifyIdentityBalanceProof(
    proof,
    prepareIdentifierValue(identityId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    balance: result.balance != null ? BigInt(result.balance) : undefined
  }
}
