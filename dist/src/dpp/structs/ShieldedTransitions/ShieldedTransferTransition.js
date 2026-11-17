import { SerializedActionWASM } from './SerializedAction.js';
import { dppProvider } from '../../provider.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class ShieldedTransferTransitionWASM {
    /** @private **/
    _rawShieldedTransferTransition;
    constructor(actions, valueBalance, anchor, proof, bindingsSignature) {
        this._rawShieldedTransferTransition = new dppProvider.dpp.ShieldedTransferTransitionNAPI(actions.map(a => a._rawSerializedAction), valueBalance.toString(), anchor, proof, bindingsSignature);
    }
    get actions() {
        return this._rawShieldedTransferTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawShieldedTransferTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get valueBalance() {
        return BigInt(this._rawShieldedTransferTransition.valueBalance);
    }
    set valueBalance(value) {
        this._rawShieldedTransferTransition.valueBalance = value.toString();
    }
    get anchor() {
        return this._rawShieldedTransferTransition.anchor;
    }
    set anchor(value) {
        this._rawShieldedTransferTransition.anchor = value;
    }
    get proof() {
        return this._rawShieldedTransferTransition.proof;
    }
    set proof(value) {
        this._rawShieldedTransferTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawShieldedTransferTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawShieldedTransferTransition.bindingsSignature = value;
    }
    static computeMinimumFee(numActions, platformVersion) {
        return BigInt(dppProvider.dpp.ShieldedTransferTransitionNAPI.computeMinimumFee(numActions, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawShieldedTransferTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return ShieldedTransferTransitionWASM.createFromRawInstance(dppProvider.dpp.ShieldedTransferTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedTransferTransitionWASM.prototype);
        instance._rawShieldedTransferTransition = rawInstance;
        return instance;
    }
}
