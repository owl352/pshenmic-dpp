import type { SpendableNoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { NoteWASM } from './Note.js'
import { MerklePathWASM } from './MerklePath.js'

export class SpendableNoteWASM {
  /** @private **/
  _rawSpendableNote: SpendableNoteNAPI

  constructor (note: NoteWASM, merklePath: MerklePathWASM) {
    this._rawSpendableNote = new dppProvider.dpp.SpendableNoteNAPI(
      note._rawNote,
      merklePath._rawMerklePath
    )
  }

  get note (): NoteWASM {
    return NoteWASM.createFromRawInstance(this._rawSpendableNote.note)
  }

  set note (value: NoteWASM) {
    this._rawSpendableNote.note = value._rawNote
  }

  get merklePath (): MerklePathWASM {
    return MerklePathWASM.createFromRawInstance(this._rawSpendableNote.merklePath)
  }

  set merklePath (value: MerklePathWASM) {
    this._rawSpendableNote.merklePath = value._rawMerklePath
  }

  static createFromRawInstance (rawInstance: SpendableNoteNAPI): SpendableNoteWASM {
    const instance: SpendableNoteWASM = Object.create(SpendableNoteWASM.prototype)
    instance._rawSpendableNote = rawInstance

    return instance
  }
}