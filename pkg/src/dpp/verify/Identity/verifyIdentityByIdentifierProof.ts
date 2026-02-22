import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentityByIdentifier } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentityWASM } from '../../structs/Identity.js'

export function verifyIdentityByIdentifierProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  isProofSubset: boolean,
  platformVersion: PlatformVersionLike
): VerifiedIdentityByIdentifier {
  const result = dppProvider.dpp.verifyIdentityByIdentifierProof(
    proof,
    prepareIdentifierValue(identityId),
    isProofSubset,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    identity: result.identity != null ? IdentityWASM.createFromRawInstance(result.identity) : undefined
  }
}
