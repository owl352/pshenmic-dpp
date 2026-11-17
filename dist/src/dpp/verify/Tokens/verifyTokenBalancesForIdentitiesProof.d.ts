import { IdentifierLike, PlatformVersionLike, VerifiedTokenBalancesForIdentities } from '../../types.js';
export declare function verifyTokenBalancesForIdentitiesProof(proof: Uint8Array, tokenId: IdentifierLike, isProofSubset: boolean, identitiesIds: IdentifierLike[], platformVersion: PlatformVersionLike): VerifiedTokenBalancesForIdentities;
