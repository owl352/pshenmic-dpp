import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export function verifyIdentityNonceProof(proof, identityId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityNonceProof(proof, prepareIdentifierValue(identityId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        nonce: result.nonce != null ? BigInt(result.nonce) : undefined
    };
}
