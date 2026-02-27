import { dppProvider } from '../provider.js';
import { PrivateKeyWASM } from './PrivateKey.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
export class StateTransitionWASM {
    /** @private **/
    _rawStateTransition;
    constructor(_rawStateTransition) {
        this._rawStateTransition = _rawStateTransition;
    }
    get signature() {
        return this._rawStateTransition.signature ?? undefined;
    }
    set signature(signature) {
        this._rawStateTransition.signature = signature;
    }
    get signaturePublicKeyId() {
        return this._rawStateTransition.signaturePublicKeyId ?? undefined;
    }
    set signaturePublicKeyId(keyId) {
        this._rawStateTransition.signaturePublicKeyId = keyId;
    }
    get userFeeIncrease() {
        return this._rawStateTransition.userFeeIncrease;
    }
    set userFeeIncrease(userFeeIncrease) {
        this._rawStateTransition.userFeeIncrease = userFeeIncrease;
    }
    sign(privateKey, publicKey) {
        const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey);
        return this._rawStateTransition.sign(normalPrivateKey, publicKey._rawIdentityPublicKey);
    }
    signByPrivateKey(privateKey, keyId, keyType) {
        const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey);
        return this._rawStateTransition.signByPrivateKey(normalPrivateKey, keyId, keyType ? valueToDynamicValue(keyType) : undefined);
    }
    verifyPublicKey(publicKey, allowSigningWithAnySecurityLevel, allowSigningWithAnyPurpose) {
        this._rawStateTransition.verifyPublicKey(publicKey._rawIdentityPublicKey, allowSigningWithAnySecurityLevel, allowSigningWithAnyPurpose);
    }
    hash(skipSignature) {
        return this._rawStateTransition.hash(skipSignature);
    }
    getActionName() {
        return this._rawStateTransition.getActionName();
    }
    getActionType() {
        return this._rawStateTransition.getActionType();
    }
    getActionTypeNumber() {
        return this._rawStateTransition.getActionTypeNumber();
    }
    getOwnerId() {
        const id = this._rawStateTransition.getOwnerId();
        return (id != null) ? IdentifierWASM.createFromRawInstance(id) : undefined;
    }
    getPurposeRequirement() {
        return this._rawStateTransition.getPurposeRequirement() ?? undefined;
    }
    getKeyLevelRequirement(purpose) {
        return this._rawStateTransition.getKeyLevelRequirement(valueToDynamicValue(purpose)) ?? undefined;
    }
    getIdentityContractNonce() {
        const nonce = this._rawStateTransition.getIdentityContractNonce();
        return nonce != null ? BigInt(nonce) : undefined;
    }
    getIdentityNonce() {
        const nonce = this._rawStateTransition.getIdentityNonce();
        return nonce != null ? BigInt(nonce) : undefined;
    }
    setOwnerId(ownerId) {
        this._rawStateTransition.setOwnerId(prepareIdentifierValue(ownerId));
    }
    setIdentityContractNonce(nonce) {
        this._rawStateTransition.setIdentityContractNonce(nonce.toString());
    }
    setIdentityNonce(nonce) {
        this._rawStateTransition.setIdentityNonce(nonce.toString());
    }
    bytes() {
        return this._rawStateTransition.bytes();
    }
    hex() {
        return this._rawStateTransition.hex();
    }
    base64() {
        return this._rawStateTransition.base64();
    }
    static fromBytes(bytes) {
        return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromBytes(bytes));
    }
    static fromHex(hex) {
        return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromHex(hex));
    }
    static fromBase64(base64) {
        return new StateTransitionWASM(dppProvider.dpp.StateTransitionNAPI.fromBase64(base64));
    }
    static createFromRawInstance(instance) {
        return new StateTransitionWASM(instance);
    }
}
