import { BlockInfo, PlatformVersionLike, VerifiedStateTransitionResult } from '../../types.js';
import { StateTransitionWASM } from '../../structs/StateTransition.js';
import { DataContractWASM } from '../../structs/DataContract.js';
export declare function verifyStateTransitionResult(proof: Uint8Array, stateTransition: StateTransitionWASM, blockInfo: BlockInfo, knownContractsArray: DataContractWASM[], platformVersion: PlatformVersionLike): VerifiedStateTransitionResult;
