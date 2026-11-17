import { IdentifierLike, PlatformVersionLike, VerifiedContract } from '../../types.js';
export declare function verifyContractProof(proof: Uint8Array, contractKnownKeepsHistory: boolean | undefined, isProofSubset: boolean, inMultipleContractProofForm: boolean, contractId: IdentifierLike, platformVersion: PlatformVersionLike): VerifiedContract;
