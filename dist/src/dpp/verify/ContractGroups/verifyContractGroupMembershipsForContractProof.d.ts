import { IdentifierLike, PlatformVersionLike, ProvenContractGroupMemberships, VerifiedProof } from '../../types.js';
/** The groups a contract, each of its document types and each of its tokens belong to **/
export declare function verifyContractGroupMembershipsForContractProof(proof: Uint8Array, contractId: IdentifierLike, platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractGroupMemberships>;
