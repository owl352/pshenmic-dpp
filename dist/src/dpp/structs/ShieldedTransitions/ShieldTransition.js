import { InputAddressWASM } from '../AddressTransitions/entities/InputAddress.js';
import { AddressFundsFeeStrategyStepWASM } from '../AddressTransitions/entities/AddressFundsFeeStrategyStep.js';
import { AddressWitnessWASM } from '../PlatformAddress/AddressWitness.js';
import { SerializedActionWASM } from './SerializedAction.js';
import { dppProvider } from '../../provider.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class ShieldTransitionWASM {
    /** @private **/
    _rawShieldTransition;
    constructor(inputs, actions, amount, anchor, proof, bindingsSignature, feeStrategy, userFeeIncrease, inputWitnesses) {
        this._rawShieldTransition = new dppProvider.dpp.ShieldTransitionNAPI(inputs.map(i => i._rawInputAddress), actions.map(a => a._rawSerializedAction), amount.toString(), anchor, proof, bindingsSignature, feeStrategy.map(s => s._rawAddressFundsFeeStrategyStep), userFeeIncrease, inputWitnesses.map(w => w._rawWitness));
    }
    get inputs() {
        return this._rawShieldTransition.inputs.map(InputAddressWASM.createFromRawInstance);
    }
    set inputs(value) {
        this._rawShieldTransition.inputs = value.map(i => i._rawInputAddress);
    }
    get actions() {
        return this._rawShieldTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawShieldTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get amount() {
        return BigInt(this._rawShieldTransition.amount);
    }
    set amount(value) {
        this._rawShieldTransition.amount = value.toString();
    }
    get anchor() {
        return this._rawShieldTransition.anchor;
    }
    set anchor(value) {
        this._rawShieldTransition.anchor = value;
    }
    get proof() {
        return this._rawShieldTransition.proof;
    }
    set proof(value) {
        this._rawShieldTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawShieldTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawShieldTransition.bindingsSignature = value;
    }
    get feeStrategy() {
        return this._rawShieldTransition.feeStrategy.map(AddressFundsFeeStrategyStepWASM.createFromRawInstance);
    }
    set feeStrategy(value) {
        this._rawShieldTransition.feeStrategy = value.map(s => s._rawAddressFundsFeeStrategyStep);
    }
    get userFeeIncrease() {
        return this._rawShieldTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawShieldTransition.userFeeIncrease = value;
    }
    get inputWitnesses() {
        return this._rawShieldTransition.inputWitnesses.map(AddressWitnessWASM.createFromRawInstance);
    }
    set inputWitnesses(value) {
        this._rawShieldTransition.inputWitnesses = value.map(w => w._rawWitness);
    }
    static computeMinimumFee(numActions, platformVersion) {
        return BigInt(dppProvider.dpp.ShieldTransitionNAPI.computeMinimumFee(numActions, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawShieldTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return ShieldTransitionWASM.createFromRawInstance(dppProvider.dpp.ShieldTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldTransitionWASM.prototype);
        instance._rawShieldTransition = rawInstance;
        return instance;
    }
}
