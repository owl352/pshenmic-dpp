import type { ChainAssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js';
import { OutPointWASM } from './OutPoint.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class ChainAssetLockProofWASM {
    _rawLockProof: ChainAssetLockProofNAPI;
    constructor(coreChainLockedHeight: number, outPoint: OutPointWASM);
    set coreChainLockedHeight(height: number);
    get coreChainLockedHeight(): number;
    set outPoint(outPoint: OutPointWASM);
    get outPoint(): OutPointWASM;
    createIdentityId(): IdentifierWASM;
    static fromRawObject(obj: {
        coreChainLockedHeight: number;
        outPoint: OutPointWASM | Uint8Array;
    }): ChainAssetLockProofWASM;
    static createFromRawInstance(rawInstance: ChainAssetLockProofNAPI): ChainAssetLockProofWASM;
}
