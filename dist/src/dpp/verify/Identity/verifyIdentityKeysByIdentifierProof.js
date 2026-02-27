import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
import { PartialIdentityWASM } from '../../structs/PartialIdentity.js';
export function verifyIdentityKeysByIdentifierProof(proof, identityId, specificKeyIds, withRevision, withBalance, isProofSubset, limit, offset, platformVersion) {
    const result = dppProvider.dpp.verifyIdentityKeysByIdentifierProof(proof, prepareIdentifierValue(identityId), specificKeyIds, withRevision, withBalance, isProofSubset, limit, offset, valueToDynamicValue(platformVersion));
    return {
        rootHash: result.rootHash,
        identity: result.identity != null ? PartialIdentityWASM.createFromRawInstance(result.identity) : undefined
    };
}
