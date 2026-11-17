import type { InstantAssetLockProofNAPI } from '../../../../binaries/bindingsTypes.js';
import { TxOutWASM } from './TxOut.js';
import { OutPointWASM } from './OutPoint.js';
import { InstantLockWASM } from '../InstantLock.js';
import { IdentifierWASM } from '../Identifier.js';
export declare class InstantAssetLockProofWASM {
    _rawLockProof: InstantAssetLockProofNAPI;
    constructor(instantLock: Uint8Array, transaction: Uint8Array, outputIndex: number);
    get outputIndex(): number;
    set outputIndex(value: number);
    get instantLock(): InstantLockWASM;
    set instantLock(instantLock: InstantLockWASM);
    getOutput(): TxOutWASM | null;
    getOutPoint(): OutPointWASM | null;
    getTransaction(): Uint8Array;
    getInstantLockBytes(): Uint8Array;
    createIdentityId(): IdentifierWASM;
    static fromRawObject(obj: {
        instantLock: Uint8Array;
        transaction: Uint8Array;
        outputIndex: number;
    }): InstantAssetLockProofWASM;
    static createFromRawInstance(rawInstance: InstantAssetLockProofNAPI): InstantAssetLockProofWASM;
}
