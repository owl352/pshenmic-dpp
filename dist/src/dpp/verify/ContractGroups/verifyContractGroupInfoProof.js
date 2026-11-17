import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** The registration of a contract group, null when there is none **/
export function verifyContractGroupInfoProof(proof, contractGroupId, platformVersion) {
    const result = dppProvider.dpp.verifyContractGroupInfoProof(proof, prepareIdentifierValue(contractGroupId), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
