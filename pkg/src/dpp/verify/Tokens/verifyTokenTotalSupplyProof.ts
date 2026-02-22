import { dppProvider } from '../../provider.js'
import { IdentifierLike, PlatformVersionLike, VerifiedTokenTotalSupply } from '../../types.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js'

export function verifyTokenTotalSupplyProof (
  proof: Uint8Array,
  tokenId: IdentifierLike,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedTokenTotalSupply {
  const result = dppProvider.dpp.verifyTokenTotalSupplyProof(
    proof,
    prepareIdentifierValue(tokenId),
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    totalBalance: {
      tokenSupply: BigInt(result.totalBalance.tokenSupply),
      aggregatedTokenAccountBalances: BigInt(result.totalBalance.aggregatedTokenAccountBalances)
    }
  }
}
