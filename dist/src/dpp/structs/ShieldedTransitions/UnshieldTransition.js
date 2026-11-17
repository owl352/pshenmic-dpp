import { SerializedActionWASM } from './SerializedAction.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { dppProvider } from '../../provider.js';
import { preparePlatformAddressValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class UnshieldTransitionWASM {
    /** @private **/
    _rawUnshieldTransition;
    constructor(outputAddress, actions, unshieldingAmount, anchor, proof, bindingsSignature) {
        this._rawUnshieldTransition = new dppProvider.dpp.UnshieldTransitionNAPI(preparePlatformAddressValue(outputAddress), actions.map(a => a._rawSerializedAction), unshieldingAmount.toString(), anchor, proof, bindingsSignature);
    }
    get outputAddress() {
        return PlatformAddressWASM.createFromRawInstance(this._rawUnshieldTransition.outputAddress);
    }
    set outputAddress(value) {
        this._rawUnshieldTransition.outputAddress = preparePlatformAddressValue(value);
    }
    get actions() {
        return this._rawUnshieldTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawUnshieldTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get unshieldingAmount() {
        return BigInt(this._rawUnshieldTransition.unshieldingAmount);
    }
    set unshieldingAmount(value) {
        this._rawUnshieldTransition.unshieldingAmount = value.toString();
    }
    get anchor() {
        return this._rawUnshieldTransition.anchor;
    }
    set anchor(value) {
        this._rawUnshieldTransition.anchor = value;
    }
    get proof() {
        return this._rawUnshieldTransition.proof;
    }
    set proof(value) {
        this._rawUnshieldTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawUnshieldTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawUnshieldTransition.bindingsSignature = value;
    }
    static computeMinimumFee(numActions, platformVersion) {
        return BigInt(dppProvider.dpp.UnshieldTransitionNAPI.computeMinimumFee(numActions, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawUnshieldTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return UnshieldTransitionWASM.createFromRawInstance(dppProvider.dpp.UnshieldTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(UnshieldTransitionWASM.prototype);
        instance._rawUnshieldTransition = rawInstance;
        return instance;
    }
}
