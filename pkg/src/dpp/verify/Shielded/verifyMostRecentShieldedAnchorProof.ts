import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedMostRecentShieldedAnchor } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyMostRecentShieldedAnchorProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedMostRecentShieldedAnchor {
  const result = dppProvider.dpp.verifyMostRecentShieldedAnchorProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    anchor: result.anchor ?? undefined
  }
}