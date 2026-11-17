import { SerializedActionWASM } from './SerializedAction.js';
import { AssetLockProofWASM } from '../AssetLockProof/AssetLockProof.js';
import { PlatformAddressWASM } from '../PlatformAddress/PlatformAddress.js';
import { dppProvider } from '../../provider.js';
import { preparePlatformAddressValue } from '../../utils.js';
import { StateTransitionWASM } from '../StateTransition.js';
export class ShieldFromAssetLockTransitionWASM {
    /** @private **/
    _rawShieldFromAssetLockTransition;
    constructor(assetLockProof, actions, valueBalance, anchor, proof, bindingsSignature, surplusOutput) {
        this._rawShieldFromAssetLockTransition = new dppProvider.dpp.ShieldFromAssetLockTransitionNAPI(assetLockProof._rawAssetLockProof, actions.map(a => a._rawSerializedAction), valueBalance.toString(), anchor, proof, bindingsSignature, surplusOutput != null ? preparePlatformAddressValue(surplusOutput) : undefined);
    }
    get assetLockProof() {
        return AssetLockProofWASM.createFromRawInstance(this._rawShieldFromAssetLockTransition.assetLockProof);
    }
    set assetLockProof(value) {
        this._rawShieldFromAssetLockTransition.assetLockProof = value._rawAssetLockProof;
    }
    get actions() {
        return this._rawShieldFromAssetLockTransition.actions.map(SerializedActionWASM.createFromRawInstance);
    }
    set actions(value) {
        this._rawShieldFromAssetLockTransition.actions = value.map(a => a._rawSerializedAction);
    }
    get valueBalance() {
        return BigInt(this._rawShieldFromAssetLockTransition.valueBalance);
    }
    set valueBalance(value) {
        this._rawShieldFromAssetLockTransition.valueBalance = value.toString();
    }
    get anchor() {
        return this._rawShieldFromAssetLockTransition.anchor;
    }
    set anchor(value) {
        this._rawShieldFromAssetLockTransition.anchor = value;
    }
    get proof() {
        return this._rawShieldFromAssetLockTransition.proof;
    }
    set proof(value) {
        this._rawShieldFromAssetLockTransition.proof = value;
    }
    get bindingsSignature() {
        return this._rawShieldFromAssetLockTransition.bindingsSignature;
    }
    set bindingsSignature(value) {
        this._rawShieldFromAssetLockTransition.bindingsSignature = value;
    }
    get surplusOutput() {
        const output = this._rawShieldFromAssetLockTransition.surplusOutput;
        if (output != null) {
            return PlatformAddressWASM.createFromRawInstance(output);
        }
    }
    set surplusOutput(value) {
        this._rawShieldFromAssetLockTransition.surplusOutput = value != null
            ? preparePlatformAddressValue(value)
            : undefined;
    }
    get signature() {
        return this._rawShieldFromAssetLockTransition.signature;
    }
    set signature(value) {
        this._rawShieldFromAssetLockTransition.signature = value;
    }
    static computeMinimumFee(numActions, platformVersion) {
        return BigInt(dppProvider.dpp.ShieldFromAssetLockTransitionNAPI.computeMinimumFee(numActions, platformVersion));
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawShieldFromAssetLockTransition.toStateTransition());
    }
    static fromStateTransition(st) {
        return ShieldFromAssetLockTransitionWASM.createFromRawInstance(dppProvider.dpp.ShieldFromAssetLockTransitionNAPI.fromStateTransition(st._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ShieldFromAssetLockTransitionWASM.prototype);
        instance._rawShieldFromAssetLockTransition = rawInstance;
        return instance;
    }
}
