import { IdentifierLike, PlatformVersionLike, ProvenContractGroupInfo, VerifiedProof } from '../../types.js';
/** The registration of a contract group, null when there is none **/
export declare function verifyContractGroupInfoProof(proof: Uint8Array, contractGroupId: IdentifierLike, platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractGroupInfo | null>;
