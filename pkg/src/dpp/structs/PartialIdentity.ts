import type { IdentityPublicKeyNAPI, PartialIdentityNAPI } from '../../../binaries/bindingsTypes.js'
import { IdentifierLike } from '../types.js'
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js'
import { dppProvider } from '../provider.js'
import { prepareIdentifierValue } from '../utils.js'
import { IdentifierWASM } from './Identifier.js'

export class PartialIdentityWASM {
  /** @private **/
  _rawPartialIdentity: PartialIdentityNAPI

  constructor (id: IdentifierLike, loadedPublicKeys: {
    [key: number]: IdentityPublicKeyWASM
  }, balance?: bigint, revision?: bigint, notFoundPublicKeys?: number[]) {
    const publicKeysIds = Object.keys(loadedPublicKeys)

    const normalKeys: Array<[number, IdentityPublicKeyNAPI]> = []

    for (const publicKeyId of publicKeysIds) {
      normalKeys.push([
        Number(publicKeyId),
        loadedPublicKeys[Number(publicKeyId)]._rawIdentityPublicKey
      ])
    }

    this._rawPartialIdentity = new dppProvider.dpp.PartialIdentityNAPI(
      prepareIdentifierValue(id),
      normalKeys,
      balance?.toString(),
      revision?.toString(),
      notFoundPublicKeys
    )
  }

  get id (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawPartialIdentity.id)
  }

  set id (id: IdentifierLike) {
    this._rawPartialIdentity.id = prepareIdentifierValue(id)
  }

  get loadedPublicKeys (): { [key: number]: IdentityPublicKeyWASM } {
    const keys = this._rawPartialIdentity.loadedPublicKeys
    const out: { [key: number]: IdentityPublicKeyWASM } = {}

    for (const key of keys) {
      out[key[0]] = IdentityPublicKeyWASM.createFromRawInstance(key[1])
    }

    return out
  }

  set loadedPublicKeys (loadedPublicKeys: {
    [key: number]: IdentityPublicKeyWASM
  }) {
    const publicKeysIds = Object.keys(loadedPublicKeys)

    const normalKeys: Array<[number, IdentityPublicKeyNAPI]> = []

    for (const publicKeyId of publicKeysIds) {
      normalKeys.push([
        Number(publicKeyId),
        loadedPublicKeys[Number(publicKeyId)]._rawIdentityPublicKey
      ])
    }

    this._rawPartialIdentity.loadedPublicKeys = normalKeys
  }

  get balance (): bigint | undefined {
    const balance = this._rawPartialIdentity.balance
    return balance != null ? BigInt(balance) : undefined
  }

  set balance (balance: bigint | undefined | null) {
    this._rawPartialIdentity.balance = balance?.toString()
  }

  get revision (): bigint | undefined {
    const revision = this._rawPartialIdentity.revision
    return revision != null ? BigInt(revision) : undefined
  }

  set revision (revision: bigint | undefined | null) {
    this._rawPartialIdentity.revision = revision?.toString()
  }

  get notFoundPublicKeys (): number[] {
    return this._rawPartialIdentity.notFoundPublicKeys
  }

  set notFoundPublicKeys (keys: number[]) {
    this._rawPartialIdentity.notFoundPublicKeys = keys
  }

  static createFromRawInstance (rawInstance: PartialIdentityNAPI): PartialIdentityWASM {
    const instance: PartialIdentityWASM = Object.create(this.prototype)
    instance._rawPartialIdentity = rawInstance

    return instance
  }
}
