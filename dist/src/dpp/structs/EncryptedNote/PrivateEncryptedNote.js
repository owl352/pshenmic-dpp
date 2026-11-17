import { dppProvider } from '../../provider.js';
export class PrivateEncryptedNoteWASM {
    /** @private **/
    _rawEncryptedNote;
    constructor(rootEncryptionKeyIndex, derivationEncryptionKeyIndex, value) {
        this._rawEncryptedNote = new dppProvider.dpp.PrivateEncryptedNoteNAPI(rootEncryptionKeyIndex, derivationEncryptionKeyIndex, value);
    }
    get rootEncryptionKeyIndex() {
        return this._rawEncryptedNote.rootEncryptionKeyIndex;
    }
    set rootEncryptionKeyIndex(index) {
        this._rawEncryptedNote.rootEncryptionKeyIndex = index;
    }
    get derivationEncryptionKeyIndex() {
        return this._rawEncryptedNote.derivationEncryptionKeyIndex;
    }
    set derivationEncryptionKeyIndex(index) {
        this._rawEncryptedNote.derivationEncryptionKeyIndex = index;
    }
    get value() {
        return this._rawEncryptedNote.value;
    }
    set value(value) {
        this._rawEncryptedNote.value = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(PrivateEncryptedNoteWASM.prototype);
        instance._rawEncryptedNote = rawInstance;
        return instance;
    }
}
