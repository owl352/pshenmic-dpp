import { ContractFeePotLike, IdentifierLike, PlatformVersionLike, ProvenContractFeePots, VerifiedProof } from '../../types.js';
/** The credits in a contract's fee pots and their last claims **/
export declare function verifyContractFeePotsProof(proof: Uint8Array, contractId: IdentifierLike, pots: ContractFeePotLike[], verifySubsetOfProof: boolean, platformVersion: PlatformVersionLike): VerifiedProof<ProvenContractFeePots>;
