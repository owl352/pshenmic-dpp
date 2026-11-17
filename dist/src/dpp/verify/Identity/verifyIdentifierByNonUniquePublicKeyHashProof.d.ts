import { IdentifierLike, PlatformVersionLike, VerifiedIdentifierByNonUniquePublicKeyHash } from '../../types.js';
export declare function verifyIdentifierByNonUniquePublicKeyHashProof(proof: Uint8Array, proofSubset: boolean, publicKeyHash: Uint8Array, after: IdentifierLike | undefined | null, platformVersion: PlatformVersionLike): VerifiedIdentifierByNonUniquePublicKeyHash;
