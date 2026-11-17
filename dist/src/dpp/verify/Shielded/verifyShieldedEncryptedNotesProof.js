import { dppProvider } from '../../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../../utils.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export function verifyShieldedEncryptedNotesProof(proof, startIndex, count, maxElements, verifySubsetOfProof, platformVersion, tokenId) {
    const result = dppProvider.dpp.verifyShieldedEncryptedNotesProof(proof, startIndex.toString(), count, maxElements, verifySubsetOfProof, valueToDynamicValue(platformVersion), tokenId != null ? prepareIdentifierValue(tokenId) : undefined);
    return {
        rootHash: result.rootHash,
        notes: result.notes.map((note) => ({
            cmx: note.cmx,
            nullifier: note.nullifier,
            cvNet: note.cvNet,
            encryptedNote: note.encryptedNote
        })),
        totalCount: BigInt(result.totalCount)
    };
}
