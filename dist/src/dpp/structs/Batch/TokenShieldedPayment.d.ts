import type { TokenShieldedPaymentNAPI } from '../../../../binaries/bindingsTypes.js';
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js';
/** The spend bundle paying a document's token cost out of the token's shielded pool **/
export declare class TokenShieldedPaymentWASM {
    /** @private **/
    _rawTokenShieldedPayment: TokenShieldedPaymentNAPI;
    constructor(amount: bigint, actions: SerializedActionWASM[], anchor: Uint8Array, proof: Uint8Array, bindingsSignature: Uint8Array);
    bytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): TokenShieldedPaymentWASM;
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
    static createFromRawInstance(rawInstance: TokenShieldedPaymentNAPI): TokenShieldedPaymentWASM;
}
