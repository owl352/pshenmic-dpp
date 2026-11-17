import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** A page of one of a contract's moderation lists **/
export function verifyContractModerationEntriesProof(proof, contractId, list, startAfter, limit, platformVersion) {
    const result = dppProvider.dpp.verifyContractModerationEntriesProof(proof, prepareIdentifierValue(contractId), valueToDynamicValue(list), startAfter != null ? prepareIdentifierValue(startAfter) : undefined, limit, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
