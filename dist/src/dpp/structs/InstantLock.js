import { OutPointWASM } from './AssetLockProof/OutPoint.js';
import { dppProvider } from '../provider.js';
export class InstantLockWASM {
    _rawInstantLock;
    constructor(version, inputs, txId, cycleHash, blsSignature) {
        this._rawInstantLock = new dppProvider.dpp.InstantLockNAPI(version, inputs.map(input => input._rawOutPoint), txId, cycleHash, blsSignature);
    }
    get version() {
        return this._rawInstantLock.version;
    }
    set version(version) {
        this._rawInstantLock.version = version;
    }
    get inputs() {
        return this.inputs.map(OutPointWASM.createFromRawInstance);
    }
    set inputs(inputs) {
        this._rawInstantLock.inputs = inputs.map(input => input._rawOutPoint);
    }
    get txid() {
        return this._rawInstantLock.txid;
    }
    set txid(txid) {
        this._rawInstantLock.txid = txid;
    }
    get cyclehash() {
        return this._rawInstantLock.cyclehash;
    }
    set cyclehash(hash) {
        this._rawInstantLock.cyclehash = hash;
    }
    get blsSignature() {
        return this._rawInstantLock.blsSignature;
    }
    set blsSignature(sig) {
        this._rawInstantLock.blsSignature = sig;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(InstantLockWASM.prototype);
        instance._rawInstantLock = rawInstance;
        return instance;
    }
}
