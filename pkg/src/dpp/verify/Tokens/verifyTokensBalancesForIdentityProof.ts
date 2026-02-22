import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedTokensBalancesForIdentity } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'
import { IdentifierWASM } from '../../structs/Identifier.js'

export function verifyTokensBalancesForIdentityProof (
  proof: Uint8Array,
  tokenIds: IdentifierLike[],
  identityId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedTokensBalancesForIdentity {
  const result = dppProvider.dpp.verifyTokensBalancesForIdentityProof(
    proof,
    tokenIds.map(prepareIdentifierValue),
    prepareIdentifierValue(identityId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    balances: result.balances.map(balance => ({
      balance: BigInt(balance.balance),
      id: IdentifierWASM.createFromRawInstance(balance.id)
    }))
  }
}
