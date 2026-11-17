import { IdentifierWASM } from './Identifier.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { dppProvider } from '../provider.js';
import { prepareIdentifierValue, valueToDynamicValue } from '../utils.js';
export class IdentityWASM {
    /** @private **/
    _rawIdentity;
    constructor(rawId, platformVersion) {
        const dpp = dppProvider.dpp;
        this._rawIdentity = new dpp.IdentityNAPI(prepareIdentifierValue(rawId), valueToDynamicValue(platformVersion));
    }
    set id(rawId) {
        this._rawIdentity.id = prepareIdentifierValue(rawId);
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentity.id);
    }
    set balance(balance) {
        this._rawIdentity.balance = balance.toString();
    }
    get balance() {
        return BigInt(this._rawIdentity.balance);
    }
    set revision(revision) {
        this._rawIdentity.revision = revision.toString();
    }
    get revision() {
        return BigInt(this._rawIdentity.revision);
    }
    addPublicKey(publicKey) {
        this._rawIdentity.addPublicKey(publicKey._rawIdentityPublicKey);
    }
    getPublicKeyById(keyId) {
        const rawKeyInstance = this._rawIdentity.getPublicKeyById(keyId);
        if (rawKeyInstance != null) {
            return IdentityPublicKeyWASM.createFromRawInstance(rawKeyInstance);
        }
        return undefined;
    }
    getPublicKeys() {
        const rawKeysArr = this._rawIdentity.getPublicKeys();
        return rawKeysArr.map((key) => IdentityPublicKeyWASM.createFromRawInstance(key));
    }
    static fromHex(hex) {
        const rawInstance = dppProvider.dpp.IdentityNAPI.fromHex(hex);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBase64(base64) {
        const rawInstance = dppProvider.dpp.IdentityNAPI.fromBase64(base64);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBytes(bytes) {
        const rawInstance = dppProvider.dpp.IdentityNAPI.fromBytes(bytes);
        return this.createFromRawInstance(rawInstance);
    }
    bytes() {
        return this._rawIdentity.bytes();
    }
    hex() {
        return this._rawIdentity.hex();
    }
    base64() {
        return this._rawIdentity.base64();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(IdentityWASM.prototype);
        instance._rawIdentity = rawInstance;
        return instance;
    }
    getRawInstance() {
        return this._rawIdentity;
    }
}
