import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** A page of a contract's active or closed team actions **/
export function verifyContractTeamActionsProof(proof, contractId, status, startAt, startAtIncluded, limit, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractTeamActionsProof(proof, prepareIdentifierValue(contractId), valueToDynamicValue(status), startAt != null ? prepareIdentifierValue(startAt) : undefined, startAtIncluded, limit, verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
