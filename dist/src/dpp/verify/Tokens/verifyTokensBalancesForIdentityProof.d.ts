import { IdentifierLike, PlatformVersionLike, VerifiedTokensBalancesForIdentity } from '../../types.js';
export declare function verifyTokensBalancesForIdentityProof(proof: Uint8Array, tokenIds: IdentifierLike[], identityId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedTokensBalancesForIdentity;
