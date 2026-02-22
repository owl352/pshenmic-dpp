import { dppProvider } from '../../provider.js'
import {
  BlockInfo,
  PlatformVersionLike,
  VerifiedStateTransitionResult
} from '../../types.js'
import { StateTransitionWASM } from '../../structs/StateTransition.js'
import { DataContractWASM } from '../../structs/DataContract.js'
import { valueToDynamicValue } from '../../utils.js'
import { convertResult } from './utils.js'

export function verifyStateTransitionResult (
  proof: Uint8Array,
  stateTransition: StateTransitionWASM,
  blockInfo: BlockInfo,
  knownContractsArray: DataContractWASM[],
  platformVersion: PlatformVersionLike
): VerifiedStateTransitionResult {
  const verified = dppProvider.dpp.verifyStateTransitionResult(
    proof,
    stateTransition._rawStateTransition,
    new dppProvider.dpp.BlockInfoNAPI(
      blockInfo.timeMs.toString(),
      blockInfo.height.toString(),
      blockInfo.coreHeight,
      blockInfo.epoch
    ),
    knownContractsArray.map(contract => contract._rawDataContract),
    valueToDynamicValue(platformVersion)
  )

  return {
    rootHash: verified.rootHash,
    result: convertResult(verified.result)
  }
}
