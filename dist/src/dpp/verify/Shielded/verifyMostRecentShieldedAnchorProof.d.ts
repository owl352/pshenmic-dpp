import { IdentifierLike, PlatformVersionLike, VerifiedMostRecentShieldedAnchor } from '../../types.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export declare function verifyMostRecentShieldedAnchorProof(proof: Uint8Array, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike, tokenId?: IdentifierLike | null): VerifiedMostRecentShieldedAnchor;
