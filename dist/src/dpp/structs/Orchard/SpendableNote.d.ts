import type { SpendableNoteNAPI } from 'dash-platform-shielded/bindingsTypes';
import { NoteWASM } from './Note.js';
import { MerklePathWASM } from './MerklePath.js';
export declare class SpendableNoteWASM {
    /** @private **/
    _rawSpendableNote: SpendableNoteNAPI;
    constructor(note: NoteWASM, merklePath: MerklePathWASM);
    get note(): NoteWASM;
    set note(value: NoteWASM);
    get merklePath(): MerklePathWASM;
    set merklePath(value: MerklePathWASM);
    static createFromRawInstance(rawInstance: SpendableNoteNAPI): SpendableNoteWASM;
}
