import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** An identity's status on the requested moderation lists of a contract **/
export function verifyContractModerationStatusProof(proof, contractId, identityId, lists, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractModerationStatusProof(proof, prepareIdentifierValue(contractId), prepareIdentifierValue(identityId), valueToDynamicValue(lists), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
