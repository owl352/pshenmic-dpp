import { DashPlatformProtocol, IdentifierLike } from '../../types.js';
import { IdentifierNAPI } from '../../../binaries/bindingsTypes.js';
export declare function setDpp(_dpp: DashPlatformProtocol): void;
export declare class IdentifierWASM {
    /** @private **/
    _rawIdentifier: IdentifierNAPI;
    constructor(rawId: IdentifierLike | IdentifierWASM);
    base58(): string;
    base64(): string;
    hex(): string;
    bytes(): Uint8Array;
    static fromBase58(id: string): IdentifierWASM;
    static fromBase64(id: string): IdentifierWASM;
    static fromHex(id: string): IdentifierWASM;
    static fromBytes(id: Uint8Array): IdentifierWASM;
    static createFromRawInstance(rawInstance: IdentifierNAPI): IdentifierWASM;
    getRawInstance(): IdentifierNAPI;
}
