import { IdentifierLike, PlatformVersionLike, ProvenModeratorActionCount, VerifiedProof } from '../../types.js';
/** How many moderation actions each moderator of a contract took **/
export declare function verifyContractModerationActionCountsProof(proof: Uint8Array, contractId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenModeratorActionCount[]>;
