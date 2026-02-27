import type { CoreScriptNAPI } from '../../../binaries/bindingsTypes.js';
import { NetworkLike } from '../types.js';
export declare class CoreScriptWASM {
    _rawCoreScript: CoreScriptNAPI;
    toAddress(network: NetworkLike): string;
    toString(): string;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    ASMString(): string;
    static fromBytes(bytes: Uint8Array): CoreScriptWASM;
    static newP2PKH(keyHash: Uint8Array): CoreScriptWASM;
    static newP2SH(scriptHash: Uint8Array): CoreScriptWASM;
    static createFromRawInstance(rawInstance: CoreScriptNAPI): CoreScriptWASM;
}
