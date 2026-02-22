import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedTotalCredits } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyTotalCreditsProof (
  proof: Uint8Array,
  coreSubsidyHalvingInterval: number,
  activationCoreHeight: number,
  currentCoreHeight: number,
  platformVersion: PlatformVersionLike
): VerifiedTotalCredits {
  const result = dppProvider.dpp.verifyTotalCreditsProof(
    proof,
    coreSubsidyHalvingInterval,
    activationCoreHeight,
    currentCoreHeight,
    valueToDynamicValue(platformVersion)
  )
  return {
    rootHash: result.rootHash,
    totalCredits: BigInt(result.totalCredits)
  }
}
