import { PlatformVersionLike, StartAt, VerifiedVoteState, VoteStateResultTypeLike } from '../../types.js';
import { DataContractWASM } from '../../structs/DataContract.js';
export declare function verifyVotePollVoteStateProof(proof: Uint8Array, contract: DataContractWASM, documentTypeName: string, indexName: string, indexValues: Uint8Array[], resultType: VoteStateResultTypeLike, allowIncludeLockedAndAbstainingVoteTally: boolean, count: number | undefined, startAt: StartAt | undefined, platformVersion: PlatformVersionLike): VerifiedVoteState;
