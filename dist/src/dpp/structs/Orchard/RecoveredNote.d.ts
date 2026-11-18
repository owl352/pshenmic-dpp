import type { RecoveredNoteNAPI } from 'dash-platform-shielded/bindingsTypes';
import { NoteWASM } from './Note.js';
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js';
/** A note recovered from a shielded action by trial-decryption. */
export declare class RecoveredNoteWASM {
    /** @private **/
    _rawRecoveredNote: RecoveredNoteNAPI;
    /** The action's global leaf position in the commitment tree. */
    get index(): number;
    get note(): NoteWASM;
    get nullifier(): Uint8Array;
    static createFromRawInstance(rawInstance: RecoveredNoteNAPI): RecoveredNoteWASM;
}
/**
 * Recovers your own notes from a set of shielded actions by trial-decrypting
 * each with the viewing key derived from `seed` (ZIP-32 m/32'/coinType'/account').
 * Only actions addressed to you are returned; `index` is the global leaf position.
 */
export declare function recoverNotes(actions: SerializedActionWASM[], seed: Uint8Array, coinType: number, account: number): RecoveredNoteWASM[];
