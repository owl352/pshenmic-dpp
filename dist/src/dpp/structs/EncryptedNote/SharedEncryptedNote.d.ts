import type { SharedEncryptedNoteNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class SharedEncryptedNoteWASM {
    /** @private **/
    _rawSharedNote: SharedEncryptedNoteNAPI;
    constructor(senderKeyIndex: number, recipientKeyIndex: number, value: Uint8Array);
    get senderKeyIndex(): number;
    set senderKeyIndex(index: number);
    get recipientKeyIndex(): number;
    set recipientKeyIndex(index: number);
    get value(): Uint8Array;
    set value(value: Uint8Array);
    static createFromRawInstance(rawInstance: SharedEncryptedNoteNAPI): SharedEncryptedNoteWASM;
}
