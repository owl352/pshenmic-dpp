import type { PrivateEncryptedNoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class PrivateEncryptedNoteWASM {
  /** @private **/
  _rawEncryptedNote: PrivateEncryptedNoteNAPI

  constructor (rootEncryptionKeyIndex: number, derivationEncryptionKeyIndex: number, value: Uint8Array) {
    this._rawEncryptedNote = new dppProvider.dpp.PrivateEncryptedNoteNAPI(rootEncryptionKeyIndex, derivationEncryptionKeyIndex, value)
  }

  get rootEncryptionKeyIndex (): number {
    return this._rawEncryptedNote.rootEncryptionKeyIndex
  }

  set rootEncryptionKeyIndex (index: number) {
    this._rawEncryptedNote.rootEncryptionKeyIndex = index
  }

  get derivationEncryptionKeyIndex (): number {
    return this._rawEncryptedNote.derivationEncryptionKeyIndex
  }

  set derivationEncryptionKeyIndex (index: number) {
    this._rawEncryptedNote.derivationEncryptionKeyIndex = index
  }

  get value (): Uint8Array {
    return this._rawEncryptedNote.value
  }

  set value (value: Uint8Array) {
    this._rawEncryptedNote.value = value
  }

  static createFromRawInstance (rawInstance: PrivateEncryptedNoteNAPI): PrivateEncryptedNoteWASM {
    const instance: PrivateEncryptedNoteWASM = Object.create(PrivateEncryptedNoteWASM.prototype)
    instance._rawEncryptedNote = rawInstance

    return instance
  }
}
