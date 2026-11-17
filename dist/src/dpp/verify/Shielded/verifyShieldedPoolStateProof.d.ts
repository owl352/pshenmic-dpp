import { IdentifierLike, PlatformVersionLike, VerifiedShieldedPoolState } from '../../types.js';
/** `tokenId` selects that token's shielded pool; without it the credits pool is verified **/
export declare function verifyShieldedPoolStateProof(proof: Uint8Array, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike, tokenId?: IdentifierLike | null): VerifiedShieldedPoolState;
