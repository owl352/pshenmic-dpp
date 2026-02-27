import type { TxOutNAPI } from '../../../../binaries/bindingsTypes.js';
export declare class TxOutWASM {
    _rawTxOut: TxOutNAPI;
    constructor(value: bigint, scriptPubKey: Uint8Array);
    get value(): bigint;
    set value(value: bigint);
    get scriptPubKeyHex(): string;
    set scriptPubKeyHex(script: string);
    get scriptPubKeyBytes(): Uint8Array;
    set scriptPubKeyBytes(script: Uint8Array);
    getScriptPubKeyASM(): string;
    static createFromRawInstance(rawInstance: TxOutNAPI): TxOutWASM;
}
