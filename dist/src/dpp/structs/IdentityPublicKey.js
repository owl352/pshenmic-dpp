import { dppProvider } from '../provider.js';
import { ContractBoundsWASM } from './ContractBounds.js';
import { PrivateKeyWASM } from './PrivateKey.js';
import { valueToDynamicValue } from '../utils.js';
export class IdentityPublicKeyWASM {
    /** @private **/
    _rawIdentityPublicKey;
    constructor(id, purpose, securityLevel, keyType, readOnly, binaryData, disabledAt, contractBounds) {
        const dpp = dppProvider.dpp;
        if (purpose == null || securityLevel == null || keyType == null) {
            throw new Error('purpose, securityLevel, keyType must be specified');
        }
        this._rawIdentityPublicKey = new dpp.IdentityPublicKeyNAPI(id, new dpp.DynamicValue(purpose), new dpp.DynamicValue(securityLevel), new dpp.DynamicValue(keyType), readOnly, binaryData, disabledAt?.toString(), contractBounds?._rawContractBounds);
    }
    get keyId() {
        return this._rawIdentityPublicKey.keyId;
    }
    set keyId(keyId) {
        this._rawIdentityPublicKey.keyId = keyId;
    }
    get purpose() {
        return this._rawIdentityPublicKey.purpose;
    }
    set purpose(purpose) {
        const dpp = dppProvider.dpp;
        this._rawIdentityPublicKey.purpose = new dpp.DynamicValue(purpose);
    }
    get purposeNumber() {
        return this._rawIdentityPublicKey.purposeNumber;
    }
    set purposeNumber(purpose) {
        this._rawIdentityPublicKey.purposeNumber = purpose;
    }
    get securityLevel() {
        return this._rawIdentityPublicKey.securityLevel;
    }
    set securityLevel(securityLevel) {
        const dpp = dppProvider.dpp;
        this._rawIdentityPublicKey.securityLevel = new dpp.DynamicValue(securityLevel);
    }
    get securityLevelNumber() {
        return this._rawIdentityPublicKey.securityLevelNumber;
    }
    set securityLevelNumber(securityLevel) {
        this._rawIdentityPublicKey.securityLevelNumber = securityLevel;
    }
    get keyType() {
        return this._rawIdentityPublicKey.keyType;
    }
    set keyType(keyType) {
        const dpp = dppProvider.dpp;
        this._rawIdentityPublicKey.keyType = new dpp.DynamicValue(keyType);
    }
    get keyTypeNumber() {
        return this._rawIdentityPublicKey.keyTypeNumber;
    }
    set keyTypeNumber(keyType) {
        this._rawIdentityPublicKey.keyTypeNumber = keyType;
    }
    get readOnly() {
        return this._rawIdentityPublicKey.readOnly;
    }
    set readOnly(readOnly) {
        this._rawIdentityPublicKey.readOnly = readOnly;
    }
    get data() {
        return this._rawIdentityPublicKey.data;
    }
    set data(binaryData) {
        this._rawIdentityPublicKey.data = binaryData;
    }
    get disabledAt() {
        const timestamp = this._rawIdentityPublicKey.disabledAt;
        return (timestamp != null) ? BigInt(timestamp) : undefined;
    }
    set disabledAt(disabledAt) {
        this._rawIdentityPublicKey.disabledAt = disabledAt.toString();
    }
    get contractBounds() {
        if (this._rawIdentityPublicKey.contractBounds != null) {
            return ContractBoundsWASM.createFromRawInstance(this._rawIdentityPublicKey.contractBounds);
        }
    }
    set contractBounds(contractBounds) {
        this._rawIdentityPublicKey.contractBounds = contractBounds?._rawContractBounds;
    }
    getContractBounds() {
        if (this._rawIdentityPublicKey.contractBounds != null) {
            return ContractBoundsWASM.createFromRawInstance(this._rawIdentityPublicKey.contractBounds);
        }
    }
    removeDisabledAt() {
        this._rawIdentityPublicKey.removeDisabledAt();
    }
    getPublicKeyHash() {
        return this._rawIdentityPublicKey.getPublicKeyHash();
    }
    isMaster() {
        return this._rawIdentityPublicKey.isMaster();
    }
    bytes() {
        return this._rawIdentityPublicKey.bytes();
    }
    hex() {
        return this._rawIdentityPublicKey.hex();
    }
    base64() {
        return this._rawIdentityPublicKey.base64();
    }
    validatePrivateKey(privateKey, network) {
        const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey);
        return this._rawIdentityPublicKey.validatePrivateKey(normalPrivateKey, valueToDynamicValue(network));
    }
    static fromBytes(bytes) {
        const rawInstance = dppProvider.dpp.IdentityPublicKeyNAPI.fromBytes(bytes);
        return this.createFromRawInstance(rawInstance);
    }
    static fromHex(hex) {
        const rawInstance = dppProvider.dpp.IdentityPublicKeyNAPI.fromHex(hex);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBase64(base64) {
        const rawInstance = dppProvider.dpp.IdentityPublicKeyNAPI.fromBase64(base64);
        return this.createFromRawInstance(rawInstance);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityPublicKeyWASM.prototype);
        instance._rawIdentityPublicKey = rawInstance;
        return instance;
    }
}
