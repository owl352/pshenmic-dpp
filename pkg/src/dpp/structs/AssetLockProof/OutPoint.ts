import { OutPointNAPI} from "../../../../binaries/bindingsTypes.js";
import {dppProvider} from "../../provider.js";

export class OutPointWASM {
  /** @private **/
  _rawOutPoint: OutPointNAPI

  constructor(txId: string, vout: number) {
    this._rawOutPoint = new dppProvider.dpp.OutPointNAPI(txId, vout)
  }

  getVOUT(): number {
    return this._rawOutPoint.getVOUT()
  }

  getTXID(): string {
    return this._rawOutPoint.getTXID()
  }

  bytes(): Uint8Array {
    return this._rawOutPoint.bytes()
  }

  base64(): string {
    return this._rawOutPoint.base64()
  }

  hex(): string {
    return this._rawOutPoint.hex()
  }

  static fromBytes(bytes: Uint8Array) {
    const instance = dppProvider.dpp.OutPointNAPI.fromBytes(bytes)

    return OutPointWASM.createFromRawInstance(instance)
  }

  static fromHex(bytes: string) {
    const instance = dppProvider.dpp.OutPointNAPI.fromHex(bytes)

    return OutPointWASM.createFromRawInstance(instance)
  }

  static fromBase64(bytes: string) {
    const instance = dppProvider.dpp.OutPointNAPI.fromBase64(bytes)

    return OutPointWASM.createFromRawInstance(instance)
  }

  static createFromRawInstance (rawInstance: OutPointNAPI): OutPointWASM {
    const instance: OutPointWASM = Object.create(this.prototype)
    instance._rawOutPoint = rawInstance

    return instance
  }
}
