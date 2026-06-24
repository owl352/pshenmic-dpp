import type { NoteNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { OrchardAddressWASM } from './OrchardAddress.js'

export class NoteWASM {
  /** @private **/
  _rawNote: NoteNAPI

  constructor (address: OrchardAddressWASM, value: bigint, rho: Uint8Array, rseed: Uint8Array) {
    this._rawNote = new dppProvider.dpp.NoteNAPI(
      address._rawOrchardAddress,
      value.toString(),
      rho,
      rseed
    )
  }

  get address (): OrchardAddressWASM {
    return OrchardAddressWASM.createFromRawInstance(this._rawNote.address)
  }

  set address (value: OrchardAddressWASM) {
    this._rawNote.address = value._rawOrchardAddress
  }

  get value (): bigint {
    return BigInt(this._rawNote.value)
  }

  set value (value: bigint) {
    this._rawNote.value = value.toString()
  }

  get rho (): Uint8Array {
    return this._rawNote.rho
  }

  set rho (value: Uint8Array) {
    this._rawNote.rho = value
  }

  get rseed (): Uint8Array {
    return this._rawNote.rseed
  }

  set rseed (value: Uint8Array) {
    this._rawNote.rseed = value
  }

  /** The note commitment (cmx, 32 bytes) — its leaf in the commitment tree. */
  get cmx (): Uint8Array {
    return this._rawNote.cmx
  }

  static createFromRawInstance (rawInstance: NoteNAPI): NoteWASM {
    const instance: NoteWASM = Object.create(NoteWASM.prototype)
    instance._rawNote = rawInstance

    return instance
  }
}