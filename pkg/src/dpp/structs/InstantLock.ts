import type { InstantLockNAPI } from '../../../binaries/bindingsTypes.js'
import { OutPointWASM } from './AssetLockProof/OutPoint.js'
import { dppProvider } from '../provider.js'

export class InstantLockWASM {
  _rawInstantLock: InstantLockNAPI

  constructor (version: number, inputs: OutPointWASM[], txId: string, cycleHash: string, blsSignature: string) {
    this._rawInstantLock = new dppProvider.dpp.InstantLockNAPI(version, inputs.map(input => input._rawOutPoint), txId, cycleHash, blsSignature)
  }

  get version (): number {
    return this._rawInstantLock.version
  }

  set version (version: number) {
    this._rawInstantLock.version = version
  }

  get inputs (): OutPointWASM[] {
    return this.inputs.map(OutPointWASM.createFromRawInstance)
  }

  set inputs (inputs: OutPointWASM[]) {
    this._rawInstantLock.inputs = inputs.map(input => input._rawOutPoint)
  }

  get txid (): string {
    return this._rawInstantLock.txid
  }

  set txid (txid: string) {
    this._rawInstantLock.txid = txid
  }

  get cyclehash (): string {
    return this._rawInstantLock.cyclehash
  }

  set cyclehash (hash: string) {
    this._rawInstantLock.cyclehash = hash
  }

  get blsSignature (): string {
    return this._rawInstantLock.blsSignature
  }

  set blsSignature (sig: string) {
    this._rawInstantLock.blsSignature = sig
  }

  static createFromRawInstance (rawInstance: InstantLockNAPI): InstantLockWASM {
    const instance: InstantLockWASM = Object.create(InstantLockWASM.prototype)
    instance._rawInstantLock = rawInstance

    return instance
  }
}
