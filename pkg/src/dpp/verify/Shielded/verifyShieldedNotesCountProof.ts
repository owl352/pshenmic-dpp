import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedShieldedNotesCount } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyShieldedNotesCountProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedShieldedNotesCount {
  const result = dppProvider.dpp.verifyShieldedNotesCountProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    count: result.count != null ? BigInt(result.count) : undefined
  }
}