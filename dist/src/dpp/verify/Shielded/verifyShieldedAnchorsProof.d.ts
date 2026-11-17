import { IdentifierLike, PlatformVersionLike, VerifiedShieldedAnchors } from '../../types.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export declare function verifyShieldedAnchorsProof(proof: Uint8Array, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike, tokenId?: IdentifierLike | null): VerifiedShieldedAnchors;
