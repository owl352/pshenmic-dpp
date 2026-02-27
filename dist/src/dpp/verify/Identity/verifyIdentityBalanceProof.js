import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
export function verifyIdentityBalanceProof(proof, identityId, verifySubsetOfProof, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityBalanceProof(proof, prepareIdentifierValue(identityId), verifySubsetOfProof, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        balance: result.balance != null ? BigInt(result.balance) : undefined
    };
}
