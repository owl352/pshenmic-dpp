import { GroupActionStatusName, IdentifierLike, PlatformVersionLike, VerifiedProof } from '../../types.js';
/** Whether a member's approval of a contract team action is proven, with the action's status **/
export declare function verifyContractTeamActionSignatureProof(proof: Uint8Array, contractId: IdentifierLike, actionId: IdentifierLike, signerId: IdentifierLike, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<GroupActionStatusName>;
