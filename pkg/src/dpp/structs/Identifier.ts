import { IdentifierLike } from '../../types.js'
import { IdentifierNAPI } from '../../../binaries/bindingsTypes.js'
import {dppProvider} from "../provider.js";

export class IdentifierWASM {
  /** @private **/
  _rawIdentifier: IdentifierNAPI

  constructor (rawId: IdentifierLike | IdentifierWASM) {
    const dpp = dppProvider.getDpp()

    if (rawId instanceof IdentifierWASM) {
      return rawId
    } else if (rawId instanceof Uint8Array || typeof rawId === 'string') {
      const id = new dpp.DynamicValue(rawId)

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
    return this.createFromRawInstance(dppProvider.getDpp().IdentifierNAPI.fromBase58(id))
  }

  static fromBase64 (id: string): IdentifierWASM {
    return this.createFromRawInstance(dppProvider.getDpp().IdentifierNAPI.fromBase64(id))
  }

  static fromHex (id: string): IdentifierWASM {
    return this.createFromRawInstance(dppProvider.getDpp().IdentifierNAPI.fromHex(id))
  }

  static fromBytes (id: Uint8Array): IdentifierWASM {
    return this.createFromRawInstance(dppProvider.getDpp().IdentifierNAPI.fromBytes(id))
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
