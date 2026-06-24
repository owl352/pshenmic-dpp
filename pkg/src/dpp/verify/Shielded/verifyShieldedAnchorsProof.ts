import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedShieldedAnchors } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyShieldedAnchorsProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedShieldedAnchors {
  const result = dppProvider.dpp.verifyShieldedAnchorsProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    anchors: result.anchors
  }
}