import { ContractGroupMembersQuery, IdentifierLike, PlatformVersionLike, ProvenContractGroupMembers, VerifiedProof } from '../../types.js';
/** One kind of members of a contract group, paged in key order **/
export declare function verifyContractGroupMembersProof(proof: Uint8Array, contractGroupId: IdentifierLike, query: ContractGroupMembersQuery, limit: number, platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractGroupMembers>;
