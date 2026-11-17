import { SerializedActionWASM } from './SerializedAction.js';
import { CoreScriptWASM } from '../CoreScript.js';
import { dppProvider } from '../../provider.js';
import { valueToDynamicValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class ShieldedWithdrawalTransitionWASM {
    /** @private **/
    _rawShieldedWithdrawalTransition;
    constructor(actions, unshieldingAmount, anchor, proof, bindingsSignature, coreFeePerByte, pooling, outputScript) {
        this._rawShieldedWithdrawalTransition = new dppProvider.dpp.ShieldedWithdrawalTransitionNAPI(actions.map(a => a._rawSerializedAction), unshieldingAmount.toString(), anchor, proof, bindingsSignature, coreFeePerByte, valueToDynamicValue(pooling), outputScript._rawCoreScript);
    }
    get actions() {
        return this._rawShieldedWithdrawalTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawShieldedWithdrawalTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get unshieldingAmount() {
        return BigInt(this._rawShieldedWithdrawalTransition.unshieldingAmount);
    }
    set unshieldingAmount(value) {
        this._rawShieldedWithdrawalTransition.unshieldingAmount = value.toString();
    }
    get anchor() {
        return this._rawShieldedWithdrawalTransition.anchor;
    }
    set anchor(value) {
        this._rawShieldedWithdrawalTransition.anchor = value;
    }
    get proof() {
        return this._rawShieldedWithdrawalTransition.proof;
    }
    set proof(value) {
        this._rawShieldedWithdrawalTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawShieldedWithdrawalTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawShieldedWithdrawalTransition.bindingsSignature = value;
    }
    get coreFeePerByte() {
        return this._rawShieldedWithdrawalTransition.coreFeePerByte;
    }
    set coreFeePerByte(value) {
        this._rawShieldedWithdrawalTransition.coreFeePerByte = value;
    }
    get pooling() {
        return this._rawShieldedWithdrawalTransition.pooling;
    }
    set pooling(value) {
        this._rawShieldedWithdrawalTransition.pooling = valueToDynamicValue(value);
    }
    get outputScript() {
        return CoreScriptWASM.createFromRawInstance(this._rawShieldedWithdrawalTransition.outputScript);
    }
    set outputScript(value) {
        this._rawShieldedWithdrawalTransition.outputScript = value._rawCoreScript;
    }
    static computeMinimumFee(numActions, platformVersion) {
        return BigInt(dppProvider.dpp.ShieldedWithdrawalTransitionNAPI.computeMinimumFee(numActions, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawShieldedWithdrawalTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return ShieldedWithdrawalTransitionWASM.createFromRawInstance(dppProvider.dpp.ShieldedWithdrawalTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldedWithdrawalTransitionWASM.prototype);
        instance._rawShieldedWithdrawalTransition = rawInstance;
        return instance;
    }
}
