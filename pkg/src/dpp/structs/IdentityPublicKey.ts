import { valueToDynamicEnum } from '../helpers.js'
import { DashPlatformProtocol, KeyTypeLike, PurposeLike, SecurityLevelLike } from '../../types.js'
import { IdentityPublicKeyNAPI } from '../../../binaries/bindingsTypes.js'
import { KeyType, Purpose, SecurityLevel } from '../../enums.js'

let dpp: DashPlatformProtocol

export function setDpp (_dpp: DashPlatformProtocol): void {
  dpp = _dpp
}

export class IdentityPublicKeyWASM {
  /** @private **/
  _rawIdentityPublicKey: IdentityPublicKeyNAPI

  constructor (id: number, purpose: PurposeLike, securityLevel: SecurityLevelLike, keyType: KeyTypeLike, readOnly: boolean, binaryData: string, disabledAt?: bigint) {
    if (purpose == null || securityLevel == null || keyType == null) {
      throw new Error('purpose, securityLevel, keyType must be specified')
    }

    this._rawIdentityPublicKey = new dpp.IdentityPublicKeyNAPI(
      id,
      valueToDynamicEnum(purpose),
      valueToDynamicEnum(securityLevel),
      valueToDynamicEnum(keyType),
      readOnly,
      binaryData,
      disabledAt != null ? { value: disabledAt.toString() } : undefined
    )
  }

  get keyId (): number {
    return this._rawIdentityPublicKey.keyId
  }

  set keyId (keyId: number) {
    this._rawIdentityPublicKey.keyId = keyId
  }

  get purpose (): string {
    return this._rawIdentityPublicKey.purpose
  }

  set purpose (purpose: PurposeLike) {
    this._rawIdentityPublicKey.purpose = valueToDynamicEnum(purpose)
  }

  get purposeNumber (): Purpose {
    return this._rawIdentityPublicKey.purposeNumber
  }

  set purposeNumber (purpose: Purpose) {
    this._rawIdentityPublicKey.purposeNumber = valueToDynamicEnum(purpose)
  }

  get securityLevel (): string {
    return this._rawIdentityPublicKey.securityLevel
  }

  set securityLevel (securityLevel: SecurityLevelLike) {
    this._rawIdentityPublicKey.securityLevel = valueToDynamicEnum(securityLevel)
  }

  get securityLevelNumber (): SecurityLevel {
    return this._rawIdentityPublicKey.securityLevelNumber
  }

  set securityLevelNumber (securityLevel: SecurityLevel) {
    this._rawIdentityPublicKey.securityLevelNumber = valueToDynamicEnum(securityLevel)
  }

  get keyType (): string {
    return this._rawIdentityPublicKey.keyType
  }

  set keyType (keyType: KeyTypeLike) {
    this._rawIdentityPublicKey.keyType = valueToDynamicEnum(keyType)
  }

  get keyTypeNumber (): KeyType {
    return this._rawIdentityPublicKey.keyTypeNumber
  }

  set keyTypeNumber (keyType: KeyType) {
    this._rawIdentityPublicKey.keyTypeNumber = valueToDynamicEnum(keyType)
  }

  get readOnly (): boolean {
    return this._rawIdentityPublicKey.readOnly
  }

  set readOnly (readOnly: boolean) {
    this._rawIdentityPublicKey.readOnly = readOnly
  }

  get data (): string {
    return this._rawIdentityPublicKey.data
  }

  set data (binaryData: string) {
    this._rawIdentityPublicKey.data = binaryData
  }

  get disabledAt (): BigInt | undefined {
    const timestamp = this._rawIdentityPublicKey.disabledAt

    return (timestamp != null) ? BigInt(timestamp.value) : undefined
  }

  set disabledAt (disabledAt: string) {
    this._rawIdentityPublicKey.disabledAt = { value: disabledAt }
  }

  removeDisabledAt (): void {
    this._rawIdentityPublicKey.removeDisabledAt()
  }

  getPublicKeyHash (): string {
    return this._rawIdentityPublicKey.getPublicKeyHash()
  }

  isMaster (): boolean {
    return this._rawIdentityPublicKey.isMaster()
  }

  bytes (): Uint8Array {
    return this._rawIdentityPublicKey.bytes()
  }

  hex (): string {
    return this._rawIdentityPublicKey.hex()
  }

  base64 (): string {
    return this._rawIdentityPublicKey.base64()
  }

  static fromBytes (bytes: Uint8Array): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromBytes(bytes)

    return this.createFromRawInstance(rawInstance)
  }

  static fromHex (hex: string): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromHex(hex)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBase64 (base64: string): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromBase64(base64)

    return this.createFromRawInstance(rawInstance)
  }

  static createFromRawInstance (rawInstance: IdentityPublicKeyNAPI): IdentityPublicKeyWASM {
    const instance: IdentityPublicKeyWASM = Object.create(this.prototype)
    instance._rawIdentityPublicKey = rawInstance

    return instance
  }

  getRawInstance (): IdentityPublicKeyNAPI {
    return this._rawIdentityPublicKey
  }
}
