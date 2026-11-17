import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** How many moderation actions each moderator of a contract took **/
export function verifyContractModerationActionCountsProof(proof, contractId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractModerationActionCountsProof(proof, prepareIdentifierValue(contractId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
