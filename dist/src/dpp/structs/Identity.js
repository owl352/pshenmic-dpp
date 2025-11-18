import { IdentifierWASM } from './Identifier.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { valueToDynamicEnum } from '../helpers.js';
let dpp;
export function setDpp(_dpp) {
    dpp = _dpp;
}
export class IdentityWASM {
    /** @private **/
    _rawIdentity;
    constructor(rawId, platformVersion) {
        const id = new IdentifierWASM(rawId);
        const dynamicEnumValue = valueToDynamicEnum(platformVersion);
        this._rawIdentity = new dpp.IdentityNAPI(id._rawIdentifier, dynamicEnumValue);
    }
    set id(rawId) {
        this._rawIdentity.id = new IdentifierWASM(rawId);
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawIdentity.id);
    }
    set balance(balance) {
        this._rawIdentity.balance = { value: balance.toString() };
    }
    get balance() {
        return BigInt(this._rawIdentity.balance.value);
    }
    set revision(revision) {
        this._rawIdentity.revision = { value: revision.toString() };
    }
    get revision() {
        return BigInt(this._rawIdentity.revision.value);
    }
    addPublicKey(publicKey) {
        this._rawIdentity.addPublicKey(publicKey.getRawInstance());
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
        const rawInstance = dpp.IdentityNAPI.fromHex(hex);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBase64(base64) {
        const rawInstance = dpp.IdentityNAPI.fromBase64(base64);
        return this.createFromRawInstance(rawInstance);
    }
    static fromBytes(bytes) {
        const rawInstance = dpp.IdentityNAPI.fromBytes(bytes);
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
        const instance = Object.create(this.prototype);
        instance._rawIdentity = rawInstance;
        return instance;
    }
    getRawInstance() {
        return this._rawIdentity;
    }
}
