import { dppProvider } from '../../provider.js';
import { NoteWASM } from './Note.js';
import { MerklePathWASM } from './MerklePath.js';
export class SpendableNoteWASM {
    /** @private **/
    _rawSpendableNote;
    constructor(note, merklePath) {
        this._rawSpendableNote = new dppProvider.shielded.SpendableNoteNAPI(note._rawNote, merklePath._rawMerklePath);
    }
    get note() {
        return NoteWASM.createFromRawInstance(this._rawSpendableNote.note);
    }
    set note(value) {
        this._rawSpendableNote.note = value._rawNote;
    }
    get merklePath() {
        return MerklePathWASM.createFromRawInstance(this._rawSpendableNote.merklePath);
    }
    set merklePath(value) {
        this._rawSpendableNote.merklePath = value._rawMerklePath;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(SpendableNoteWASM.prototype);
        instance._rawSpendableNote = rawInstance;
        return instance;
    }
}
