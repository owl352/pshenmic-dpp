import { ContractModerationListName, IdentifierLike, PlatformVersionLike, ProvenModerationEntry, VerifiedProof } from '../../types.js';
/** A page of one of a contract's moderation lists **/
export declare function verifyContractModerationEntriesProof(proof: Uint8Array, contractId: IdentifierLike, list: ContractModerationListName, startAfter: IdentifierLike | undefined, limit: number, platformVersion: PlatformVersionLike): VerifiedProof<ProvenModerationEntry[]>;
