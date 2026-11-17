import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { IdentityWASM } from '../../structs/Identity.js';
export function verifyIdentityByUniqueKeyHashProof(proof, publicKeyHash, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityByUniqueKeyHashProof(proof, publicKeyHash, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        identity: result.identity != null ? IdentityWASM.createFromRawInstance(result.identity) : undefined
    };
}
