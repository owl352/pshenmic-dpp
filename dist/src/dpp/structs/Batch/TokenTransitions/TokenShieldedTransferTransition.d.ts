import type { TokenShieldedTransferTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Transfers tokens inside the token shielded pool **/
export declare class TokenShieldedTransferTransitionWASM {
    /** @private **/
    _rawTransition: TokenShieldedTransferTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static createFromRawInstance(rawInstance: TokenShieldedTransferTransitionNAPI): TokenShieldedTransferTransitionWASM;
}
