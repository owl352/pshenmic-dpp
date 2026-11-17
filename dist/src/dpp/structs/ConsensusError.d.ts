import type { ConsensusErrorNAPI } from '../../../binaries/bindingsTypes.js';
export declare class ConsensusErrorWASM {
    /** @private **/
    _rawConsensusError: ConsensusErrorNAPI;
    private constructor();
    static deserialize(error: Uint8Array): ConsensusErrorWASM;
    get message(): string;
}
