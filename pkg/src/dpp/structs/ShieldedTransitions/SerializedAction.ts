import type { SerializedActionNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class SerializedActionWASM {
  /** @private **/
  _rawSerializedAction: SerializedActionNAPI

  constructor (
    nullifier: Uint8Array,
    rk: Uint8Array,
    cmx: Uint8Array,
    encryptedNote: Uint8Array,
    cvNet: Uint8Array,
    spendAuthSig: Uint8Array
  ) {
    this._rawSerializedAction = new dppProvider.dpp.SerializedActionNAPI(
      nullifier,
      rk,
      cmx,
      encryptedNote,
      cvNet,
      spendAuthSig
    )
  }

  get nullifier (): Uint8Array {
    return this._rawSerializedAction.nullifier
  }

  set nullifier (value: Uint8Array) {
    this._rawSerializedAction.nullifier = value
  }

  get rk (): Uint8Array {
    return this._rawSerializedAction.rk
  }

  set rk (value: Uint8Array) {
    this._rawSerializedAction.rk = value
  }

  get cmx (): Uint8Array {
    return this._rawSerializedAction.cmx
  }

  set cmx (value: Uint8Array) {
    this._rawSerializedAction.cmx = value
  }

  get encryptedNote (): Uint8Array {
    return this._rawSerializedAction.encrypted_note
  }

  set encryptedNote (value: Uint8Array) {
    this._rawSerializedAction.encrypted_note = value
  }

  get cvNet (): Uint8Array {
    return this._rawSerializedAction.cvNet
  }

  set cvNet (value: Uint8Array) {
    this._rawSerializedAction.cvNet = value
  }

  get spendAuthSig (): Uint8Array {
    return this._rawSerializedAction.spendAuthSig
  }

  set spendAuthSig (value: Uint8Array) {
    this._rawSerializedAction.spendAuthSig = value
  }

  static createFromRawInstance (rawInstance: SerializedActionNAPI): SerializedActionWASM {
    const instance: SerializedActionWASM = Object.create(SerializedActionWASM.prototype)
    instance._rawSerializedAction = rawInstance

    return instance
  }
}