import { ContractDocumentRemovalsSelection, IdentifierLike, PlatformVersionLike, ProvenDocumentRemovalEntry, VerifiedProof } from '../../types.js';
/** The records moderators' document deletions left under a contract, for one document type **/
export declare function verifyContractDocumentRemovalsProof(proof: Uint8Array, contractId: IdentifierLike, documentTypeName: string, selection: ContractDocumentRemovalsSelection, verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenDocumentRemovalEntry[]>;
