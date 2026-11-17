import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { SerializedActionWASM } from '../../../dpp/structs/ShieldedTransitions/SerializedAction.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Tops up an identity with credits spent from the shielded pool **/
export class IdentityTopUpFromShieldedPoolTransitionWASM {
    /** @private **/
    _rawIdentityTopUpFromShieldedPoolTransition;
    constructor(identityId, actions, topUpAmount, anchor, proof, bindingSignature) {
        this._rawIdentityTopUpFromShieldedPoolTransition = new dppProvider.dpp.IdentityTopUpFromShieldedPoolTransitionNAPI(prepareIdentifierValue(identityId), actions.map(a => a._rawSerializedAction), topUpAmount.toString(), anchor, proof, bindingSignature);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.identityId);
    }
    set identityId(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.identityId = prepareIdentifierValue(value);
    }
    get actions() {
        return this._rawIdentityTopUpFromShieldedPoolTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get topUpAmount() {
        return BigInt(this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount);
    }
    set topUpAmount(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.topUpAmount = value.toString();
    }
    get anchor() {
        return this._rawIdentityTopUpFromShieldedPoolTransition.anchor;
    }
    set anchor(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.anchor = value;
    }
    get proof() {
        return this._rawIdentityTopUpFromShieldedPoolTransition.proof;
    }
    set proof(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawIdentityTopUpFromShieldedPoolTransition.bindingsSignature = value;
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityTopUpFromShieldedPoolTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return IdentityTopUpFromShieldedPoolTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityTopUpFromShieldedPoolTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityTopUpFromShieldedPoolTransitionWASM.prototype);
        instance._rawIdentityTopUpFromShieldedPoolTransition = rawInstance;
        return instance;
    }
}
