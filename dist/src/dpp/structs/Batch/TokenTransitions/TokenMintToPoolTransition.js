import { dppProvider } from '../../../../dpp/provider.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Mints tokens directly into the token shielded pool **/
export class TokenMintToPoolTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, amount, actions, anchor, proof, bindingSignature, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenMintToPoolTransitionNAPI(base._rawTokenBaseTransition, amount.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingSignature, publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get amount() {
        return BigInt(this._rawTransition.amount);
    }
    set amount(value) {
        this._rawTransition.amount = value.toString();
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
    get publicNote() {
        return this._rawTransition.publicNote ?? undefined;
    }
    set publicNote(value) {
        this._rawTransition.publicNote = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(TokenMintToPoolTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
