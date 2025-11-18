import { valueToDynamicEnum } from '../helpers.js';
let dpp;
export function setDpp(_dpp) {
    dpp = _dpp;
}
export class IdentityPublicKeyWASM {
    /** @private **/
    _rawIdentityPublicKey;
    constructor(id, purpose, securityLevel, keyType, readOnly, binaryData, disabledAt) {
        if (purpose == null || securityLevel == null || keyType == null) {
            throw new Error('purpose, securityLevel, keyType must be specified');
        }
        this._rawIdentityPublicKey = new dpp.IdentityPublicKeyNAPI(id, valueToDynamicEnum(purpose), valueToDynamicEnum(securityLevel), valueToDynamicEnum(keyType), readOnly, binaryData, disabledAt != null ? { value: disabledAt.toString() } : undefined);
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
        this._rawIdentityPublicKey.purpose = valueToDynamicEnum(purpose);
    }
    get purposeNumber() {
        return this._rawIdentityPublicKey.purposeNumber;
    }
    set purposeNumber(purpose) {
        this._rawIdentityPublicKey.purposeNumber = valueToDynamicEnum(purpose);
    }
    get securityLevel() {
        return this._rawIdentityPublicKey.securityLevel;
    }
    set securityLevel(securityLevel) {
        this._rawIdentityPublicKey.securityLevel = valueToDynamicEnum(securityLevel);
    }
    get securityLevelNumber() {
        return this._rawIdentityPublicKey.securityLevelNumber;
    }
    set securityLevelNumber(securityLevel) {
        this._rawIdentityPublicKey.securityLevelNumber = valueToDynamicEnum(securityLevel);
    }
    get keyType() {
        return this._rawIdentityPublicKey.keyType;
    }
    set keyType(keyType) {
        this._rawIdentityPublicKey.keyType = valueToDynamicEnum(keyType);
    }
    get keyTypeNumber() {
        return this._rawIdentityPublicKey.keyTypeNumber;
    }
    set keyTypeNumber(keyType) {
        this._rawIdentityPublicKey.keyTypeNumber = valueToDynamicEnum(keyType);
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
        return (timestamp != null) ? BigInt(timestamp.value) : undefined;
    }
    set disabledAt(disabledAt) {
        this._rawIdentityPublicKey.disabledAt = { value: disabledAt };
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
    static fromBytes(bytes) {
        const rawInstance = dpp.IdentityPublicKeyNAPI.fromBytes(bytes);
        return this.createFromRawInstance(rawInstance);
    }
    static fromHex(hex) {
        const rawInstance = dpp.IdentityPublicKeyNAPI.fromHex(hex);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBase64(base64) {
        const rawInstance = dpp.IdentityPublicKeyNAPI.fromBase64(base64);
        return this.createFromRawInstance(rawInstance);
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(this.prototype);
        instance._rawIdentityPublicKey = rawInstance;
        return instance;
    }
    getRawInstance() {
        return this._rawIdentityPublicKey;
    }
}
