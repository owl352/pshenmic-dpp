import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedShieldedNullifiers } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyShieldedNullifiersProof (
  proof: Uint8Array,
  nullifiers: Uint8Array[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedShieldedNullifiers {
  const result = dppProvider.dpp.verifyShieldedNullifiersProof(
    proof,
    nullifiers,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    nullifiers: result.nullifiers.map((nullifier) => ({
      nullifier: nullifier.nullifier,
      isSpent: nullifier.isSpent
    }))
  }
}