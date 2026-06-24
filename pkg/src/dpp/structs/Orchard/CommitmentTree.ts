import type { CommitmentTreeNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'
import { MerklePathWASM } from './MerklePath.js'

export class CommitmentTreeWASM {
  /** @private **/
  _rawCommitmentTree: CommitmentTreeNAPI

  constructor (maxCheckpoints?: number) {
    this._rawCommitmentTree = new dppProvider.dpp.CommitmentTreeNAPI(maxCheckpoints)
  }

  /** Appends a note commitment (cmx). `marked` = spendable (can be witnessed). */
  append (cmx: Uint8Array, marked: boolean): void {
    this._rawCommitmentTree.append(cmx, marked)
  }

  checkpoint (checkpointId: number): boolean {
    return this._rawCommitmentTree.checkpoint(checkpointId)
  }

  maxLeafPosition (): number | null {
    return this._rawCommitmentTree.maxLeafPosition()
  }

  witness (position: number, checkpointDepth?: number): MerklePathWASM | null {
    const path = this._rawCommitmentTree.witness(position, checkpointDepth)
    return path != null ? MerklePathWASM.createFromRawInstance(path) : null
  }

  anchor (): Uint8Array {
    return this._rawCommitmentTree.anchor()
  }

  static createFromRawInstance (rawInstance: CommitmentTreeNAPI): CommitmentTreeWASM {
    const instance: CommitmentTreeWASM = Object.create(CommitmentTreeWASM.prototype)
    instance._rawCommitmentTree = rawInstance

    return instance
  }
}