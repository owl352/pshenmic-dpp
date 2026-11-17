import type { TokenShieldTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Moves tokens from the owner balance into the token shielded pool **/
export declare class TokenShieldTransitionWASM {
    /** @private **/
    _rawTransition: TokenShieldTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, amount: bigint, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get amount(): bigint;
    set amount(value: bigint);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static createFromRawInstance(rawInstance: TokenShieldTransitionNAPI): TokenShieldTransitionWASM;
}
