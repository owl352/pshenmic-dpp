import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { dppProvider } from '../provider.js';
import { prepareIdentifierValue } from '../utils.js';
import { IdentifierWASM } from './Identifier.js';
export class PartialIdentityWASM {
    /** @private **/
    _rawPartialIdentity;
    constructor(id, loadedPublicKeys, balance, revision, notFoundPublicKeys) {
        const publicKeysIds = Object.keys(loadedPublicKeys);
        const normalKeys = [];
        for (const publicKeyId of publicKeysIds) {
            normalKeys.push([
                Number(publicKeyId),
                loadedPublicKeys[Number(publicKeyId)]._rawIdentityPublicKey
            ]);
        }
        this._rawPartialIdentity = new dppProvider.dpp.PartialIdentityNAPI(prepareIdentifierValue(id), normalKeys, balance?.toString(), revision?.toString(), notFoundPublicKeys);
    }
    get id() {
        return IdentifierWASM.createFromRawInstance(this._rawPartialIdentity.id);
    }
    set id(id) {
        this._rawPartialIdentity.id = prepareIdentifierValue(id);
    }
    get loadedPublicKeys() {
        const keys = this._rawPartialIdentity.loadedPublicKeys;
        const out = {};
        for (const key of keys) {
            out[key[0]] = IdentityPublicKeyWASM.createFromRawInstance(key[1]);
        }
        return out;
    }
    set loadedPublicKeys(loadedPublicKeys) {
        const publicKeysIds = Object.keys(loadedPublicKeys);
        const normalKeys = [];
        for (const publicKeyId of publicKeysIds) {
            normalKeys.push([
                Number(publicKeyId),
                loadedPublicKeys[Number(publicKeyId)]._rawIdentityPublicKey
            ]);
        }
        this._rawPartialIdentity.loadedPublicKeys = normalKeys;
    }
    get balance() {
        const balance = this._rawPartialIdentity.balance;
        return balance != null ? BigInt(balance) : undefined;
    }
    set balance(balance) {
        this._rawPartialIdentity.balance = balance?.toString();
    }
    get revision() {
        const revision = this._rawPartialIdentity.revision;
        return revision != null ? BigInt(revision) : undefined;
    }
    set revision(revision) {
        this._rawPartialIdentity.revision = revision?.toString();
    }
    get notFoundPublicKeys() {
        return this._rawPartialIdentity.notFoundPublicKeys;
    }
    set notFoundPublicKeys(keys) {
        this._rawPartialIdentity.notFoundPublicKeys = keys;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PartialIdentityWASM.prototype);
        instance._rawPartialIdentity = rawInstance;
        return instance;
    }
}
