import {SharedEncryptedNoteNAPI} from "../../../../binaries/bindingsTypes.js";
import {dppProvider} from "../../provider.js";

export class SharedEncryptedNoteWASM {
  _rawSharedNote: SharedEncryptedNoteNAPI

  constructor(senderKeyIndex: number, recipientKeyIndex: number, value: Uint8Array) {
    this._rawSharedNote = new dppProvider.dpp.SharedEncryptedNoteNAPI(senderKeyIndex, recipientKeyIndex, value)
  }

  get senderKeyIndex(): number {
    return this._rawSharedNote.senderKeyIndex
  }

  get recipientKeyIndex(): number {
    return this._rawSharedNote.recipientKeyIndex
  }

  get value(): Uint8Array {
    return this._rawSharedNote.value
  }

  set senderKeyIndex(index: number) {
    this._rawSharedNote.senderKeyIndex = index
  }

  set recipientKeyIndex(index: number) {
    this._rawSharedNote.recipientKeyIndex = index
  }

  set value(value: Uint8Array) {
    this._rawSharedNote.value = value
  }

  static createFromRawInstance(rawInstance: SharedEncryptedNoteNAPI): SharedEncryptedNoteWASM {
    const instance: SharedEncryptedNoteWASM = Object.create(this.prototype)
    instance._rawSharedNote = rawInstance

    return instance
  }
}
