import { ContractModerationListName, IdentifierLike, PlatformVersionLike, ProvenModerationListStatus, VerifiedProof } from '../../types.js';
/** An identity's status on the requested moderation lists of a contract **/
export declare function verifyContractModerationStatusProof(proof: Uint8Array, contractId: IdentifierLike, identityId: IdentifierLike, lists: ContractModerationListName[], verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenModerationListStatus[]>;
