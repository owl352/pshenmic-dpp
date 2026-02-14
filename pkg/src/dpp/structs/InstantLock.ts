import {InstantLockNAPI} from "../../../binaries/bindingsTypes.js";
import {OutPointWASM} from "./AssetLockProof/OutPoint.js";
import {dppProvider} from "../provider.js";

export class InstantLockWASM {
  _rawInstantLock: InstantLockNAPI

  constructor(version: number, inputs: OutPointWASM[], txId: string, cycleHash: string, blsSignature: string) {
    this._rawInstantLock = new dppProvider.dpp.InstantLockNAPI(version, inputs.map(input => input._rawOutPoint), txId, cycleHash, blsSignature)
  }

  get version(): number {
    return this._rawInstantLock.version
  }

  get inputs(): OutPointWASM[] {
    return this.inputs.map(OutPointWASM.createFromRawInstance)
  }

  get txid(): string {
    return this._rawInstantLock.txid
  }

  get cyclehash(): string {
    return this._rawInstantLock.cyclehash
  }

  get blsSignature(): string {
    return this._rawInstantLock.blsSignature
  }

  set version(version: number) {
    this._rawInstantLock.version = version
  }

  set inputs(inputs: OutPointWASM[]) {
    this._rawInstantLock.inputs = inputs.map(input => input._rawOutPoint)
  }

  set txid(txid: string) {
    this._rawInstantLock.txid = txid
  }

  set cyclehash(hash: string) {
    this._rawInstantLock.cyclehash = hash
  }

  set blsSignature(sig: string) {
    this._rawInstantLock.blsSignature = sig
  }

  static createFromRawInstance(rawInstance: InstantLockNAPI): InstantLockWASM {
    const instance: InstantLockWASM = Object.create(this.prototype)
    instance._rawInstantLock = rawInstance

    return instance
  }

}
