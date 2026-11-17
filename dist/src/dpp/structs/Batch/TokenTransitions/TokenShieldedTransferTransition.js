import { dppProvider } from '../../../../dpp/provider.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Transfers tokens inside the token shielded pool **/
export class TokenShieldedTransferTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, actions, anchor, proof, bindingSignature) {
        this._rawTransition = new dppProvider.dpp.TokenShieldedTransferTransitionNAPI(base._rawTokenBaseTransition, actions.map(a => a._rawSerializedAction), anchor, proof, bindingSignature);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
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
        const instance = Object.create(TokenShieldedTransferTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
