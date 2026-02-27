import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { IdentifierWASM } from '../../structs/Identifier.js';
export function verifyIdentifierByNonUniquePublicKeyHashProof(proof, proofSubset, publicKeyHash, after, platformVersion) {
    const result = dppProvider.dpp.verifyIdentifierByNonUniquePublicKeyHashProof(proof, proofSubset, publicKeyHash, after != null ? prepareIdentifierValue(after) : undefined, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        identifier: result.identifier != null ? IdentifierWASM.createFromRawInstance(result.identifier) : undefined
    };
}
