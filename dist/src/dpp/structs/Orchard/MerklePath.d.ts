import type { MerklePathNAPI } from 'dash-platform-shielded/bindingsTypes';
export declare class MerklePathWASM {
    /** @private **/
    _rawMerklePath: MerklePathNAPI;
    constructor(position: number, authPath: Uint8Array[]);
    get position(): number;
    set position(value: number);
    get authPath(): Uint8Array[];
    set authPath(value: Uint8Array[]);
    static createFromRawInstance(rawInstance: MerklePathNAPI): MerklePathWASM;
}
