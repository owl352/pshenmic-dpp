import { dppProvider } from '../../provider.js';
import { plainProofValue, prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** The credits in a contract's fee pots and their last claims **/
export function verifyContractFeePotsProof(proof, contractId, pots, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyContractFeePotsProof(proof, prepareIdentifierValue(contractId), pots.map(valueToDynamicValue), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        value: plainProofValue(result.value)
    };
}
