import { dppProvider } from '../../provider.js'
import { PlatformVersionLike, VerifiedEpochsInfo } from '../../types.js'
import { valueToDynamicValue } from '../../utils.js'

export function verifyEpochsInfoProof (
  proof: Uint8Array,
  currentEpoch: number,
  startEpoch: number | undefined,
  count: number,
  ascending: boolean,
  platformVersion: PlatformVersionLike
): VerifiedEpochsInfo {
  const result = dppProvider.dpp.verifyEpochsInfoProof(
    proof,
    currentEpoch,
    startEpoch,
    count,
    ascending ?? false,
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: result.rootHash,
    epochsInfo: result.epochsInfo.map(info => ({
      index: info.index,
      firstBlockTime: BigInt(info.firstBlockTime),
      firstBlockHeight: BigInt(info.firstBlockHeight),
      firstCoreBlockHeight: info.firstCoreBlockHeight,
      feeMultiplierPermille: BigInt(info.feeMultiplierPermille),
      protocolVersion: info.protocolVersion
    }))
  }
}
