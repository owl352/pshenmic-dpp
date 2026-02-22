import { dppProvider } from '../../provider.js'
import { InstantAssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js'
import { TxOutWASM } from './TxOut.js'
import { OutPointWASM } from './OutPoint.js'
import { InstantLockWASM } from '../InstantLock.js'
import { IdentifierWASM } from '../Identifier.js'

export class InstantAssetLockProofWASM {
  _rawLockProof: InstantAssetLockProofNAPI

  constructor (instantLock: Uint8Array, transaction: Uint8Array, outputIndex: number) {
    this._rawLockProof = new dppProvider.dpp.InstantAssetLockProofNAPI(instantLock, transaction, outputIndex)
  }

  get outputIndex (): number {
    return this._rawLockProof.outputIndex
  }

  set outputIndex (value: number) {
    this._rawLockProof.outputIndex = value
  }

  get instantLock (): InstantLockWASM {
    return InstantLockWASM.createFromRawInstance(this._rawLockProof.instantLock)
  }

  set instantLock (instantLock: InstantLockWASM) {
    this._rawLockProof.instantLock = instantLock._rawInstantLock
  }

  getOutput (): TxOutWASM | null {
    const out = this._rawLockProof.getOutput()

    return out instanceof dppProvider.dpp.TxOutNAPI ? TxOutWASM.createFromRawInstance(out) : out
  }

  getOutPoint (): OutPointWASM | null {
    const out = this._rawLockProof.getOutPoint()

    return out instanceof dppProvider.dpp.OutPointNAPI ? OutPointWASM.createFromRawInstance(out) : out
  }

  getTransaction (): Uint8Array {
    return this._rawLockProof.getTransaction()
  }

  getInstantLockBytes (): Uint8Array {
    return this._rawLockProof.getInstantLockBytes()
  }

  createIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawLockProof.createIdentityId())
  }

  static fromRawObject (obj: {
    instantLock: Uint8Array
    transaction: Uint8Array
    outputIndex: number
  }): InstantAssetLockProofWASM {
    return InstantAssetLockProofWASM.createFromRawInstance(dppProvider.dpp.InstantAssetLockProofNAPI.fromRawObject(obj))
  }

  static createFromRawInstance (rawInstance: InstantAssetLockProofNAPI): InstantAssetLockProofWASM {
    const instance: InstantAssetLockProofWASM = Object.create(this.prototype)
    instance._rawLockProof = rawInstance

    return instance
  }
}
