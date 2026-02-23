import type { ChainAssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js'
import { OutPointWASM } from './OutPoint.js'
import { dppProvider } from '../../provider.js'
import { IdentifierWASM } from '../Identifier.js'

export class ChainAssetLockProofWASM {
  _rawLockProof: ChainAssetLockProofNAPI

  constructor (coreChainLockedHeight: number, outPoint: OutPointWASM) {
    this._rawLockProof = new dppProvider.dpp.ChainAssetLockProofNAPI(coreChainLockedHeight, outPoint)
  }

  set coreChainLockedHeight (height: number) {
    this._rawLockProof.coreChainLockedHeight = height
  }

  get coreChainLockedHeight (): number {
    return this._rawLockProof.coreChainLockedHeight
  }

  set outPoint (outPoint: OutPointWASM) {
    this._rawLockProof.outPoint = outPoint._rawOutPoint
  }

  get outPoint (): OutPointWASM {
    return OutPointWASM.createFromRawInstance(this._rawLockProof.outPoint)
  }

  createIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawLockProof.createIdentityId())
  }

  static fromRawObject (obj: {
    coreChainLockedHeight: number
    outPoint: OutPointWASM | Uint8Array
  }): ChainAssetLockProofWASM {
    const outPoint = obj.outPoint instanceof Uint8Array ? obj.outPoint : obj.outPoint.bytes()

    return ChainAssetLockProofWASM.createFromRawInstance(dppProvider.dpp.ChainAssetLockProofNAPI.fromRawObject({
      coreChainLockedHeight: obj.coreChainLockedHeight,
      outPoint
    }))
  }

  static createFromRawInstance (rawInstance: ChainAssetLockProofNAPI): ChainAssetLockProofWASM {
    const instance: ChainAssetLockProofWASM = Object.create(this.prototype)
    instance._rawLockProof = rawInstance

    return instance
  }
}
