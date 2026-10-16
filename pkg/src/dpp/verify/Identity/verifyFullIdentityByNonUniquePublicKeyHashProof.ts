import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedFullIdentityByNonUniquePublicKeyHash } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentityWASM } from '../../structs/Identity.js'

/** Verifies the single v5 `getIdentityByNonUniquePublicKeyHash` proof and returns the full identity. `queryPlatformVersion` is the version the node built the query with (the response's protocol version) **/
export function verifyFullIdentityByNonUniquePublicKeyHashProof (
  proof: Uint8Array,
  publicKeyHash: Uint8Array,
  after: IdentifierLike | undefined | null,
  queryPlatformVersion: PlatformVersionLike,
  platformVersion: PlatformVersionLike
): VerifiedFullIdentityByNonUniquePublicKeyHash {
  const result = dppProvider.dpp.verifyFullIdentityByNonUniquePublicKeyHashProof(
    proof,
    publicKeyHash,
    after != null ? prepareIdentifierValue(after) : undefined,
    valueToDynamicValue(queryPlatformVersion),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    identity: result.identity != null ? IdentityWASM.createFromRawInstance(result.identity) : undefined
  }
}
