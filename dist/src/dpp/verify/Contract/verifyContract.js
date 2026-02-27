import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { DataContractWASM } from '../../structs/DataContract.js';
export function verifyContractProof(proof, contractKnownKeepsHistory, isProofSubset, inMultipleContractProofForm, contractId, platformVersion) {
    const result = dppProvider.dpp.verifyContractProof(proof, contractKnownKeepsHistory, isProofSubset, inMultipleContractProofForm, prepareIdentifierValue(contractId), valueToDynamicValue(platformVersion));
    let dataContract;
    if (result.dataContract != null) {
        dataContract = DataContractWASM.createFromRawInstance(result.dataContract);
    }
    return {
        rootHash: result.rootHash,
        dataContract
    };
}
