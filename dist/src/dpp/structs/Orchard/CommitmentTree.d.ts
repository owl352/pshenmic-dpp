import type { CommitmentTreeNAPI } from 'dash-platform-shielded/bindingsTypes';
import { MerklePathWASM } from './MerklePath.js';
export declare class CommitmentTreeWASM {
    /** @private **/
    _rawCommitmentTree: CommitmentTreeNAPI;
    constructor(maxCheckpoints?: number);
    /** Appends a note commitment (cmx). `marked` = spendable (can be witnessed). */
    append(cmx: Uint8Array, marked: boolean): void;
    checkpoint(checkpointId: number): boolean;
    maxLeafPosition(): number | null;
    witness(position: number, checkpointDepth?: number): MerklePathWASM | null;
    anchor(): Uint8Array;
    static createFromRawInstance(rawInstance: CommitmentTreeNAPI): CommitmentTreeWASM;
}
