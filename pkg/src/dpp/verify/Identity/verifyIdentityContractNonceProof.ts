import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedIdentityContractNonce } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

export function verifyIdentityContractNonceProof (
  proof: Uint8Array,
  identityId: IdentifierLike,
  contractId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedIdentityContractNonce {
  const result = dppProvider.dpp.verifyIdentityContractNonceProof(
    proof,
    prepareIdentifierValue(identityId),
    prepareIdentifierValue(contractId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    contractNonce: result.contractNonce != null ? BigInt(result.contractNonce) : undefined
  }
}
