import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedFullIdentityByNonUniquePublicKeyHash } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentityWASM } from '../../structs/Identity.js'

/** Verifies the two v5 `getIdentityByNonUniquePublicKeyHash` V0 proofs (the non-unique index proof and the full identity proof) and returns the full identity. `identityProof` is absent when nothing was found. `queryPlatformVersion` is the version the node built the query with (the response's protocol version) **/
export function verifyFullIdentityByNonUniquePublicKeyHashTwoProofs (
  indexProof: Uint8Array,
  identityProof: Uint8Array | undefined | null,
  publicKeyHash: Uint8Array,
  after: IdentifierLike | undefined | null,
  queryPlatformVersion: PlatformVersionLike,
  platformVersion: PlatformVersionLike
): VerifiedFullIdentityByNonUniquePublicKeyHash {
  const result = dppProvider.dpp.verifyFullIdentityByNonUniquePublicKeyHashTwoProofs(
    indexProof,
    identityProof ?? undefined,
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
