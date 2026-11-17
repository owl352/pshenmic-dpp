import type { PlatformVersionNAPI, ShieldedTransferTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class ShieldedTransferTransitionWASM {
    /** @private **/
    _rawShieldedTransferTransition: ShieldedTransferTransitionNAPI;
    constructor(actions: SerializedActionWASM[], valueBalance: bigint, anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get valueBalance(): bigint;
    set valueBalance(value: bigint);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static computeMinimumFee(numActions: number, platformVersion?: PlatformVersionNAPI): bigint;
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): ShieldedTransferTransitionWASM;
    static createFromRawInstance(rawInstance: ShieldedTransferTransitionNAPI): ShieldedTransferTransitionWASM;
}
