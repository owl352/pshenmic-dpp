import type { RecoveredNoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { NoteWASM } from './Note.js'
import { SerializedActionWASM } from '../ShieldedTransitions/SerializedAction.js'

/** A note recovered from a shielded action by trial-decryption. */
export class RecoveredNoteWASM {
  /** @private **/
  _rawRecoveredNote: RecoveredNoteNAPI

  /** The action's global leaf position in the commitment tree. */
  get index (): number {
    return this._rawRecoveredNote.index
  }

  get note (): NoteWASM {
    return NoteWASM.createFromRawInstance(this._rawRecoveredNote.note)
  }

  get nullifier (): Uint8Array {
    return this._rawRecoveredNote.nullifier
  }

  static createFromRawInstance (rawInstance: RecoveredNoteNAPI): RecoveredNoteWASM {
    const instance: RecoveredNoteWASM = Object.create(RecoveredNoteWASM.prototype)
    instance._rawRecoveredNote = rawInstance

    return instance
  }
}

/**
 * Recovers your own notes from a set of shielded actions by trial-decrypting
 * each with the viewing key derived from `seed` (ZIP-32 m/32'/coinType'/account').
 * Only actions addressed to you are returned; `index` is the global leaf position.
 */
export function recoverNotes (
  actions: SerializedActionWASM[],
  seed: Uint8Array,
  coinType: number,
  account: number
): RecoveredNoteWASM[] {
  return dppProvider.dpp
    .recoverNotes(actions.map(a => a._rawSerializedAction), seed, coinType, account)
    .map(RecoveredNoteWASM.createFromRawInstance)
}
