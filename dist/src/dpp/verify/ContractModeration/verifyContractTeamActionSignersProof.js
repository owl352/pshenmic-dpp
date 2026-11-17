import { dppProvider } from '../../provider.js';
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js';
/** The members who approved a contract team action **/
export function verifyContractTeamActionSignersProof(proof, contractId, status, actionId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractTeamActionSignersProof(proof, prepareIdentifierValue(contractId), valueToDynamicValue(status), prepareIdentifierValue(actionId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: valueFromDynamicValue(result.value).map(identifierFromBytes)
    };
}
