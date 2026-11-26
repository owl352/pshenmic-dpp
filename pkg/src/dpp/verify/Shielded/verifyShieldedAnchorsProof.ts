import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedShieldedAnchors } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedAnchorsProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike,
  tokenId?: IdentifierLike | null
): VerifiedShieldedAnchors {
  const result = dppProvider.dpp.verifyShieldedAnchorsProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion),
    tokenId != null ? prepareIdentifierValue(tokenId) : undefined
  )

  return {
    rootHash: result.rootHash,
    anchors: result.anchors
  }
}
