import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentityKeysByIdentifier } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js'

export function verifyIdentityKeysByIdentifierProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  specificKeyIds: number[] | undefined | null,
  withRevision: boolean,
  withBalance: boolean,
  isProofSubset: boolean,
  limit: number | undefined | null,
  offset: number | undefined | null,
  platformVersion: PlatformVersionLike
): VerifiedIdentityKeysByIdentifier {
  const result = dppProvider.dpp.verifyIdentityKeysByIdentifierProof(
    proof,
    prepareIdentifierValue(identityId),
    specificKeyIds,
    withRevision,
    withBalance,
    isProofSubset,
    limit,
    offset,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    identity: result.identity != null ? PartialIdentityWASM.createFromRawInstance(result.identity) : undefined
  }
}
