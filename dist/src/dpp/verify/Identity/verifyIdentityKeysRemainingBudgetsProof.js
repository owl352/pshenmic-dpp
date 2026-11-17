import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** What is left of the budget of each requested key; `remainingBudget` is null for a key without a budget **/
export function verifyIdentityKeysRemainingBudgetsProof(proof, identityId, keyIds, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityKeysRemainingBudgetsProof(proof, prepareIdentifierValue(identityId), keyIds, verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
