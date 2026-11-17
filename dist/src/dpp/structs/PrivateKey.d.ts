import type { PrivateKeyNAPI } from '../../../binaries/bindingsTypes.js';
import { NetworkLike } from '../types.js';
import { PublicKeyWASM } from './PublicKey.js';
export declare class PrivateKeyWASM {
    /** @private **/
    _rawPrivateKey: PrivateKeyNAPI;
    constructor(key: string | Uint8Array, network: NetworkLike);
    getPublicKey(): PublicKeyWASM;
    getNetwork(): string;
    WIF(): string;
    bytes(): Uint8Array;
    hex(): string;
    getPublicKeyHash(): string;
    sign(data: Uint8Array): Uint8Array;
    signHash(dataHash: Uint8Array): Uint8Array;
    static fromWIF(wif: string): PrivateKeyWASM;
    static fromBytes(bytes: Uint8Array, network: NetworkLike): PrivateKeyWASM;
    static fromHex(hex: string, network: NetworkLike): PrivateKeyWASM;
    static createFromRawInstance(rawInstance: PrivateKeyNAPI): PrivateKeyWASM;
}
