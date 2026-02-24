import type { AssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js'
import { InstantAssetLockProofWASM } from './InstantAssetLockProof.js'
import { ChainAssetLockProofWASM } from './ChainAssetLockProof.js'
import { dppProvider } from '../../provider.js'
import { OutPointWASM } from './OutPoint.js'
import { IdentifierWASM } from '../Identifier.js'

export class AssetLockProofWASM {
  _rawAssetLockProof: AssetLockProofNAPI

  constructor (lockProof: InstantAssetLockProofWASM | ChainAssetLockProofWASM) {
    this._rawAssetLockProof = new dppProvider.dpp.AssetLockProofNAPI(lockProof._rawLockProof)
  }

  static createInstantAssetLockProof (instantLock: Uint8Array, transaction: Uint8Array, outputIndex: number): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(
      dppProvider
        .dpp
        .AssetLockProofNAPI
        .createInstantAssetLockProof(instantLock, transaction, outputIndex))
  }

  static createChainAssetLockProof (coreChainLockedHeight: number, outPoint: OutPointWASM): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(
      dppProvider
        .dpp
        .AssetLockProofNAPI
        .createChainAssetLockProof(coreChainLockedHeight, outPoint._rawOutPoint)
    )
  }

  getLockType (): string {
    return this._rawAssetLockProof.getLockType()
  }

  getInstantLockProof (): InstantAssetLockProofWASM {
    return InstantAssetLockProofWASM.createFromRawInstance(this._rawAssetLockProof.getInstantLockProof())
  }

  getChainLockProof (): ChainAssetLockProofWASM {
    return ChainAssetLockProofWASM.createFromRawInstance(this._rawAssetLockProof.getChainLockProof())
  }

  getOutPoint (): OutPointWASM | null {
    const outPoint = this._rawAssetLockProof.getOutPoint()
    return (outPoint != null) ? OutPointWASM.createFromRawInstance(outPoint) : null
  }

  createIdentityId (): IdentifierWASM {
    return IdentifierWASM.createFromRawInstance(this._rawAssetLockProof.createIdentityId())
  }

  hex (): string {
    return this._rawAssetLockProof.hex()
  }

  static fromHex (value: string): AssetLockProofWASM {
    return AssetLockProofWASM.createFromRawInstance(dppProvider.dpp.AssetLockProofNAPI.fromHex(value))
  }

  static createFromRawInstance (rawInstance: AssetLockProofNAPI): AssetLockProofWASM {
    const instance: AssetLockProofWASM = Object.create(AssetLockProofWASM.prototype)
    instance._rawAssetLockProof = rawInstance

    return instance
  }
}
