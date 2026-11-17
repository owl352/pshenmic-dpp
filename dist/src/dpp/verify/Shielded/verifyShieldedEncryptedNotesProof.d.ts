import { IdentifierLike, PlatformVersionLike, VerifiedShieldedEncryptedNotes } from '../../types.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export declare function verifyShieldedEncryptedNotesProof(proof: Uint8Array, startIndex: bigint, count: number, maxElements: number, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike, tokenId?: IdentifierLike | null): VerifiedShieldedEncryptedNotes;
