import { dppProvider } from '../../provider.js';
export class SerializedActionWASM {
    /** @private **/
    _rawSerializedAction;
    constructor(nullifier, rk, cmx, encryptedNote, cvNet, spendAuthSig) {
        this._rawSerializedAction = new dppProvider.dpp.SerializedActionNAPI(nullifier, rk, cmx, encryptedNote, cvNet, spendAuthSig);
    }
    bytes() {
        return this._rawSerializedAction.bytes();
    }
    static fromBytes(bytes) {
        return SerializedActionWASM.createFromRawInstance(dppProvider.dpp.SerializedActionNAPI.fromBytes(bytes));
    }
    get nullifier() {
        return this._rawSerializedAction.nullifier;
    }
    set nullifier(value) {
        this._rawSerializedAction.nullifier = value;
    }
    get rk() {
        return this._rawSerializedAction.rk;
    }
    set rk(value) {
        this._rawSerializedAction.rk = value;
    }
    get cmx() {
        return this._rawSerializedAction.cmx;
    }
    set cmx(value) {
        this._rawSerializedAction.cmx = value;
    }
    get encryptedNote() {
        return this._rawSerializedAction.encrypted_note;
    }
    set encryptedNote(value) {
        this._rawSerializedAction.encrypted_note = value;
    }
    get cvNet() {
        return this._rawSerializedAction.cvNet;
    }
    set cvNet(value) {
        this._rawSerializedAction.cvNet = value;
    }
    get spendAuthSig() {
        return this._rawSerializedAction.spendAuthSig;
    }
    set spendAuthSig(value) {
        this._rawSerializedAction.spendAuthSig = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(SerializedActionWASM.prototype);
        instance._rawSerializedAction = rawInstance;
        return instance;
    }
}
