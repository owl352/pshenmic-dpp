import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedNotesCountProof(proof, verifySubsetOfProof, platformVersion, tokenId) {
    const result = dppProvider.dpp.verifyShieldedNotesCountProof(proof, verifySubsetOfProof, valueToDynamicValue(platformVersion), tokenId != null ? prepareIdentifierValue(tokenId) : undefined);
    return {
        rootHash: result.rootHash,
        count: result.count != null ? BigInt(result.count) : undefined
    };
}
