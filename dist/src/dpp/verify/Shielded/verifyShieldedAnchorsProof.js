import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedAnchorsProof(proof, verifySubsetOfProof, platformVersion, tokenId) {
    const result = dppProvider.dpp.verifyShieldedAnchorsProof(proof, verifySubsetOfProof, valueToDynamicValue(platformVersion), tokenId != null ? prepareIdentifierValue(tokenId) : undefined);
    return {
        rootHash: result.rootHash,
        anchors: result.anchors
    };
}
