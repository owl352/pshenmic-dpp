import { IdentifierWASM } from './Identifier.js'
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js'
import { IdentifierLike, PlatformVersionLike } from '../types.js'
import { IdentityNAPI } from '../../../binaries/bindingsTypes.js'
import { dppProvider } from '../provider.js'
import { prepareIdentifierValue, valueToDynamicValue } from '../utils.js'

export class IdentityWASM {
  /** @private **/
  _rawIdentity: IdentityNAPI

  constructor (rawId: IdentifierLike, platformVersion?: PlatformVersionLike) {
    const dpp = dppProvider.dpp

    this._rawIdentity = new dpp.IdentityNAPI(prepareIdentifierValue(rawId), valueToDynamicValue(platformVersion))
  }

  set id (rawId: IdentifierLike) {
    this._rawIdentity.id = prepareIdentifierValue(rawId)
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentity.id)
  }

  set balance (balance: bigint) {
    this._rawIdentity.balance = balance.toString()
  }

  get balance (): bigint {
    return BigInt(this._rawIdentity.balance)
  }

  set revision (revision: bigint) {
    this._rawIdentity.revision = revision.toString()
  }

  get revision (): bigint {
    return BigInt(this._rawIdentity.revision)
  }

  addPublicKey (publicKey: IdentityPublicKeyWASM): void {
    this._rawIdentity.addPublicKey(publicKey._rawIdentityPublicKey)
  }

  getPublicKeyById (keyId: number): IdentityPublicKeyWASM | undefined {
    const rawKeyInstance = this._rawIdentity.getPublicKeyById(keyId)

    if (rawKeyInstance != null) {
      return IdentityPublicKeyWASM.createFromRawInstance(rawKeyInstance)
    }

    return undefined
  }

  getPublicKeys (): IdentityPublicKeyWASM[] {
    const rawKeysArr = this._rawIdentity.getPublicKeys()

    return rawKeysArr.map((key) => IdentityPublicKeyWASM.createFromRawInstance(key))
  }

  static fromHex (hex: string): IdentityWASM {
    const rawInstance = dppProvider.dpp.IdentityNAPI.fromHex(hex)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBase64 (base64: string): IdentityWASM {
    const rawInstance = dppProvider.dpp.IdentityNAPI.fromBase64(base64)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBytes (bytes: Uint8Array): IdentityWASM {
    const rawInstance = dppProvider.dpp.IdentityNAPI.fromBytes(bytes)

    return this.createFromRawInstance(rawInstance)
  }

  bytes (): Uint8Array {
    return this._rawIdentity.bytes()
  }

  hex (): string {
    return this._rawIdentity.hex()
  }

  base64 (): string {
    return this._rawIdentity.base64()
  }

  static createFromRawInstance (rawInstance: IdentityNAPI): IdentityWASM {
    const instance: IdentityWASM = Object.create(this.prototype)
    instance._rawIdentity = rawInstance

    return instance
  }

  getRawInstance (): IdentityNAPI {
    return this._rawIdentity
  }
}
