import { IdentifierLike, PlatformVersionLike, VerifiedShieldedNullifiers } from '../../types.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export declare function verifyShieldedNullifiersProof(proof: Uint8Array, nullifiers: Uint8Array[], verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike, tokenId?: IdentifierLike | null): VerifiedShieldedNullifiers;
