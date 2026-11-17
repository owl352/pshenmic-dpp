import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** The latest version of each requested contract, null for a contract that does not exist **/
export function verifyContractsVersionsProof(proof, contractIds, platformVersion) {
    const result = dppProvider.dpp.verifyContractsVersionsProof(proof, contractIds.map(prepareIdentifierValue), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
