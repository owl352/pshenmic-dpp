import type { PlatformVersionNAPI, ShieldFromAssetLockTransitionNAPI } from '../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { PlatformAddressLike } from '../../types.js';
import { StateTransitionWASM } from '../StateTransition.js';
export declare class ShieldFromAssetLockTransitionWASM {
    /** @private **/
    _rawShieldFromAssetLockTransition: ShieldFromAssetLockTransitionNAPI;
    constructor(assetLockProof: AssetLockProofWASM, actions: SerializedActionWASM[], valueBalance: bigint, anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array, surplusOutput?: PlatformAddressLike);
    get assetLockProof(): AssetLockProofWASM;
    set assetLockProof(value: AssetLockProofWASM);
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
    get surplusOutput(): PlatformAddressWASM | undefined;
    set surplusOutput(value: PlatformAddressLike | undefined);
    get signature(): Uint8Array;
    set signature(value: Uint8Array);
    static computeMinimumFee(numActions: number, platformVersion?: PlatformVersionNAPI): bigint;
    toStateTransition(): StateTransitionWASM;
    static fromStateTransition(st: StateTransitionWASM): ShieldFromAssetLockTransitionWASM;
    static createFromRawInstance(rawInstance: ShieldFromAssetLockTransitionNAPI): ShieldFromAssetLockTransitionWASM;
}
