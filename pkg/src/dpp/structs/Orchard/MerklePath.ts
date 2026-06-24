import type { MerklePathNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

export class MerklePathWASM {
  /** @private **/
  _rawMerklePath: MerklePathNAPI

  constructor (position: number, authPath: Uint8Array[]) {
    this._rawMerklePath = new dppProvider.dpp.MerklePathNAPI(position, authPath)
  }

  get position (): number {
    return this._rawMerklePath.position
  }

  set position (value: number) {
    this._rawMerklePath.position = value
  }

  get authPath (): Uint8Array[] {
    return this._rawMerklePath.authPath
  }

  set authPath (value: Uint8Array[]) {
    this._rawMerklePath.authPath = value
  }

  static createFromRawInstance (rawInstance: MerklePathNAPI): MerklePathWASM {
    const instance: MerklePathWASM = Object.create(MerklePathWASM.prototype)
    instance._rawMerklePath = rawInstance

    return instance
  }
}