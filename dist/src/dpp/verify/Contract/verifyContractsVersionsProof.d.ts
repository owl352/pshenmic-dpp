import { IdentifierLike, PlatformVersionLike, ProvenContractVersion, VerifiedProof } from '../../types.js';
/** The latest version of each requested contract, null for a contract that does not exist **/
export declare function verifyContractsVersionsProof(proof: Uint8Array, contractIds: IdentifierLike[], platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractVersion[]>;
