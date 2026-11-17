import { dppProvider } from '../../provider.js';
import { TxOutWASM } from './TxOut.js';
import { OutPointWASM } from './OutPoint.js';
import { InstantLockWASM } from '../InstantLock.js';
import { IdentifierWASM } from '../Identifier.js';
export class InstantAssetLockProofWASM {
    _rawLockProof;
    constructor(instantLock, transaction, outputIndex) {
        this._rawLockProof = new dppProvider.dpp.InstantAssetLockProofNAPI(instantLock, transaction, outputIndex);
    }
    get outputIndex() {
        return this._rawLockProof.outputIndex;
    }
    set outputIndex(value) {
        this._rawLockProof.outputIndex = value;
    }
    get instantLock() {
        return InstantLockWASM.createFromRawInstance(this._rawLockProof.instantLock);
    }
    set instantLock(instantLock) {
        this._rawLockProof.instantLock = instantLock._rawInstantLock;
    }
    getOutput() {
        const out = this._rawLockProof.getOutput();
        return out instanceof dppProvider.dpp.TxOutNAPI ? TxOutWASM.createFromRawInstance(out) : out;
    }
    getOutPoint() {
        const out = this._rawLockProof.getOutPoint();
        return out instanceof dppProvider.dpp.OutPointNAPI ? OutPointWASM.createFromRawInstance(out) : out;
    }
    getTransaction() {
        return this._rawLockProof.getTransaction();
    }
    getInstantLockBytes() {
        return this._rawLockProof.getInstantLockBytes();
    }
    createIdentityId() {
        return IdentifierWASM.createFromRawInstance(this._rawLockProof.createIdentityId());
    }
    static fromRawObject(obj) {
        return InstantAssetLockProofWASM.createFromRawInstance(dppProvider.dpp.InstantAssetLockProofNAPI.fromRawObject(obj));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(InstantAssetLockProofWASM.prototype);
        instance._rawLockProof = rawInstance;
        return instance;
    }
}
