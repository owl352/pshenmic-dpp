import {valueToDynamicEnum} from "../helpers.js";
import {DashPlatformProtocol, EnumLike, Purpose, SecurityLevel, KeyType} from "../../types.js";
import {IdentityPublicKeyNAPI} from "../../../binaries/bindingsTypes.js";

let dpp: DashPlatformProtocol;

export function setDpp(_dpp: DashPlatformProtocol) {
  dpp = _dpp;
}

export class IdentityPublicKeyWASM {
  _rawIdentityPublicKey: IdentityPublicKeyNAPI;

  constructor(id: number, purpose: EnumLike, securityLevel: EnumLike, keyType: EnumLike, readOnly: boolean, binaryData: string, disabledAt?: bigint) {
    this._rawIdentityPublicKey = new dpp.IdentityPublicKeyNAPI(
      id,
      valueToDynamicEnum(purpose),
      valueToDynamicEnum(securityLevel),
      valueToDynamicEnum(keyType),
      readOnly,
      binaryData,
      disabledAt ? {value: disabledAt.toString()} : undefined,
    )
  }

  get keyId(): number {
    return this._rawIdentityPublicKey.keyId
  }

  get purpose(): string {
    return this._rawIdentityPublicKey.purpose
  }

  get purposeNumber(): Purpose {
    return this._rawIdentityPublicKey.purposeNumber
  }

  get securityLevel(): string {
    return this._rawIdentityPublicKey.securityLevel
  }

  get securityLevelNumber(): SecurityLevel {
    return this._rawIdentityPublicKey.securityLevelNumber
  }

  get keyType(): string {
    return this._rawIdentityPublicKey.keyType
  }

  get keyTypeNumber(): KeyType {
    return this._rawIdentityPublicKey.keyTypeNumber
  }

  get readOnly(): boolean {
    return this._rawIdentityPublicKey.readOnly
  }

  get data(): string {
    return this._rawIdentityPublicKey.data
  }

  get disabledAt(): BigInt | undefined {
    const timestamp = this._rawIdentityPublicKey.disabledAt

    return timestamp ? BigInt(timestamp.value) : undefined
  }

  set keyId(keyId: number) {
    this._rawIdentityPublicKey.keyId = keyId
  }

  set purpose(purpose: EnumLike) {
    this._rawIdentityPublicKey.purpose = valueToDynamicEnum(purpose)
  }

  set purposeNumber(purpose: EnumLike) {
    this._rawIdentityPublicKey.purposeNumber = valueToDynamicEnum(purpose)
  }

  set securityLevel(securityLevel: EnumLike) {
    this._rawIdentityPublicKey.securityLevel = valueToDynamicEnum(securityLevel)
  }

  set securityLevelNumber(securityLevel: EnumLike) {
    this._rawIdentityPublicKey.securityLevelNumber = valueToDynamicEnum(securityLevel)
  }

  set keyType(keyType: EnumLike) {
    this._rawIdentityPublicKey.keyType = valueToDynamicEnum(keyType)
  }

  set keyTypeNumber(keyType: EnumLike) {
    this._rawIdentityPublicKey.keyTypeNumber = valueToDynamicEnum(keyType)
  }

  set readOnly(readOnly: boolean) {
    this._rawIdentityPublicKey.readOnly = readOnly
  }

  set data(binaryData: string) {
    this._rawIdentityPublicKey.data = binaryData
  }

  set disabledAt(disabledAt: string) {
    this._rawIdentityPublicKey.disabledAt = {value: disabledAt}
  }

  removeDisabledAt(): void {
    this._rawIdentityPublicKey.removeDisabledAt()
  }

  getPublicKeyHash(): string {
    return this._rawIdentityPublicKey.getPublicKeyHash()
  }

  isMaster(): boolean {
    return this._rawIdentityPublicKey.isMaster()
  }

  bytes(): Uint8Array {
    return this._rawIdentityPublicKey.bytes()
  }

  hex(): string {
    return this._rawIdentityPublicKey.hex()
  }

  base64(): string {
    return this._rawIdentityPublicKey.base64()
  }

  static fromBytes(bytes: Uint8Array): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromBytes(bytes)

    return this.createFromRawInstance(rawInstance)
  }

  static fromHex(hex: string): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromHex(hex)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBase64(base64: string): IdentityPublicKeyWASM {
    const rawInstance = dpp.IdentityPublicKeyNAPI.fromBase64(base64)

    return this.createFromRawInstance(rawInstance)
  }

  static createFromRawInstance(rawInstance: IdentityPublicKeyNAPI) {
    const instance: IdentityPublicKeyWASM = Object.create(this.prototype)
    instance._rawIdentityPublicKey = rawInstance

    return instance
  }

  getRawInstance(): IdentityPublicKeyNAPI {
    return this._rawIdentityPublicKey
  }
}
