import type { SerializedActionNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class SerializedActionWASM {
    /** @private **/
    _rawSerializedAction: SerializedActionNAPI;
    constructor(nullifier: Uint8Array, rk: Uint8Array, cmx: Uint8Array, encryptedNote: Uint8Array, cvNet: Uint8Array, spendAuthSig: Uint8Array);
    bytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): SerializedActionWASM;
    get nullifier(): Uint8Array;
    set nullifier(value: Uint8Array);
    get rk(): Uint8Array;
    set rk(value: Uint8Array);
    get cmx(): Uint8Array;
    set cmx(value: Uint8Array);
    get encryptedNote(): Uint8Array;
    set encryptedNote(value: Uint8Array);
    get cvNet(): Uint8Array;
    set cvNet(value: Uint8Array);
    get spendAuthSig(): Uint8Array;
    set spendAuthSig(value: Uint8Array);
    static createFromRawInstance(rawInstance: SerializedActionNAPI): SerializedActionWASM;
}
