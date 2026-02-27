import { dppProvider } from '../provider.js';
export class PublicKeyWASM {
    /** @private **/
    _rawPublicKey;
    constructor(compressed, bytes) {
        this._rawPublicKey = new dppProvider.dpp.PublicKeyNAPI(compressed, bytes);
    }
    get compressed() {
        return this._rawPublicKey.compressed;
    }
    set compressed(value) {
        this._rawPublicKey.compressed = value;
    }
    get inner() {
        return this._rawPublicKey.inner;
    }
    set inner(value) {
        this._rawPublicKey.inner = value;
    }
    getPublicKeyHash() {
        return this._rawPublicKey.getPublicKeyHash();
    }
    hash160() {
        return this._rawPublicKey.hash160();
    }
    bytes() {
        return this._rawPublicKey.bytes();
    }
    static fromBytes(bytes) {
        return PublicKeyWASM.createFromRawInstance(dppProvider.dpp.PublicKeyNAPI.fromBytes(bytes));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PublicKeyWASM.prototype);
        instance._rawPublicKey = rawInstance;
        return instance;
    }
}
