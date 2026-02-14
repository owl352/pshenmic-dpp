import {PublicKeyNAPI} from "../../../binaries/bindingsTypes.js";
import {dppProvider} from "../provider.js";

export class PublicKeyWASM {
  /** @private **/
  _rawPublicKey: PublicKeyNAPI

  constructor(compressed: boolean, bytes: Uint8Array) {
    this._rawPublicKey = new dppProvider.dpp.PublicKeyNAPI(compressed, bytes)
  }

  get compressed(): boolean {
    return this._rawPublicKey.compressed
  }

  get inner(): Uint8Array {
    return this._rawPublicKey.inner
  }

  set compressed(value: boolean) {
    this._rawPublicKey.compressed = value
  }

  set inner(value: Uint8Array) {
    this._rawPublicKey.inner = value
  }

  getPublicKeyHash(): string {
    return this._rawPublicKey.getPublicKeyHash()
  }

  hash160(): Uint8Array {
    return this._rawPublicKey.hash160()
  }

  bytes(): Uint8Array {
    return this._rawPublicKey.bytes()
  }

  static fromBytes(bytes: Uint8Array): PublicKeyWASM {
    return PublicKeyWASM.createFromRawInstance(dppProvider.dpp.PublicKeyNAPI.fromBytes(bytes))
  }

  static createFromRawInstance(rawInstance: PublicKeyNAPI): PublicKeyWASM {
    const instance: PublicKeyWASM = Object.create(this.prototype)
    instance._rawPublicKey = rawInstance

    return instance
  }
}
