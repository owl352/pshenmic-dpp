import { dppProvider } from '../../../dpp/provider.js';
import { IdentifierWASM } from '../../../dpp/structs/Identifier.js';
import { prepareIdentifierValue } from '../../../dpp/utils.js';
import { StateTransitionWASM } from '../../../dpp/structs/StateTransition.js';
/** Changes the budget and expiry of an identity key (platform v14+). `None` removes a limit **/
export class IdentityKeyLimitsUpdateTransitionWASM {
    /** @private **/
    _rawIdentityKeyLimitsUpdateTransition;
    constructor(identityId, nonce, keyId, totalBudget, expiresAt, userFeeIncrease) {
        this._rawIdentityKeyLimitsUpdateTransition = new dppProvider.dpp.IdentityKeyLimitsUpdateTransitionNAPI(prepareIdentifierValue(identityId), nonce.toString(), keyId, totalBudget?.toString(), expiresAt?.toString(), userFeeIncrease);
    }
    get identityId() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentityKeyLimitsUpdateTransition.identityId);
    }
    set identityId(value) {
        this._rawIdentityKeyLimitsUpdateTransition.identityId = prepareIdentifierValue(value);
    }
    get nonce() {
        return BigInt(this._rawIdentityKeyLimitsUpdateTransition.nonce);
    }
    set nonce(value) {
        this._rawIdentityKeyLimitsUpdateTransition.nonce = value.toString();
    }
    get keyId() {
        return this._rawIdentityKeyLimitsUpdateTransition.keyId;
    }
    set keyId(value) {
        this._rawIdentityKeyLimitsUpdateTransition.keyId = value;
    }
    get totalBudget() {
        const value = this._rawIdentityKeyLimitsUpdateTransition.totalBudget;
        return value != null ? BigInt(value) : undefined;
    }
    set totalBudget(value) {
        this._rawIdentityKeyLimitsUpdateTransition.totalBudget = value?.toString();
    }
    get expiresAt() {
        const value = this._rawIdentityKeyLimitsUpdateTransition.expiresAt;
        return value != null ? BigInt(value) : undefined;
    }
    set expiresAt(value) {
        this._rawIdentityKeyLimitsUpdateTransition.expiresAt = value?.toString();
    }
    get userFeeIncrease() {
        return this._rawIdentityKeyLimitsUpdateTransition.userFeeIncrease;
    }
    set userFeeIncrease(value) {
        this._rawIdentityKeyLimitsUpdateTransition.userFeeIncrease = value;
    }
    get signaturePublicKeyId() {
        return this._rawIdentityKeyLimitsUpdateTransition.signaturePublicKeyId;
    }
    set signaturePublicKeyId(value) {
        this._rawIdentityKeyLimitsUpdateTransition.signaturePublicKeyId = value;
    }
    get signature() {
        return this._rawIdentityKeyLimitsUpdateTransition.signature;
    }
    set signature(value) {
        this._rawIdentityKeyLimitsUpdateTransition.signature = value;
    }
    toStateTransition() {
        return StateTransitionWASM.createFromRawInstance(this._rawIdentityKeyLimitsUpdateTransition.toStateTransition());
    }
    static fromStateTransition(stateTransition) {
        return IdentityKeyLimitsUpdateTransitionWASM.createFromRawInstance(dppProvider.dpp.IdentityKeyLimitsUpdateTransitionNAPI.fromStateTransition(stateTransition._rawStateTransition));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityKeyLimitsUpdateTransitionWASM.prototype);
        instance._rawIdentityKeyLimitsUpdateTransition = rawInstance;
        return instance;
    }
}
