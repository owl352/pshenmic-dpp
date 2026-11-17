import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyMostRecentShieldedAnchorProof(proof, verifySubsetOfProof, platformVersion, tokenId) {
    const result = dppProvider.dpp.verifyMostRecentShieldedAnchorProof(proof, verifySubsetOfProof, valueToDynamicValue(platformVersion), tokenId != null ? prepareIdentifierValue(tokenId) : undefined);
    return {
        rootHash: result.rootHash,
        anchor: result.anchor ?? undefined
    };
}
