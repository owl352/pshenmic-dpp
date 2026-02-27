import { IdentifierWASM } from './Identifier.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { IdentifierLike, PlatformVersionLike } from '../types.js';
import type { IdentityNAPI } from '../../../binaries/bindingsTypes.js';
export declare class IdentityWASM {
    /** @private **/
    _rawIdentity: IdentityNAPI;
    constructor(rawId: IdentifierLike, platformVersion?: PlatformVersionLike);
    set id(rawId: IdentifierLike);
    get id(): IdentifierWASM;
    set balance(balance: bigint);
    get balance(): bigint;
    set revision(revision: bigint);
    get revision(): bigint;
    addPublicKey(publicKey: IdentityPublicKeyWASM): void;
    getPublicKeyById(keyId: number): IdentityPublicKeyWASM | undefined;
    getPublicKeys(): IdentityPublicKeyWASM[];
    static fromHex(hex: string): IdentityWASM;
    static fromBase64(base64: string): IdentityWASM;
    static fromBytes(bytes: Uint8Array): IdentityWASM;
    bytes(): Uint8Array;
    hex(): string;
    base64(): string;
    static createFromRawInstance(rawInstance: IdentityNAPI): IdentityWASM;
    getRawInstance(): IdentityNAPI;
}
