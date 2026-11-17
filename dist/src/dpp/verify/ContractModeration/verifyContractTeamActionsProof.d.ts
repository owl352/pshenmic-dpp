import { GroupActionStatusLike, IdentifierLike, PlatformVersionLike, ProvenContractTeamAction, VerifiedProof } from '../../types.js';
/** A page of a contract's active or closed team actions **/
export declare function verifyContractTeamActionsProof(proof: Uint8Array, contractId: IdentifierLike, status: GroupActionStatusLike, startAt: IdentifierLike | undefined, startAtIncluded: boolean, limit: number, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractTeamAction[]>;
