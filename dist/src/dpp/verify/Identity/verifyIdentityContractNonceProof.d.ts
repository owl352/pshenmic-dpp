import { IdentifierLike, PlatformVersionLike, VerifiedIdentityContractNonce } from '../../types.js';
export declare function verifyIdentityContractNonceProof(proof: Uint8Array, identityId: IdentifierLike, contractId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedIdentityContractNonce;
