import { dppProvider } from '../../../../dpp/provider.js';
import { valueToDynamicValue } from '../../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { TokenBaseTransitionWASM } from '../../../../dpp/structs/Batch/TokenBaseTransition.js';
/** Claims a token distribution into the token shielded pool **/
export class TokenClaimToPoolTransitionWASM {
    /** @private **/
    _rawTransition;
    constructor(base, distributionType, claimUpTo, actions, anchor, proof, bindingSignature, publicNote) {
        this._rawTransition = new dppProvider.dpp.TokenClaimToPoolTransitionNAPI(base._rawTokenBaseTransition, valueToDynamicValue(distributionType), claimUpTo?.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingSignature, publicNote);
    }
    get base() {
        return TokenBaseTransitionWASM.createFromRawInstance(this._rawTransition.base);
    }
    set base(value) {
        this._rawTransition.base = value._rawTokenBaseTransition;
    }
    get distributionType() {
        return this._rawTransition.distributionType;
    }
    set distributionType(value) {
        this._rawTransition.distributionType = valueToDynamicValue(value);
    }
    get claimUpTo() {
        const value = this._rawTransition.claimUpTo;
        return value != null ? BigInt(value) : undefined;
    }
    set claimUpTo(value) {
        this._rawTransition.claimUpTo = value?.toString();
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
        const instance = Object.create(TokenClaimToPoolTransitionWASM.prototype);
        instance._rawTransition = rawInstance;
        return instance;
    }
}
