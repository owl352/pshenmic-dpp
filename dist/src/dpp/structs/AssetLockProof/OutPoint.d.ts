import type { OutPointNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class OutPointWASM {
    /** @private **/
    _rawOutPoint: OutPointNAPI;
    constructor(txId: string, vout: number);
    getVOUT(): number;
    getTXID(): string;
    bytes(): Uint8Array;
    base64(): string;
    hex(): string;
    static fromBytes(bytes: Uint8Array): OutPointWASM;
    static fromHex(bytes: string): OutPointWASM;
    static fromBase64(bytes: string): OutPointWASM;
    static createFromRawInstance(rawInstance: OutPointNAPI): OutPointWASM;
}
