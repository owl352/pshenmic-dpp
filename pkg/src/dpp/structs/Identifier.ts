import { DashPlatformProtocol, IdentifierLike } from '../../types.js'
import { DynamicValue, IdentifierNAPI } from '../../../binaries/bindingsTypes.js'

let dpp: DashPlatformProtocol

export function setDpp (_dpp: DashPlatformProtocol): void {
  dpp = _dpp
}

export class IdentifierWASM {
  _rawIdentifier: IdentifierNAPI

  constructor (rawId: IdentifierLike | IdentifierWASM) {
    if (rawId instanceof IdentifierWASM) {
      return rawId
    } else if (typeof rawId === 'string') {
      const id: DynamicValue = {
        type: 'Text',
        field0: rawId
      }

      this._rawIdentifier = new dpp.IdentifierNAPI(id)
    } else if (rawId instanceof Uint8Array) {
      const id: DynamicValue = {
        type: 'Bytes',
        field0: rawId
      }

      this._rawIdentifier = new dpp.IdentifierNAPI(id)
    } else {
      throw new Error('Invalid raw ID')
    }
  }

  base58 (): string {
    return this._rawIdentifier.base58()
  }

  base64 (): string {
    return this._rawIdentifier.base64()
  }

  hex (): string {
    return this._rawIdentifier.hex()
  }

  bytes (): Uint8Array {
    return this._rawIdentifier.bytes()
  }

  static fromBase58 (id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase58(id))
  }

  static fromBase64 (id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBase64(id))
  }

  static fromHex (id: string): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromHex(id))
  }

  static fromBytes (id: Uint8Array): IdentifierWASM {
    return this.createFromRawInstance(dpp.IdentifierNAPI.fromBytes(id))
  }

  static createFromRawInstance (rawInstance: IdentifierNAPI): IdentifierWASM {
    const instance: IdentifierWASM = Object.create(this.prototype)
    instance._rawIdentifier = rawInstance

    return instance
  }

  getRawInstance (): IdentifierNAPI {
    return this._rawIdentifier
  }
}
