import {IdentityPublicKeyInCreationNAPI} from "../../../binaries/bindingsTypes.js";
import {KeyTypeLike, NetworkLike, PurposeLike, SecurityLevelLike} from "../types.js";
import {ContractBoundsWASM} from "./ContractBounds.js";
import {dppProvider} from "../provider.js";
import {valueToDynamicValue} from "../utils.js";
import {IdentityPublicKeyWASM} from "./IdentityPublicKey.js";
import {PrivateKeyWASM} from "./PrivateKey.js";

export class IdentityPublicKeyInCreationWASM {
  /** @private **/
  _rawKeyInCreation: IdentityPublicKeyInCreationNAPI

  constructor(id: number, purpose: PurposeLike, securityLevel: SecurityLevelLike, keyType: KeyTypeLike, readOnly: boolean, binaryData: Uint8Array, signature?: Uint8Array, contractBounds?: ContractBoundsWASM) {
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

  toIdentityPublicKey(): IdentityPublicKeyWASM {
    return IdentityPublicKeyWASM.createFromRawInstance(this._rawKeyInCreation.toIdentityPublicKey())
  }

  validatePrivateKey(privateKey: string | Uint8Array | PrivateKeyWASM, network: NetworkLike): boolean {
    const normalPrivateKey = privateKey instanceof PrivateKeyWASM ? privateKey._rawPrivateKey : valueToDynamicValue(privateKey)

    return this._rawKeyInCreation.validatePrivateKey(normalPrivateKey, valueToDynamicValue(network))
  }

  getHash(): Uint8Array {
    return this._rawKeyInCreation.getHash()
  }

  get contractBounds(): ContractBoundsWASM | undefined {
    if (this._rawKeyInCreation.contractBounds) {
      return ContractBoundsWASM.createFromRawInstance(this._rawKeyInCreation.contractBounds)
    }
  }

  get keyId(): number {
    return this._rawKeyInCreation.keyId
  }

  get purpose(): string {
    return this._rawKeyInCreation.purpose
  }

  get securityLevel(): string {
    return this._rawKeyInCreation.securityLevel
  }

  get keyType(): string {
    return this._rawKeyInCreation.keyType
  }

  get readOnly(): boolean {
    return this._rawKeyInCreation.readOnly
  }

  get data(): Uint8Array {
    return this._rawKeyInCreation.data
  }

  get signature(): Uint8Array {
    return this._rawKeyInCreation.signature
  }

  set keyId(value: number) {
    this._rawKeyInCreation.keyId = value
  }

  set purpose(value: PurposeLike) {
    this._rawKeyInCreation.purpose = valueToDynamicValue(value)
  }

  set securityLevel(value: SecurityLevelLike) {
    this._rawKeyInCreation.securityLevel = valueToDynamicValue(value)
  }

  set keyType(value: KeyTypeLike) {
    this._rawKeyInCreation.keyType = valueToDynamicValue(value)
  }

  set readOnly(value: boolean) {
    this._rawKeyInCreation.readOnly = value
  }

  set data(value: Uint8Array) {
    this._rawKeyInCreation.data = value
  }

  set signature(value: Uint8Array) {
    this._rawKeyInCreation.signature = value
  }

  set contractBounds(value: ContractBoundsWASM) {
    this._rawKeyInCreation.contractBounds = value._rawContractBounds
  }

  static createFromRawInstance(rawInstance: IdentityPublicKeyInCreationNAPI): IdentityPublicKeyInCreationWASM {
    const instance: IdentityPublicKeyInCreationWASM = Object.create(this.prototype)
    instance._rawKeyInCreation = rawInstance

    return instance
  }
}
