import type { PublicKeyNAPI } from '../../../binaries/bindingsTypes.js';
export declare class PublicKeyWASM {
    /** @private **/
    _rawPublicKey: PublicKeyNAPI;
    constructor(compressed: boolean, bytes: Uint8Array);
    get compressed(): boolean;
    set compressed(value: boolean);
    get inner(): Uint8Array;
    set inner(value: Uint8Array);
    getPublicKeyHash(): string;
    hash160(): Uint8Array;
    bytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): PublicKeyWASM;
    static createFromRawInstance(rawInstance: PublicKeyNAPI): PublicKeyWASM;
}
