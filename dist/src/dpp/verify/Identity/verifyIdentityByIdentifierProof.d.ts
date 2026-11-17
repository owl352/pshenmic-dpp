import { IdentifierLike, PlatformVersionLike, VerifiedIdentityByIdentifier } from '../../types.js';
export declare function verifyIdentityByIdentifierProof(proof: Uint8Array, identityId: IdentifierLike, isProofSubset: boolean, platformVersion: PlatformVersionLike): VerifiedIdentityByIdentifier;
