import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedShieldedPoolState } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyShieldedPoolStateProof (
  proof: Uint8Array,
  verifySubsetOfProof: boolean,
  platformVersion: PlatformVersionLike
): VerifiedShieldedPoolState {
  const result = dppProvider.dpp.verifyShieldedPoolStateProof(
    proof,
    verifySubsetOfProof,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    totalBalance: result.totalBalance != null ? BigInt(result.totalBalance) : undefined
  }
}