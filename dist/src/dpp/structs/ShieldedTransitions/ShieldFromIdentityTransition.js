import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Moves identity credits into the shielded pool **/
export class ShieldFromIdentityTransitionWASM {
    /** @private **/
    _rawShieldFromIdentityTransition;
    constructor(identityId, amount, actions, anchor, proof, bindingSignature, nonce, userFeeIncrease) {
        this._rawShieldFromIdentityTransition = new dppProvider.dpp.ShieldFromIdentityTransitionNAPI(prepareIdentifierValue(identityId), amount.toString(), actions.map(a => a._rawSerializedAction), anchor, proof, bindingSignature, nonce.toString(), userFeeIncrease);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.identityId);
    }
    set identityId(value) {
        this._rawShieldFromIdentityTransition.identityId = prepareIdentifierValue(value);
    }
    get amount() {
        return BigInt(this._rawShieldFromIdentityTransition.amount);
    }
    set amount(value) {
        this._rawShieldFromIdentityTransition.amount = value.toString();
    }
    get actions() {
        return this._rawShieldFromIdentityTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawShieldFromIdentityTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get anchor() {
        return this._rawShieldFromIdentityTransition.anchor;
    }
    set anchor(value) {
        this._rawShieldFromIdentityTransition.anchor = value;
    }
    get proof() {
        return this._rawShieldFromIdentityTransition.proof;
    }
    set proof(value) {
        this._rawShieldFromIdentityTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawShieldFromIdentityTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawShieldFromIdentityTransition.bindingsSignature = value;
    }
    get nonce() {
        return BigInt(this._rawShieldFromIdentityTransition.nonce);
    }
    set nonce(value) {
        this._rawShieldFromIdentityTransition.nonce = value.toString();
    }
    get userFeeIncrease() {
        return this._rawShieldFromIdentityTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawShieldFromIdentityTransition.userFeeIncrease = value;
    }
    get signaturePublicKeyId() {
        return this._rawShieldFromIdentityTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawShieldFromIdentityTransition.signaturePublicKeyId = value;
    }
    get signature() {
        return this._rawShieldFromIdentityTransition.signature;
    }
    set signature(value) {
        this._rawShieldFromIdentityTransition.signature = value;
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawShieldFromIdentityTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return ShieldFromIdentityTransitionWASM.createFromRawInstance(dppProvider.dpp.ShieldFromIdentityTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldFromIdentityTransitionWASM.prototype);
        instance._rawShieldFromIdentityTransition = rawInstance;
        return instance;
    }
}
