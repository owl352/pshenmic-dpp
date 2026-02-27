import { OutPointWASM } from './OutPoint.js';
import { dppProvider } from '../../provider.js';
import { IdentifierWASM } from '../Identifier.js';
export class ChainAssetLockProofWASM {
    _rawLockProof;
    constructor(coreChainLockedHeight, outPoint) {
        this._rawLockProof = new dppProvider.dpp.ChainAssetLockProofNAPI(coreChainLockedHeight, outPoint);
    }
    set coreChainLockedHeight(height) {
        this._rawLockProof.coreChainLockedHeight = height;
    }
    get coreChainLockedHeight() {
        return this._rawLockProof.coreChainLockedHeight;
    }
    set outPoint(outPoint) {
        this._rawLockProof.outPoint = outPoint._rawOutPoint;
    }
    get outPoint() {
        return OutPointWASM.createFromRawInstance(this._rawLockProof.outPoint);
    }
    createIdentityId() {
        return IdentifierWASM.createFromRawInstance(this._rawLockProof.createIdentityId());
    }
    static fromRawObject(obj) {
        const outPoint = obj.outPoint instanceof Uint8Array ? obj.outPoint : obj.outPoint.bytes();
        return ChainAssetLockProofWASM.createFromRawInstance(dppProvider.dpp.ChainAssetLockProofNAPI.fromRawObject({
            coreChainLockedHeight: obj.coreChainLockedHeight,
            outPoint
        }));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(ChainAssetLockProofWASM.prototype);
        instance._rawLockProof = rawInstance;
        return instance;
    }
}
