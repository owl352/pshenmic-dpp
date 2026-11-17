import { dppProvider } from '../../provider.js';
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js';
/** The spend bundle paying a document's token cost out of the token's shielded pool **/
export class TokenShieldedPaymentWASM {
    /** @private **/
    _rawTokenShieldedPayment;
    constructor(amount, actions, anchor, proof, bindingsSignature) {
        this._rawTokenShieldedPayment = new dppProvider.dpp.TokenShieldedPaymentNAPI(amount.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingsSignature);
    }
    bytes() {
        return this._rawTokenShieldedPayment.bytes();
    }
    static fromBytes(bytes) {
        return TokenShieldedPaymentWASM.createFromRawInstance(dppProvider.dpp.TokenShieldedPaymentNAPI.fromBytes(bytes));
    }
    get amount() {
        return BigInt(this._rawTokenShieldedPayment.amount);
    }
    set amount(value) {
        this._rawTokenShieldedPayment.amount = value.toString();
    }
    get actions() {
        return this._rawTokenShieldedPayment.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawTokenShieldedPayment.actions = value.map(a => a._rawSerializedAction);
    }
    get anchor() {
        return this._rawTokenShieldedPayment.anchor;
    }
    set anchor(value) {
        this._rawTokenShieldedPayment.anchor = value;
    }
    get proof() {
        return this._rawTokenShieldedPayment.proof;
    }
    set proof(value) {
        this._rawTokenShieldedPayment.proof = value;
    }
    get bindingsSignature() {
        return this._rawTokenShieldedPayment.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawTokenShieldedPayment.bindingsSignature = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenShieldedPaymentWASM.prototype);
        instance._rawTokenShieldedPayment = rawInstance;
        return instance;
    }
}
