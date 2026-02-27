import { dppProvider } from '../provider.js';
import { valueToDynamicValue } from '../utils.js';
import { PublicKeyWASM } from './PublicKey.js';
export class PrivateKeyWASM {
    /** @private **/
    _rawPrivateKey;
    constructor(key, network) {
        this._rawPrivateKey = new dppProvider.dpp.PrivateKeyNAPI(valueToDynamicValue(key), valueToDynamicValue(network));
    }
    getPublicKey() {
        return PublicKeyWASM.createFromRawInstance(this._rawPrivateKey.getPublicKey());
    }
    getNetwork() {
        return this._rawPrivateKey.getNetwork();
    }
    WIF() {
        return this._rawPrivateKey.WIF();
    }
    bytes() {
        return this._rawPrivateKey.bytes();
    }
    hex() {
        return this._rawPrivateKey.hex();
    }
    getPublicKeyHash() {
        return this._rawPrivateKey.getPublicKeyHash();
    }
    sign(data) {
        return this._rawPrivateKey.sign(data);
    }
    signHash(dataHash) {
        return this._rawPrivateKey.signHash(dataHash);
    }
    static fromWIF(wif) {
        return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromWIF(wif));
    }
    static fromBytes(bytes, network) {
        return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromBytes(bytes, valueToDynamicValue(network)));
    }
    static fromHex(hex, network) {
        return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromHex(hex, valueToDynamicValue(network)));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PrivateKeyWASM.prototype);
        instance._rawPrivateKey = rawInstance;
        return instance;
    }
}
