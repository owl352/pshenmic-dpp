import { InstantAssetLockProofWASM } from './InstantAssetLockProof.js';
import { ChainAssetLockProofWASM } from './ChainAssetLockProof.js';
import { dppProvider } from '../../provider.js';
import { OutPointWASM } from './OutPoint.js';
import { IdentifierWASM } from '../Identifier.js';
export class AssetLockProofWASM {
    _rawAssetLockProof;
    constructor(lockProof) {
        this._rawAssetLockProof = new dppProvider.dpp.AssetLockProofNAPI(lockProof._rawLockProof);
    }
    static createInstantAssetLockProof(instantLock, transaction, outputIndex) {
        return AssetLockProofWASM.createFromRawInstance(dppProvider
            .dpp
            .AssetLockProofNAPI
            .createInstantAssetLockProof(instantLock, transaction, outputIndex));
    }
    static createChainAssetLockProof(coreChainLockedHeight, outPoint) {
        return AssetLockProofWASM.createFromRawInstance(dppProvider
            .dpp
            .AssetLockProofNAPI
            .createChainAssetLockProof(coreChainLockedHeight, outPoint._rawOutPoint));
    }
    getLockType() {
        return this._rawAssetLockProof.getLockType();
    }
    getInstantLockProof() {
        return InstantAssetLockProofWASM.createFromRawInstance(this._rawAssetLockProof.getInstantLockProof());
    }
    getChainLockProof() {
        return ChainAssetLockProofWASM.createFromRawInstance(this._rawAssetLockProof.getChainLockProof());
    }
    getOutPoint() {
        const outPoint = this._rawAssetLockProof.getOutPoint();
        return (outPoint != null) ? OutPointWASM.createFromRawInstance(outPoint) : null;
    }
    createIdentityId() {
        return IdentifierWASM.createFromRawInstance(this._rawAssetLockProof.createIdentityId());
    }
    hex() {
        return this._rawAssetLockProof.hex();
    }
    static fromHex(value) {
        return AssetLockProofWASM.createFromRawInstance(dppProvider.dpp.AssetLockProofNAPI.fromHex(value));
    }
    static createFromRawInstance(rawInstance) {
        const instance = Object.create(AssetLockProofWASM.prototype);
        instance._rawAssetLockProof = rawInstance;
        return instance;
    }
}
