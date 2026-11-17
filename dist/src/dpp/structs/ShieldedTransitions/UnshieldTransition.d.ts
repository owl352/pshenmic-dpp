import type { PlatformVersionNAPI, UnshieldTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { PlatformAddressLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class UnshieldTransitionWASM {
    /** @private **/
    _rawUnshieldTransition: UnshieldTransitionNAPI;
    constructor(outputAddress: PlatformAddressLike, actions: SerializedActionWASM[], unshieldingAmount: bigint, anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array);
    get outputAddress(): PlatformAddressWASM;
    set outputAddress(value: PlatformAddressLike);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get unshieldingAmount(): bigint;
    set unshieldingAmount(value: bigint);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static computeMinimumFee(numActions: number, platformVersion?: PlatformVersionNAPI): bigint;
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): UnshieldTransitionWASM;
    static createFromRawInstance(rawInstance: UnshieldTransitionNAPI): UnshieldTransitionWASM;
}
