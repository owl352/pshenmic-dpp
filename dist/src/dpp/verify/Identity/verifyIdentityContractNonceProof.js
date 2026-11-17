import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export function verifyIdentityContractNonceProof(proof, identityId, contractId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityContractNonceProof(proof, prepareIdentifierValue(identityId), prepareIdentifierValue(contractId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        contractNonce: result.contractNonce != null ? BigInt(result.contractNonce) : undefined
    };
}
