import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedMostRecentShieldedAnchor } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyMostRecentShieldedAnchorProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike,
  tokenId?: IdentifierLike | null
): VerifiedMostRecentShieldedAnchor {
  const result = dppProvider.dpp.verifyMostRecentShieldedAnchorProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion),
    tokenId != null ? prepareIdentifierValue(tokenId) : undefined
  )

  return {
    rootHash: result.rootHash,
    anchor: result.anchor ?? undefined
  }
}
