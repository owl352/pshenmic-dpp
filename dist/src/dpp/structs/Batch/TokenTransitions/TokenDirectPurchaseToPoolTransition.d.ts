import type { TokenDirectPurchaseToPoolTransitionNAPI } from '../../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Buys tokens at their direct purchase price into the token shielded pool **/
export declare class TokenDirectPurchaseToPoolTransitionWASM {
    /** @private **/
    _rawTransition: TokenDirectPurchaseToPoolTransitionNAPI;
    constructor(base: TokenBaseTransitionWASM, tokenCount: bigint, totalAgreedPrice: bigint, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingSignature: Uint8Array);
    get base(): TokenBaseTransitionWASM;
    set base(value: TokenBaseTransitionWASM);
    get tokenCount(): bigint;
    set tokenCount(value: bigint);
    get totalAgreedPrice(): bigint;
    set totalAgreedPrice(value: bigint);
    get actions(): SerializedActionWASM[];
    set actions(value: SerializedActionWASM[]);
    get anchor(): Uint8Array;
    set anchor(value: Uint8Array);
    get proof(): Uint8Array;
    set proof(value: Uint8Array);
    get bindingsSignature(): Uint8Array;
    set bindingsSignature(value: Uint8Array);
    static createFromRawInstance(rawInstance: TokenDirectPurchaseToPoolTransitionNAPI): TokenDirectPurchaseToPoolTransitionWASM;
}
