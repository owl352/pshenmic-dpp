import { dppProvider } from '../../../../dpp/provider.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Buys tokens at their direct purchase price into the token shielded pool **/
export class TokenDirectPurchaseToPoolTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, tokenCount, totalAgreedPrice, actions, anchor, proof, bindingSignature) {
        this._rawTransition = new dppProvider.dpp.TokenDirectPurchaseToPoolTransitionNAPI(base._rawTokenBaseTransition, tokenCount.toString(), totalAgreedPrice.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingSignature);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get tokenCount() {
        return BigInt(this._rawTransition.tokenCount);
    }
    set tokenCount(value) {
        this._rawTransition.tokenCount = value.toString();
    }
    get totalAgreedPrice() {
        return BigInt(this._rawTransition.totalAgreedPrice);
    }
    set totalAgreedPrice(value) {
        this._rawTransition.totalAgreedPrice = value.toString();
    }
    get actions() {
        return this._rawTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get anchor() {
        return this._rawTransition.anchor;
    }
    set anchor(value) {
        this._rawTransition.anchor = value;
    }
    get proof() {
        return this._rawTransition.proof;
    }
    set proof(value) {
        this._rawTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawTransition.bindingsSignature = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenDirectPurchaseToPoolTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
