import {PrivateKeyNAPI} from "../../../binaries/bindingsTypes.js";
import {NetworkLike} from "../types.js";
import {dppProvider} from "../provider.js";
import {valueToDynamicValue} from "../utils.js";
import {PublicKeyWASM} from "./PublicKey.js";

export class PrivateKeyWASM {
  /** @private **/
  _rawPrivateKey: PrivateKeyNAPI

  constructor(key: string | Uint8Array, network: NetworkLike) {
    this._rawPrivateKey = new dppProvider.dpp.PrivateKeyNAPI(valueToDynamicValue(key), valueToDynamicValue(network));
  }

  getPublicKey(): PublicKeyWASM {
    return PublicKeyWASM.createFromRawInstance(this._rawPrivateKey.getPublicKey())
  }

  getNetwork(): string {
    return this._rawPrivateKey.getNetwork()
  }

  WIF(): string {
    return this._rawPrivateKey.WIF()
  }

  bytes(): Uint8Array {
    return this._rawPrivateKey.bytes()
  }

  hex(): string {
    return this._rawPrivateKey.hex()
  }

  getPublicKeyHash(): string {
    return this._rawPrivateKey.getPublicKeyHash()
  }

  sign(data: Uint8Array): Uint8Array {
    return this._rawPrivateKey.sign(data)
  }

  signHash(dataHash: Uint8Array): Uint8Array {
    return this._rawPrivateKey.signHash(dataHash)
  }

  static fromWIF(wif: string): PrivateKeyWASM {
    return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromWIF(wif))
  }

  static fromBytes(bytes: Uint8Array, network: NetworkLike): PrivateKeyWASM {
    return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromBytes(bytes, valueToDynamicValue(network)))
  }

  static fromHex(hex: string, network: NetworkLike): PrivateKeyWASM {
    return PrivateKeyWASM.createFromRawInstance(dppProvider.dpp.PrivateKeyNAPI.fromHex(hex, valueToDynamicValue(network)))
  }

  static createFromRawInstance(rawInstance: PrivateKeyNAPI): PrivateKeyWASM {
    const instance: PrivateKeyWASM = Object.create(this.prototype)
    instance._rawPrivateKey = rawInstance

    return instance
  }
}
