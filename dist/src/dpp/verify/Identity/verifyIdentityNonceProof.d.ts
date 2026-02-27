import { IdentifierLike, PlatformVersionLike, VerifiedIdentityNonce } from '../../types.js';
export declare function verifyIdentityNonceProof(proof: Uint8Array, identityId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedIdentityNonce;
