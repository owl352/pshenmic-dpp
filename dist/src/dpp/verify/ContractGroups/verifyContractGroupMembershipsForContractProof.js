import { dppProvider } from '../../provider.js';
import { identifierFromBytes, prepareIdentifierValue, valueFromDynamicValue, valueToDynamicValue } from '../../utils.js';
function membershipsFromPlain(value) {
    return {
        contract: value.contract.map(identifierFromBytes),
        documentTypes: Object.fromEntries(Object.entries(value.documentTypes).map(([name, ids]) => [name, ids.map(identifierFromBytes)])),
        tokens: value.tokens.map((token) => ({
            tokenContractPosition: token.tokenContractPosition,
            contractGroupIds: token.contractGroupIds.map(identifierFromBytes)
        }))
    };
}
/** The groups a contract, each of its document types and each of its tokens belong to **/
export function verifyContractGroupMembershipsForContractProof(proof, contractId, platformVersion) {
    const result = dppProvider.dpp.verifyContractGroupMembershipsForContractProof(proof, prepareIdentifierValue(contractId), valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: membershipsFromPlain(valueFromDynamicValue(result.value))
    };
}
