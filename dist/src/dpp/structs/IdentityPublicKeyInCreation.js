import { ContractBoundsWASM } from './ContractBounds.js';
import { dppProvider } from '../provider.js';
import { valueToDynamicValue } from '../utils.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { PrivateKeyWASM } from './PrivateKey.js';
export class IdentityPublicKeyInCreationWASM {
    /** @private **/
    _rawKeyInCreation;
    constructor(id, purpose, securityLevel, keyType, readOnly, binaryData, signature, contractBounds, totalBudget, expiresAt) {
        this._rawKeyInCreation = new dppProvider.dpp.IdentityPublicKeyInCreationNAPI(id, valueToDynamicValue(purpose), valueToDynamicValue(securityLevel), valueToDynamicValue(keyType), readOnly, binaryData, signature, contractBounds?._rawContractBounds, totalBudget?.toString(), expiresAt?.toString());
    }
    toIdentityPublicKey() {
        return IdentityPublicKeyWASM.createFromRawInstance(this._rawKeyInCreation.toIdentityPublicKey());
    }
    validatePrivateKey(privateKey, network) {
        const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey);
        return this._rawKeyInCreation.validatePrivateKey(normalPrivateKey, valueToDynamicValue(network));
    }
    getHash() {
        return this._rawKeyInCreation.getHash();
    }
    getContractBounds() {
        if (this._rawKeyInCreation.contractBounds != null) {
            return ContractBoundsWASM.createFromRawInstance(this._rawKeyInCreation.contractBounds);
        }
    }
    get contractBounds() {
        if (this._rawKeyInCreation.contractBounds != null) {
            return ContractBoundsWASM.createFromRawInstance(this._rawKeyInCreation.contractBounds);
        }
    }
    set contractBounds(value) {
        this._rawKeyInCreation.contractBounds = value._rawContractBounds;
    }
    get totalBudget() {
        const totalBudget = this._rawKeyInCreation.totalBudget;
        return (totalBudget != null) ? BigInt(totalBudget) : undefined;
    }
    /** Setting a budget or an expiry turns the key into a V1 key (platform v14+) **/
    set totalBudget(totalBudget) {
        this._rawKeyInCreation.totalBudget = totalBudget?.toString();
    }
    get expiresAt() {
        const expiresAt = this._rawKeyInCreation.expiresAt;
        return (expiresAt != null) ? BigInt(expiresAt) : undefined;
    }
    set expiresAt(expiresAt) {
        this._rawKeyInCreation.expiresAt = expiresAt?.toString();
    }
    hasLimits() {
        return this._rawKeyInCreation.hasLimits();
    }
    get keyId() {
        return this._rawKeyInCreation.keyId;
    }
    set keyId(value) {
        this._rawKeyInCreation.keyId = value;
    }
    get purpose() {
        return this._rawKeyInCreation.purpose;
    }
    set purpose(value) {
        this._rawKeyInCreation.purpose = valueToDynamicValue(value);
    }
    get securityLevel() {
        return this._rawKeyInCreation.securityLevel;
    }
    set securityLevel(value) {
        this._rawKeyInCreation.securityLevel = valueToDynamicValue(value);
    }
    get keyType() {
        return this._rawKeyInCreation.keyType;
    }
    set keyType(value) {
        this._rawKeyInCreation.keyType = valueToDynamicValue(value);
    }
    get readOnly() {
        return this._rawKeyInCreation.readOnly;
    }
    set readOnly(value) {
        this._rawKeyInCreation.readOnly = value;
    }
    get data() {
        return this._rawKeyInCreation.data;
    }
    set data(value) {
        this._rawKeyInCreation.data = value;
    }
    get signature() {
        return this._rawKeyInCreation.signature;
    }
    set signature(value) {
        this._rawKeyInCreation.signature = value;
    }
    bytes() {
        return this._rawKeyInCreation.bytes();
    }
    static fromBytes(bytes) {
        return IdentityPublicKeyInCreationWASM.createFromRawInstance(dppProvider.dpp.IdentityPublicKeyInCreationNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityPublicKeyInCreationWASM.prototype);
        instance._rawKeyInCreation = rawInstance;
        return instance;
    }
}
