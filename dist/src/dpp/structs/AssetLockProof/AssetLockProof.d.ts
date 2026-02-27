import type { AssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js';
import { InstantAssetLockProofWASM } from './InstantAssetLockProof.js';
import { ChainAssetLockProofWASM } from './ChainAssetLockProof.js';
import { OutPointWASM } from './OutPoint.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class AssetLockProofWASM {
    _rawAssetLockProof: AssetLockProofNAPI;
    constructor(lockProof: InstantAssetLockProofWASM | ChainAssetLockProofWASM);
    static createInstantAssetLockProof(instantLock: Uint8Array, transaction: Uint8Array, outputIndex: number): AssetLockProofWASM;
    static createChainAssetLockProof(coreChainLockedHeight: number, outPoint: OutPointWASM): AssetLockProofWASM;
    getLockType(): string;
    getInstantLockProof(): InstantAssetLockProofWASM;
    getChainLockProof(): ChainAssetLockProofWASM;
    getOutPoint(): OutPointWASM | null;
    createIdentityId(): IdentifierWASM;
    hex(): string;
    static fromHex(value: string): AssetLockProofWASM;
    static createFromRawInstance(rawInstance: AssetLockProofNAPI): AssetLockProofWASM;
}
