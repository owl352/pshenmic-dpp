import {dppProvider} from '../../provider.js'
import {valueToDynamicValue} from '../../utils.js'
import {PlatformVersionLike, VerifiedFinalizedEpochsInfo} from "../../types.js";
import {IdentifierWASM} from "../../structs/Identifier.js";

export function verifyFinalizedEpochInfosProof(
  proof: Uint8Array,
  startEpoch: number,
  startEpochIncluded: boolean,
  endEpoch: number,
  endEpochIncluded: boolean,
  platformVersion: PlatformVersionLike
): VerifiedFinalizedEpochsInfo {
  const result = dppProvider.dpp.verifyFinalizedEpochInfosProof(
    proof,
    startEpoch,
    startEpochIncluded,
    endEpoch,
    endEpochIncluded,
    valueToDynamicValue(platformVersion),
  )

  return {
    rootHash: result.rootHash,
    epochInfos: result.epochInfos.map(([epochIndex, info]) => ({
      epochIndex: epochIndex,
      firstBlockTime: new Date(Number(info.firstBlockTime)),
      firstBlockHeight: BigInt(info.firstBlockHeight),
      totalBlocksInEpoch: BigInt(info.totalBlocksInEpoch),
      firstCoreBlockHeight: info.firstCoreBlockHeight,
      nextEpochStartCoreBlockHeight: info.nextEpochStartCoreBlockHeight,
      totalProcessingFees: BigInt(info.totalProcessingFees),
      totalDistributedStorageFees: BigInt(info.totalDistributedStorageFees),
      totalCreatedStorageFees: BigInt(info.totalCreatedStorageFees),
      coreBlockRewards: BigInt(info.coreBlockRewards),
      blockProposers: info.blockProposers.map(([proposer, count]) => ({
        proposer: IdentifierWASM.createFromRawInstance(proposer),
        count: BigInt(count),
      })),
      feeMultiplierPermille: BigInt(info.feeMultiplierPermille),
      protocolVersion: info.protocolVersion,
    }))
  }
}
