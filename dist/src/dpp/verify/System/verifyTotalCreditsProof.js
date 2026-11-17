import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
export function verifyTotalCreditsProof(proof, coreSubsidyHalvingInterval, activationCoreHeight, currentCoreHeight, platformVersion) {
    const result = dppProvider.dpp.verifyTotalCreditsProof(proof, coreSubsidyHalvingInterval, activationCoreHeight, currentCoreHeight, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        totalCredits: BigInt(result.totalCredits)
    };
}
