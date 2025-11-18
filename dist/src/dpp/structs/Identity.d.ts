import { IdentifierWASM } from './Identifier.js';
import { IdentityPublicKeyWASM } from './IdentityPublicKey.js';
import { DashPlatformProtocol, IdentifierLike, PlatformVersionLike } from '../../types.js';
import { IdentityNAPI } from '../../../binaries/bindingsTypes.js';
export declare function setDpp(_dpp: DashPlatformProtocol): void;
export declare class IdentityWASM {
    /** @private **/
    _rawIdentity: IdentityNAPI;
    constructor(rawId: IdentifierLike | IdentifierWASM, platformVersion?: PlatformVersionLike);
    set id(rawId: IdentifierLike | IdentifierWASM);
    get id(): IdentifierWASM;
    set balance(balance: BigInt);
    get balance(): BigInt;
    set revision(revision: BigInt);
    get revision(): BigInt;
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
