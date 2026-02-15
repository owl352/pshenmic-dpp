import {PrivateEncryptedNoteNAPI} from "../../../../binaries/bindingsTypes.js";
import {dppProvider} from "../../provider.js";

export class PrivateEncryptedNoteWASM {
  _rawEncryptedNote: PrivateEncryptedNoteNAPI

  constructor(rootEncryptionKeyIndex: number, derivationEncryptionKeyIndex: number, value: Uint8Array) {
    this._rawEncryptedNote = new dppProvider.dpp.PrivateEncryptedNoteNAPI(rootEncryptionKeyIndex, derivationEncryptionKeyIndex, value)
  }

  get rootEncryptionKeyIndex(): number {
    return this._rawEncryptedNote.rootEncryptionKeyIndex
  }

  get derivationEncryptionKeyIndex(): number {
    return this._rawEncryptedNote.derivationEncryptionKeyIndex
  }

  get value(): Uint8Array {
    return this._rawEncryptedNote.value
  }

  set rootEncryptionKeyIndex(index: number) {
    this._rawEncryptedNote.rootEncryptionKeyIndex = index
  }

  set derivationEncryptionKeyIndex(index: number) {
    this._rawEncryptedNote.derivationEncryptionKeyIndex = index
  }

  set value(value: Uint8Array) {
    this._rawEncryptedNote.value = value
  }

  static createFromRawInstance(rawInstance: PrivateEncryptedNoteNAPI): PrivateEncryptedNoteWASM {
    const instance: PrivateEncryptedNoteWASM = Object.create(this.prototype)
    instance._rawEncryptedNote = rawInstance

    return instance
  }
}
