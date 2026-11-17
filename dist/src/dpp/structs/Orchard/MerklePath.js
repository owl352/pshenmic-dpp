import { dppProvider } from '../../provider.js';
export class MerklePathWASM {
    /** @private **/
    _rawMerklePath;
    constructor(position, authPath) {
        this._rawMerklePath = new dppProvider.shielded.MerklePathNAPI(position, authPath);
    }
    get position() {
        return this._rawMerklePath.position;
    }
    set position(value) {
        this._rawMerklePath.position = value;
    }
    get authPath() {
        return this._rawMerklePath.authPath;
    }
    set authPath(value) {
        this._rawMerklePath.authPath = value;
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(MerklePathWASM.prototype);
        instance._rawMerklePath = rawInstance;
        return instance;
    }
}
