import { IdentityPublicKeyInCreationNAPI } from '../../../binaries/bindingsTypes.js'
import { KeyTypeLike, NetworkLike, PurposeLike, SecurityLevelLike } from '../types.js'
import { ContractBoundsWASM } from './ContractBounds.js'
import { dppProvider } from '../provider.js'
import { valueToDynamicValue } from '../utils.js'
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js'
import { PrivateKeyWASM } from './PrivateKey.js'

export class IdentityPublicKeyInCreationWASM {
  /** @private **/
  _rawKeyInCreation: IdentityPublicKeyInCreationNAPI

  constructor (id: number, purpose: PurposeLike, securityLevel: SecurityLevelLike, keyType: KeyTypeLike, readOnly: boolean, binaryData: Uint8Array, signature?: Uint8Array, contractBounds?: ContractBoundsWASM) {
    this._rawKeyInCreation = new dppProvider.dpp.IdentityPublicKeyInCreationNAPI(
      id,
      valueToDynamicValue(purpose),
      valueToDynamicValue(securityLevel),
      valueToDynamicValue(keyType),
      readOnly,
      binaryData,
      signature,
      contractBounds?._rawContractBounds
    )
  }

  toIdentityPublicKey (): IdentityPublicKeyWASM {
    return IdentityPublicKeyWASM.createFromRawInstance(this._rawKeyInCreation.toIdentityPublicKey())
  }

  validatePrivateKey (privateKey: string | Uint8Array | PrivateKeyWASM, network: NetworkLike): boolean {
    const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey)

    return this._rawKeyInCreation.validatePrivateKey(normalPrivateKey, valueToDynamicValue(network))
  }

  getHash (): Uint8Array {
    return this._rawKeyInCreation.getHash()
  }

  get contractBounds (): ContractBoundsWASM | undefined {
    if (this._rawKeyInCreation.contractBounds != null) {
      return ContractBoundsWASM.createFromRawInstance(this._rawKeyInCreation.contractBounds)
    }
  }

  set contractBounds (value: ContractBoundsWASM) {
    this._rawKeyInCreation.contractBounds = value._rawContractBounds
  }

  get keyId (): number {
    return this._rawKeyInCreation.keyId
  }

  set keyId (value: number) {
    this._rawKeyInCreation.keyId = value
  }

  get purpose (): string {
    return this._rawKeyInCreation.purpose
  }

  set purpose (value: PurposeLike) {
    this._rawKeyInCreation.purpose = valueToDynamicValue(value)
  }

  get securityLevel (): string {
    return this._rawKeyInCreation.securityLevel
  }

  set securityLevel (value: SecurityLevelLike) {
    this._rawKeyInCreation.securityLevel = valueToDynamicValue(value)
  }

  get keyType (): string {
    return this._rawKeyInCreation.keyType
  }

  set keyType (value: KeyTypeLike) {
    this._rawKeyInCreation.keyType = valueToDynamicValue(value)
  }

  get readOnly (): boolean {
    return this._rawKeyInCreation.readOnly
  }

  set readOnly (value: boolean) {
    this._rawKeyInCreation.readOnly = value
  }

  get data (): Uint8Array {
    return this._rawKeyInCreation.data
  }

  set data (value: Uint8Array) {
    this._rawKeyInCreation.data = value
  }

  get signature (): Uint8Array {
    return this._rawKeyInCreation.signature
  }

  set signature (value: Uint8Array) {
    this._rawKeyInCreation.signature = value
  }

  static createFromRawInstance (rawInstance: IdentityPublicKeyInCreationNAPI): IdentityPublicKeyInCreationWASM {
    const instance: IdentityPublicKeyInCreationWASM = Object.create(this.prototype)
    instance._rawKeyInCreation = rawInstance

    return instance
  }
}
