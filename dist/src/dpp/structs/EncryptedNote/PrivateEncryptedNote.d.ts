import type { PrivateEncryptedNoteNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class PrivateEncryptedNoteWASM {
    /** @private **/
    _rawEncryptedNote: PrivateEncryptedNoteNAPI;
    constructor(rootEncryptionKeyIndex: number, derivationEncryptionKeyIndex: number, value: Uint8Array);
    get rootEncryptionKeyIndex(): number;
    set rootEncryptionKeyIndex(index: number);
    get derivationEncryptionKeyIndex(): number;
    set derivationEncryptionKeyIndex(index: number);
    get value(): Uint8Array;
    set value(value: Uint8Array);
    static createFromRawInstance(rawInstance: PrivateEncryptedNoteNAPI): PrivateEncryptedNoteWASM;
}
