import { IdentifierLike, PlatformVersionLike, VerifiedIdentityBalanceRootHash } from '../../types.js';
export declare function verifyIdentityBalanceProof(proof: Uint8Array, identityId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedIdentityBalanceRootHash;
