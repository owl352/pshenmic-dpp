import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { convertResult } from './utils.js';
export function verifyStateTransitionResult(proof, stateTransition, blockInfo, knownContractsArray, platformVersion) {
    const verified = dppProvider.dpp.verifyStateTransitionResult(proof, stateTransition._rawStateTransition, new dppProvider.dpp.BlockInfoNAPI(blockInfo.timeMs.toString(), blockInfo.height.toString(), blockInfo.coreHeight, blockInfo.epoch), knownContractsArray.map(contract => contract._rawDataContract), valueToDynamicValue(platformVersion));
    return {
        rootHash: verified.rootHash,
        result: convertResult(verified.result)
    };
}
