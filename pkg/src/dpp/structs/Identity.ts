import {IdentifierWASM} from "./Identifier.js";
import {IdentityPublicKeyWASM} from "./IdentityPublicKey.js";
import {valueToDynamicEnum} from "../helpers.js";
import {DashPlatformProtocol, EnumLike, IdentifierLike} from "../../types.js";
import {DynamicValue, IdentityNAPI} from "../../../binaries/bindingsTypes.js";

let dpp: DashPlatformProtocol;

export function setDpp(_dpp: DashPlatformProtocol) {
  dpp = _dpp;
}

export class IdentityWASM {
  _rawIdentity: IdentityNAPI

  constructor(rawId: IdentifierLike | IdentifierWASM, platformVersion: EnumLike) {
    const id = new IdentifierWASM(rawId);

    let dynamicEnumValue: DynamicValue = valueToDynamicEnum(platformVersion)

    this._rawIdentity = new dpp.IdentityNAPI(id, dynamicEnumValue)
  }

  set id(rawId: IdentifierLike | IdentifierWASM) {
    this._rawIdentity.id = new IdentifierWASM(rawId);
  }

  set balance(balance: BigInt) {
    this._rawIdentity.balance = {value: balance.toString()}
  }

  set revision(revision: BigInt) {
    this._rawIdentity.revision = {value: revision.toString()}
  }

  get id(): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawIdentity.id)
  }

  get balance(): BigInt {
    return BigInt(this._rawIdentity.balance.value)
  }

  get revision(): BigInt {
    return BigInt(this._rawIdentity.revision.value)
  }

  addPublicKey(publicKey: IdentityPublicKeyWASM): void {
    this._rawIdentity.addPublicKey(publicKey.getRawInstance())
  }

  getPublicKeyById(keyId: number): IdentityPublicKeyWASM | undefined {
    const rawKeyInstance = this._rawIdentity.getPublicKeyById(keyId)

    if (rawKeyInstance) {

      return IdentityPublicKeyWASM.createFromRawInstance(rawKeyInstance)
    }

    return undefined
  }

  getPublicKeys(): Array<IdentityPublicKeyWASM> {
    const rawKeysArr = this._rawIdentity.getPublicKeys()

    return rawKeysArr.map(IdentityPublicKeyWASM.createFromRawInstance)
  }

  static fromHex(hex: string): IdentityWASM {
    const rawInstance = dpp.IdentityNAPI.fromHex(hex)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBase64(base64: string): IdentityWASM {
    const rawInstance = dpp.IdentityNAPI.fromBase64(base64)

    return this.createFromRawInstance(rawInstance)
  }

  static fromBytes(bytes: Uint8Array): IdentityWASM {
    const rawInstance = dpp.IdentityNAPI.fromBytes(bytes)

    return this.createFromRawInstance(rawInstance)
  }

  bytes(): Uint8Array {
    return this._rawIdentity.bytes()
  }

  hex(): string {
    return this._rawIdentity.hex()
  }

  base64(): string {
    return this._rawIdentity.base64()
  }

  static createFromRawInstance(rawInstance: IdentityNAPI) {
    const instance: IdentityWASM = Object.create(this.prototype)
    instance._rawIdentity = rawInstance

    return instance
  }

  getRawInstance(): IdentityNAPI {
    return this._rawIdentity
  }
}
