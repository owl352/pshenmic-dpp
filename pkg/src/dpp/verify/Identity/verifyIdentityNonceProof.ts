import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentityNonce } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

export function verifyIdentityNonceProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedIdentityNonce {
  const result = dppProvider.dpp.verifyIdentityNonceProof(
    proof,
    prepareIdentifierValue(identityId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    nonce: result.nonce != null ? BigInt(result.nonce) : undefined
  }
}
