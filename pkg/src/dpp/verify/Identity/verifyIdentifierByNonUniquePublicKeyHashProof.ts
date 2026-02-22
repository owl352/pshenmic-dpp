import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentifierByNonUniquePublicKeyHash } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

export function verifyIdentifierByNonUniquePublicKeyHashProof (
  proof: Uint8Array,
  proofSubset: boolean,
  publicKeyHash: Uint8Array,
  after: IdentifierLike | undefined | null,
  platformVersion: PlatformVersionLike
): VerifiedIdentifierByNonUniquePublicKeyHash {
  const result = dppProvider.dpp.verifyIdentifierByNonUniquePublicKeyHashProof(
    proof,
    proofSubset,
    publicKeyHash,
    after != null ? prepareIdentifierValue(after) : undefined,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    identifier: result.identifier != null ? IdentifierWASM.createFromRawInstance(result.identifier) : undefined
  }
}
