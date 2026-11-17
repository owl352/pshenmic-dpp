import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** Whether a member's approval of a contract team action is proven, with the action's status **/
export function verifyContractTeamActionSignatureProof(proof, contractId, actionId, signerId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractTeamActionSignatureProof(proof, prepareIdentifierValue(contractId), prepareIdentifierValue(actionId), prepareIdentifierValue(signerId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
