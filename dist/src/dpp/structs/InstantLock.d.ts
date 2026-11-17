import type { InstantLockNAPI } from '../../../binaries/bindingsTypes.js';
import { OutPointWASM } from './AssetLockProof/OutPoint.js';
export declare class InstantLockWASM {
    _rawInstantLock: InstantLockNAPI;
    constructor(version: number, inputs: OutPointWASM[], txId: string, cycleHash: string, blsSignature: string);
    get version(): number;
    set version(version: number);
    get inputs(): OutPointWASM[];
    set inputs(inputs: OutPointWASM[]);
    get txid(): string;
    set txid(txid: string);
    get cyclehash(): string;
    set cyclehash(hash: string);
    get blsSignature(): string;
    set blsSignature(sig: string);
    static createFromRawInstance(rawInstance: InstantLockNAPI): InstantLockWASM;
}
