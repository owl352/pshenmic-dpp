import { dppProvider } from '../../provider.js';
export class SharedEncryptedNoteWASM {
    /** @private **/
    _rawSharedNote;
    constructor(senderKeyIndex, recipientKeyIndex, value) {
        this._rawSharedNote = new dppProvider.dpp.SharedEncryptedNoteNAPI(senderKeyIndex, recipientKeyIndex, value);
    }
    get senderKeyIndex() {
        return this._rawSharedNote.senderKeyIndex;
    }
    set senderKeyIndex(index) {
        this._rawSharedNote.senderKeyIndex = index;
    }
    get recipientKeyIndex() {
        return this._rawSharedNote.recipientKeyIndex;
    }
    set recipientKeyIndex(index) {
        this._rawSharedNote.recipientKeyIndex = index;
    }
    get value() {
        return this._rawSharedNote.value;
    }
    set value(value) {
        this._rawSharedNote.value = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(SharedEncryptedNoteWASM.prototype);
        instance._rawSharedNote = rawInstance;
        return instance;
    }
}
