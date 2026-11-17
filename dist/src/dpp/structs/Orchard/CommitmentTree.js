import { dppProvider } from '../../provider.js';
import { MerklePathWASM } from './MerklePath.js';
export class CommitmentTreeWASM {
    /** @private **/
    _rawCommitmentTree;
    constructor(maxCheckpoints) {
        this._rawCommitmentTree = new dppProvider.shielded.CommitmentTreeNAPI(maxCheckpoints);
    }
    /** Appends a note commitment (cmx). `marked` = spendable (can be witnessed). */
    append(cmx, marked) {
        this._rawCommitmentTree.append(cmx, marked);
    }
    checkpoint(checkpointId) {
        return this._rawCommitmentTree.checkpoint(checkpointId);
    }
    maxLeafPosition() {
        return this._rawCommitmentTree.maxLeafPosition();
    }
    witness(position, checkpointDepth) {
        const path = this._rawCommitmentTree.witness(position, checkpointDepth);
        return path != null ? MerklePathWASM.createFromRawInstance(path) : null;
    }
    anchor() {
        return this._rawCommitmentTree.anchor();
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(CommitmentTreeWASM.prototype);
        instance._rawCommitmentTree = rawInstance;
        return instance;
    }
}
