import type { PlatformVersionNAPI, ShieldedWithdrawalTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { PoolingLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class ShieldedWithdrawalTransitionWASM {
    /** @private **/
    _rawShieldedWithdrawalTransition: ShieldedWithdrawalTransitionNAPI;
    constructor(actions: SerializedActionWASM[], unshieldingAmount: bigint, anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array, coreFeePerByte: number, pooling: PoolingLike, outputScript: CoreScriptWASM);
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
    get coreFeePerByte(): number;
    set coreFeePerByte(value: number);
    get pooling(): string;
    set pooling(value: PoolingLike);
    get outputScript(): CoreScriptWASM;
    set outputScript(value: CoreScriptWASM);
    static computeMinimumFee(numActions: number, platformVersion?: PlatformVersionNAPI): bigint;
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): ShieldedWithdrawalTransitionWASM;
    static createFromRawInstance(rawInstance: ShieldedWithdrawalTransitionNAPI): ShieldedWithdrawalTransitionWASM;
}
