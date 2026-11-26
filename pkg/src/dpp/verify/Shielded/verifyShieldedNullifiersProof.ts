import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedShieldedNullifiers } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedNullifiersProof (
  proof: Uint8Array,
  nullifiers: Uint8Array[],
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike,
  tokenId?: IdentifierLike | null
): VerifiedShieldedNullifiers {
  const result = dppProvider.dpp.verifyShieldedNullifiersProof(
    proof,
    nullifiers,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion),
    tokenId != null ? prepareIdentifierValue(tokenId) : undefined
  )

  return {
    rootHash: result.rootHash,
    nullifiers: result.nullifiers.map((nullifier) => ({
      nullifier: nullifier.nullifier,
      isSpent: nullifier.isSpent
    }))
  }
}
