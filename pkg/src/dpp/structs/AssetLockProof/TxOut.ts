import {BigIntString, OutPointNAPI, TxOutNAPI} from "../../../../binaries/bindingsTypes.js";
import {dppProvider} from "../../provider.js";

export class TxOutWASM {
  _rawTxOut: TxOutNAPI

  constructor(value: bigint, scriptPubKey: Uint8Array) {
    const rsValue: BigIntString = value.toString();

    this._rawTxOut = new dppProvider.dpp.TxOutNAPI(rsValue, scriptPubKey);
  }

  get value(): bigint {
    return BigInt(this._rawTxOut.value)
  }

  get scriptPubKeyHex(): string {
    return this._rawTxOut.scriptPubKeyHex
  }

  get scriptPubKeyBytes(): Uint8Array {
    return this._rawTxOut.scriptPubKeyBytes
  }

  set value(value: bigint) {
    this._rawTxOut.value = value.toString()
  }

  set scriptPubKeyHex(script: string) {
    this._rawTxOut.scriptPubKeyHex = script
  }

  set scriptPubKeyBytes(script: Uint8Array) {
    this._rawTxOut.scriptPubKeyBytes = script
  }

  getScriptPubKeyASM(): string {
    return this._rawTxOut.getScriptPubKeyASM()
  }

  static createFromRawInstance (rawInstance: TxOutNAPI): TxOutWASM {
    const instance: TxOutWASM = Object.create(this.prototype)
    instance._rawTxOut = rawInstance

    return instance
  }
}
